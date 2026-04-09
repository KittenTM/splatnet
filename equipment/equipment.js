window.loadHeader(async function(headerContainer) {
    const logoutForm = document.getElementById("logout-form");
    if (logoutForm) {
        logoutForm.action = "/api/v1/spfn/logout";
        const originInput = document.getElementById("logout_frontend_origin");
        if (originInput) originInput.value = window.location.origin;
        logoutForm.addEventListener('submit', () => {
            sessionStorage.removeItem('user_cache');
        });
    }

    const twitterBtn = document.getElementById('twitter-link-btn');
    const twitterLabel = document.getElementById('twitter-label-img');

    const handleTwitterAction = () => {
        const isLinked = twitterBtn.dataset.linked === "true";
        if (isLinked) {
            if (!confirm("Unlink Twitter account?")) return;
            fetch("/api/v1/me/twitter/unlink", { method: "POST", credentials: 'include' })
                .then(() => window.location.reload());
        } else {
            twitterBtn.style.opacity = "0.5";
            twitterBtn.style.pointerEvents = "none";
            fetch("/api/v1/me/twitter/link", { credentials: 'include' })
                .then(res => res.status === 401 ? (window.location.href = "/sign_in/") : res.json())
                .then(data => data?.url ? (window.location.href = data.url) : window.location.reload())
                .catch(() => window.location.reload());
        }
    };

    if (twitterBtn) {
        twitterBtn.addEventListener('click', handleTwitterAction);
    }

    const updateTwitterUI = () => {
        if (!twitterBtn || !twitterLabel) return;
        fetch("/api/v1/me/twitter/status", { credentials: 'include' })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.is_linked) {
                    twitterBtn.dataset.linked = "true";
                    twitterLabel.src = "/assets/en/svg/text/menu/tx_twitter_Cancel-34186e4e830964405f2528210d7278206d255bf40b69559babc36a7a041e0394.svg";
                    twitterLabel.alt = "Unlink Twitter";
                    twitterLabel.style.scale = "1.6";
                    twitterLabel.style.marginLeft = "30px";
                    twitterLabel.style.translate = "-10px -2px";
                } else {
                    twitterBtn.dataset.linked = "false";
                    twitterLabel.src = "/assets/en/svg/text/menu/tx_twitter-47ce083cc4514ab6aeb75b7dd9f71ce89ddc54a18d930d90cf4df62047413831.svg";
                    twitterLabel.alt = "Link Twitter";
                    twitterLabel.style.scale = "";
                    twitterLabel.style.marginLeft = "";
                    twitterLabel.style.translate = "";
                }
            })
            .catch(() => {
                twitterBtn.dataset.linked = "false";
            });
    };

    const extractMiiName = (miiDataB64) => {
        try {
            const binaryString = atob(miiDataB64.replace(/-/g, '+').replace(/_/g, '/'));
            const data = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                data[i] = binaryString.charCodeAt(i);
            }
            const size = data.length;
            let offset = -1;
            let isBE = false;
            if ([92, 96, 104, 106, 108, 336, 72].includes(size)) offset = 0x1A;
            else if ([74, 76].includes(size)) { offset = 0x02; isBE = true; }
            else if (size === 88) offset = 0x10;
            else if ([48, 68].includes(size)) offset = 0x1C;
            if (offset === -1) return null;
            const decoder = new TextDecoder(isBE ? 'utf-16be' : 'utf-16le');
            let end = offset;
            while (end < offset + 20 && end + 1 < data.length && (data[end] !== 0 || data[end + 1] !== 0)) {
                end += 2;
            }
            return decoder.decode(data.slice(offset, end));
        } catch (e) {
            return null;
        }
    };

    const udemaeMap = {
        "0": "C-", "1": "C", "2": "C+", "3": "B-", "4": "B",
        "5": "B+", "6": "A-", "7": "A", "8": "A+", "9": "S", "10": "S+"
    };

    let combinedData = {};
    let mappingCache = null;

    const preloadImage = (url) => {
        return new Promise((resolve) => {
            if (!url) return resolve();
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = url;
        });
    };

    const renderData = async (newData, isFinalFallback = false) => {
        if (!newData) return;

        let data = newData;
        while (typeof data === 'string') {
            try { 
                data = JSON.parse(data); 
            } catch (e) { 
                console.error("Parse Error:", e);
                break; 
            }
        }

        combinedData = { ...combinedData, ...data };
        const finalData = combinedData;
        const equipped = finalData.last_equipped || {};
        const history = finalData.history || [];
        
        const miiBlob = (finalData.mii && finalData.mii.data) || finalData.mii_data;
        const parsedName = miiBlob ? extractMiiName(miiBlob) : null;
        const name = parsedName || (finalData.mii && finalData.mii.name) || finalData.nickname || finalData.user_id || finalData.mii_name || "User";
        
        const miiImgUrl = miiBlob ? `https://mii-unsecure.ariankordi.net/miis/image.png?data=${encodeURIComponent(miiBlob)}&type=face&width=270` : "";

        const sidebarName = document.getElementById('mii-name');
        const sidebarImg = document.getElementById('mii-img');
        if (sidebarName) sidebarName.textContent = name;
        if (sidebarImg && miiImgUrl) {
            sidebarImg.src = miiImgUrl;
            sidebarImg.style.display = 'block';
        }

        const infoBox = document.querySelector('.splat-info-box');
        if (infoBox) {
            if (!mappingCache) {
                const fetchJson = url => fetch(url).then(r => r.ok ? r.json() : []);
                mappingCache = await Promise.all([
                    fetchJson('/assets/mapping/clothing.json'),
                    fetchJson('/assets/mapping/headgear.json'),
                    fetchJson('/assets/mapping/shoes.json'),
                    fetchJson('/assets/mapping/weapons.json'),
                    fetchJson('/assets/mapping/ability.json')
                ]);
            }
            const [clothing, headgear, shoes, weapons, abilities] = mappingCache;

            const getImg = (list, id, folder, isAbility = false) => {
                const weaponFallback = "/assets/weapons/NotFound^t.bflim.png";
                const abilityFallback = "../assets/ability/ParameterIcon^q.png";
                
                if (id === undefined || id === null) {
                    return isAbility ? abilityFallback : weaponFallback;
                }
                const item = list.find(i => String(i.id) === String(id));
                if (item && item.image) return `../assets/${folder}/${item.image}`;
                
                return isAbility ? abilityFallback : weaponFallback;
            };

            const weaponImg = getImg(weapons, equipped.weapon, 'weapons');
            const headImg = getImg(headgear, equipped.Gear_Head, 'headgear');
            const clothesImg = getImg(clothing, equipped.Gear_Clothes, 'clothing');
            const shoesImg = getImg(shoes, equipped.Gear_Shoes, 'shoes');

            const headMain = getImg(abilities, equipped.Gear_Head_Skill0, 'ability', true);
            const headSub1 = getImg(abilities, equipped.Gear_Head_Skill1, 'ability', true);
            const headSub2 = getImg(abilities, equipped.Gear_Head_Skill2, 'ability', true);
            const headSub3 = getImg(abilities, equipped.Gear_Head_Skill3, 'ability', true);

            const clothesMain = getImg(abilities, equipped.Gear_Clothes_Skill0, 'ability', true);
            const clothesSub1 = getImg(abilities, equipped.Gear_Clothes_Skill1, 'ability', true);
            const clothesSub2 = getImg(abilities, equipped.Gear_Clothes_Skill2, 'ability', true);
            const clothesSub3 = getImg(abilities, equipped.Gear_Clothes_Skill3, 'ability', true);

            const shoesMain = getImg(abilities, equipped.Gear_Shoes_Skill0, 'ability', true);
            const shoesSub1 = getImg(abilities, equipped.Gear_Shoes_Skill1, 'ability', true);
            const shoesSub2 = getImg(abilities, equipped.Gear_Shoes_Skill2, 'ability', true);
            const shoesSub3 = getImg(abilities, equipped.Gear_Shoes_Skill3, 'ability', true);
            
            await Promise.all([
                preloadImage(miiImgUrl),
                preloadImage(weaponImg),
                preloadImage(headImg),
                preloadImage(clothesImg),
                preloadImage(shoesImg)
            ]);

            const rankLevel = (equipped.Rank !== undefined ? equipped.Rank : finalData.Rank ?? 0) + 1;
            const udemaeKey = equipped.Udemae !== undefined ? String(equipped.Udemae) : String(finalData.Udemae || "");
            const rankGrade = udemaeMap[udemaeKey] || (udemaeKey !== "undefined" && udemaeKey !== "" ? udemaeKey : "--");

            const renderImg = (src, className) => {
                const fallback = className.includes('weapon') || className.includes('gear') ? 'this.src="/assets/weapons/NotFound^t.bflim.png"' : 'this.src="../assets/ability/ParameterIcon^q.png"';
                return src ? `<img class="${className}" src="${src}" onerror='${fallback}' />` : '';
            };
            const renderSub = (src) => src ? `<img src="${src}" onerror='this.src="../assets/ability/ParameterIcon^q.png"' />` : '';

            let historyHtml = '';
            if (history.length > 0) {
                const sortedHistory = [...history].sort((a, b) => Number(b.sumpaint) - Number(a.sumpaint));
                
                historyHtml = sortedHistory.map(item => {
                    const hWeaponImg = getImg(weapons, item.weapon, 'weapons');
                    const paintVal = Number(item.sumpaint);
                    const displayPaint = paintVal > 999999 ? "999999" : paintVal;

                    return `
                        <div class="weapon-painted-black-box">
                            <div class="weapon-icon-bg-wrapper">
                                 <img src="${hWeaponImg}" class="weapon-inked-icon" onerror='this.src="/assets/weapons/NotFound^t.bflim.png"'>
                            </div>
                            <div class="weapon-painted-text">${displayPaint}p</div>
                        </div>
                    `;
                }).join('');
            }

            infoBox.innerHTML = `
                <div id="scale-root">
                    <div id="canvas">
                        <div class="panel"></div>
                        <div class="white-dot" style="display: flex; align-items: center; justify-content: center; overflow: hidden; background: white; border-radius: 50%;">
                            ${miiImgUrl ? `<img src="${miiImgUrl}" style="width: 100%; height: 100%; object-fit: contain;">` : ''}
                        </div>
                        <div class="player-name">${name}</div>
                        <div class="rank-box rank-level">
                            <span class="rank-text">${rankLevel}</span>
                            <img src="../assets/en/svg/text/scene/equipment/tx_rank-2bcc8d331694f06c2af30e720acafda60760c71f086906489afb73190a6913ce.svg" class="rank-label" />
                        </div>
                        <div class="rank-box rank-grade">
                            <span class="rank-text">${rankGrade}</span>
                            <img src="../assets/en/svg/text/scene/equipment/tx_udemae-3f0e377d89a469c62069c2304dae87dfdf2b98076a0a4662b9190800c2d9da91.svg" class="rank-label" />
                        </div>
                        <div class="weapon-slot">${renderImg(weaponImg, 'weapon')}</div>
                        
                        <div class="gear-slot-small head-slot">
                            ${renderImg(headMain, 'main-ability')}
                            ${renderImg(headImg, 'gear-icon')}
                        </div>
                        <div class="abilities mid">
                            ${renderSub(clothesSub1)}${renderSub(clothesSub2)}${renderSub(clothesSub3)}
                        </div>

                        <div class="gear-slot-small body-slot">
                            ${renderImg(clothesMain, 'main-ability')}
                            ${renderImg(clothesImg, 'gear-icon')}
                        </div>
                        <div class="abilities bottom">
                            ${renderSub(headSub1)}${renderSub(headSub2)}${renderSub(headSub3)}
                        </div>

                        <div class="gear-slot-small shoes-slot">
                            ${renderImg(shoesMain, 'main-ability')}
                            ${renderImg(shoesImg, 'gear-icon')}
                        </div>
                        <div class="abilities bottom-right">
                            ${renderSub(shoesSub1)}${renderSub(shoesSub2)}${renderSub(shoesSub3)}
                        </div>
                    </div>
                </div>
                
                <div class="inked-section-container">
                    <div class="area-inked-title-wrapper">
                        <img src="/assets/en/svg/text/scene/equipment/tx_painted-ab352ac64b62b5c8e5e118f40bb20d9130f0987b7813e1587bf4c39daa40ec4f.svg" class="area-inked-title-img">
                    </div>
                    ${historyHtml}
                </div>
            `;
        }
        updateTwitterUI();
    };

    const init = async () => {
        const overlay = document.getElementById("loading-overlay");
        const infoBox = document.querySelector('.splat-info-box');
        if (infoBox) infoBox.style.visibility = "hidden";
        let cacheFound = false;

        const cached = sessionStorage.getItem('user_cache');
        if (cached) {
            try {
                await renderData(JSON.parse(cached), false);
                cacheFound = true;
            } catch (e) {}
        }

        try {
            const handleFetch = async (url) => {
                const res = await fetch(url, { credentials: 'include' });
                if (res.redirected) {
                    window.location.href = res.url;
                    return {};
                }
                return res.ok ? res.json() : {};
            };

            const [profileRes, equipRes, historyRes] = await Promise.all([
                handleFetch("/api/v1/me"),
                handleFetch("/api/v1/me/equipment"),
                handleFetch("/api/v1/me/equipment/history")
            ]);

            const hasNullFields = !equipRes || Object.values(equipRes).some(v => v === null);

            if (hasNullFields) {
                await renderData(profileRes, false);
                if (infoBox) {
                    infoBox.innerHTML = `
                        <div class="info-message-box">
                            <p>
                                To use this service, it is required for you to play at least one game on Splatfestival Network.
                                Play a match on your Wii U on Splatoon!<br><br>

                                Note: This service does not support Cemu due to how the emulator does not support POST requests.
                            </p>
                        </div>`;
                }
            } else {
                await renderData(profileRes, false);
                await renderData(equipRes, false);
                await renderData({ history: Array.isArray(historyRes) ? historyRes : [] }, false);
                sessionStorage.setItem('user_cache', JSON.stringify(combinedData));
            }
        } catch (err) {
            if (cacheFound) {
                await renderData(sessionStorage.getItem('user_cache'), true);
            } else {
                await renderData({ user_id: "Guest" }, true);
            }
        } finally {
            if (overlay) overlay.style.display = "none";
            if (infoBox) infoBox.style.visibility = "visible";
        }
    };

    const equipButton = headerContainer.querySelector('.menu-item.equipment');
    if (equipButton) equipButton.classList.add('active');

    init();
});