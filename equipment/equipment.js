window.loadHeader(function(headerContainer) {
    const logoutForm = document.getElementById("logout-form");
    if (logoutForm) {
        logoutForm.action = "/api/v1/spfn/logout";
        const originInput = document.getElementById("logout_frontend_origin");
        if (originInput) originInput.value = window.location.origin;
        logoutForm.addEventListener('submit', () => {
            sessionStorage.removeItem('user_cache');
        });
    }

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

    const preloadImage = (url) => {
        return new Promise((resolve) => {
            if (!url) return resolve();
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = url;
        });
    };

    const renderData = async (newData) => {
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
            const fetchJson = url => fetch(url).then(r => r.ok ? r.json() : []);
            const [clothing, headgear, shoes, weapons, abilities] = await Promise.all([
                fetchJson('/assets/mapping/clothing.json'),
                fetchJson('/assets/mapping/headgear.json'),
                fetchJson('/assets/mapping/shoes.json'),
                fetchJson('/assets/mapping/weapons.json'),
                fetchJson('/assets/mapping/ability.json')
            ]);

            const getImg = (list, id, folder, isAbility = false) => {
                const fallback = isAbility ? "../assets/ability/ParameterIcon^q.png" : "/assets/weapons/NotFound^w.png";
                if (id === undefined || id === null) return fallback;
                const item = list.find(i => String(i.id) === String(id));
                return (item && item.image) ? `../assets/${folder}/${item.image}` : fallback;
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

            const rankLevel = equipped.Rank !== undefined ? equipped.Rank : (finalData.Rank || "--");
            const udemaeKey = equipped.Udemae !== undefined ? String(equipped.Udemae) : String(finalData.Udemae || "");
            const rankGrade = udemaeMap[udemaeKey] || (udemaeKey !== "undefined" && udemaeKey !== "" ? udemaeKey : "C-");

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
                        <div class="weapon-slot"><img class="weapon" src="${weaponImg}" /></div>
                        
                        <div class="gear-slot-small head-slot">
                            <img class="main-ability" src="${headMain}" />
                            <img class="gear-icon" src="${headImg}" />
                        </div>
                        <div class="abilities mid">
                            <img src="${clothesSub1}" /><img src="${clothesSub2}" /><img src="${clothesSub3}" />
                        </div>

                        <div class="gear-slot-small body-slot">
                            <img class="main-ability" src="${clothesMain}" />
                            <img class="gear-icon" src="${clothesImg}" />
                        </div>
                        <div class="abilities bottom">
                            <img src="${headSub1}" /><img src="${headSub2}" /><img src="${headSub3}" />
                        </div>

                        <div class="gear-slot-small shoes-slot">
                            <img class="main-ability" src="${shoesMain}" />
                            <img class="gear-icon" src="${shoesImg}" />
                        </div>
                        <div class="abilities bottom-right">
                            <img src="${shoesSub1}" /><img src="${shoesSub2}" /><img src="${shoesSub3}" />
                        </div>
                    </div>
                </div>
                <div class="area-inked-title-image-container">
                    <img src="/assets/en/svg/text/scene/equipment/tx_painted-ab352ac64b62b5c8e5e118f40bb20d9130f0987b7813e1587bf4c39daa40ec4f.svg" class="area-inked-title">
                </div>
            `;
        }
    };

    const init = async () => {
        const overlay = document.getElementById("loading-overlay");
        try {
            const [profileRes, equipRes] = await Promise.all([
                fetch("/api/v1/me", { credentials: 'include' }).then(res => res.ok ? res.json() : {}),
                fetch("/api/v1/me/equipment", { credentials: 'include' }).then(res => res.ok ? res.json() : {})
            ]);
            await renderData(profileRes);
            await renderData(equipRes);
            sessionStorage.setItem('user_cache', JSON.stringify(combinedData));
        } catch (err) {
            const cached = sessionStorage.getItem('user_cache');
            if (cached) await renderData(JSON.parse(cached));
            else await renderData({ user_id: "Guest" });
        } finally {
            if (overlay) overlay.style.display = "none";
        }
    };

    const equipButton = headerContainer.querySelector('.menu-item.equipment');
    if (equipButton) equipButton.classList.add('active');

    init();
});