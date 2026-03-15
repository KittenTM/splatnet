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
        const name = (finalData.mii && finalData.mii.name) || finalData.user_id || finalData.mii_name || "User";
        const miiBlob = (finalData.mii && finalData.mii.data) || finalData.mii_data;
        const miiImgUrl = miiBlob ? `https://mii-unsecure.ariankordi.net/miis/image.png?erri=s6u7r-rsp&data=${encodeURIComponent(miiBlob)}&type=face&width=270` : "";

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
            const [clothing, headgear, shoes, weapons] = await Promise.all([
                fetchJson('/assets/mapping/clothing.json'),
                fetchJson('/assets/mapping/headgear.json'),
                fetchJson('/assets/mapping/shoes.json'),
                fetchJson('/assets/mapping/weapons.json')
            ]);

            const getImg = (list, id, folder) => {
                if (!id) return "/assets/weapons/NotFound^w.png";
                const item = list.find(i => i.id == id);
                return (item && item.image) ? `../assets/${folder}/${item.image}` : "/assets/weapons/NotFound^w.png";
            };

            const weaponImg = getImg(weapons, equipped.weapon, 'weapons');
            const headImg = getImg(headgear, equipped.Gear_Head, 'headgear');
            const clothesImg = getImg(clothing, equipped.Gear_Clothes, 'clothing');
            const shoesImg = getImg(shoes, equipped.Gear_Shoes, 'shoes');
            
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
                            <img class="main-ability" src="../assets/5254acc940ed.svg" />
                            <img class="gear-icon" src="${headImg}" />
                        </div>
                        <div class="gear-slot-small body-slot">
                            <img class="main-ability" src="../assets/783c945642a1.svg" />
                            <img class="gear-icon" src="${clothesImg}" />
                        </div>
                        <div class="gear-slot-small shoes-slot">
                            <img class="main-ability" src="../assets/d24a8ad84d94.svg" />
                            <img class="gear-icon" src="${shoesImg}" />
                        </div>
                        <div class="abilities bottom"><img src="../assets/55de981c4381.svg" /><img src="../assets/454c84bf43a2.svg" /><img src="../assets/b2d582c44ba2.svg" /></div>
                        <div class="abilities mid"><img src="../assets/c9c9af9f4a95.svg" /><img src="../assets/cae6942642cb.svg" /><img src="../assets/7422b1b94163.svg" /></div>
                        <div class="abilities bottom-right"><img src="../assets/a9f6b59c43d4.svg" /><img src="../assets/d8fa88484989.svg" /><img src="../assets/a15bb02a4d1c.svg" /></div>
                    </div>
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