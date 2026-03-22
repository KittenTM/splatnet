window.loadHeader(async function(headerContainer) {
    const rankButton = headerContainer.querySelector('.menu-item.rank');
    if (rankButton) {
        rankButton.classList.add('active');
    }

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
            const data = Uint8Array.from(atob(miiDataB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
            const size = data.length;
            let offset = -1;
            let isBE = false;

            if ([92, 96, 104, 106, 108, 336, 72].includes(size)) offset = 0x1A; // 3DS/WiiU
            else if ([74, 76].includes(size)) { offset = 0x02; isBE = true; }    // Wii
            else if (size === 88) offset = 0x10;                                // Switch CharInfo
            else if ([48, 68].includes(size)) offset = 0x1C;                    // Switch CoreData

            if (offset === -1) return null;

            const decoder = new TextDecoder(isBE ? 'utf-16be' : 'utf-16le');
            let end = offset;
            while (end < offset + 20 && (data[end] !== 0 || data[end + 1] !== 0)) end += 2;
            return decoder.decode(data.slice(offset, end));
        } catch (e) {
            return null;
        }
    };

    const getMiiRenderUrl = (data) => {
        return `https://mii-unsecure.ariankordi.net/miis/image.png?data=${encodeURIComponent(data)}&type=face&width=270&resourceType=very_high`;
    };

    const renderData = (data) => {
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) { console.error(e); }
        }
        
        const nameEl = document.getElementById('mii-name');
        const imgEl = document.getElementById('mii-img');
        const miiBlob = (data.mii && data.mii.data) || data.mii_data;
        
        if (nameEl) {
            const parsedName = miiBlob ? extractMiiName(miiBlob) : null;
            nameEl.textContent = parsedName || (data.mii && data.mii.name) || data.nickname || data.username || "User";
        }
        
        if (imgEl && miiBlob) {
            imgEl.src = getMiiRenderUrl(miiBlob);
            imgEl.style.display = 'block';
        }

        updateTwitterUI();
    };

    const getRankIcon = (rank, mode) => {
        const modeColor = {
            regular: 'green',
            gachi: 'orange',
            fes: 'purple'
        }[mode] || 'green';

        const iconHashes = {
            green: {
                1: "c54d4ba3d0651b1ee50a6df24b0692afa22dc6792b6e3a9bbe5a5e089ccf9515",
                2: "f05fa75efc1803029130a07b3b87b394d638b7558386057568317a4bcca636cb",
                3: "d327346e1997c941fb6d1a39922e89fb5c9fe1e78feb2a11de0b7e18e589b2aa",
                4: "fad2da0c0135f5511d0033b6f9df1176e786dbb1dc80518c5459ebdacf3f6fa3",
                5: "6158cc1815800a58a180f3c8dd0ff194978325795d43a168e3d6c5653a30cb20",
                6: "01dde34f3fda5fb4a18f96a60d83261c555f7adf2b274d4518bd2b464a171ef8",
                7: "9135b2919cfb0c37ce7f269edceaf4028e3e9f4a22e49e2e6c80913d73f55605",
                8: "641f727121544e3f8b84cc3059f30188e8121a195f4d47ea53bd3acae5ed0397",
                9: "42923a55266d346994722a719a7b76334ba7247b72eea9affa6dc71ba47f648a"
            },
            orange: {
                1: "74328e96411c9d85b7a09cf021022e650e8baf24b1ebd0e6d088c12abb034403",
                2: "48ae3f075ee261faf58f5fbc878ef6535044d089a039fad065a119b7ec353323",
                3: "f039770517a13c41bd86a5837a8949a91d496cc2db33c90ccfc5c601b369efb7",
                4: "e9264e1d9066804ffc92f831c4501256a41d2ddde2df7803b0c434fc95f901a1",
                5: "c961244cc0d6683e1352fc8362d42632e3fb8236b8bbc74fcfeb79e8be439992",
                6: "bbb6348726eb8fde9adcd9eee9191238ffc1a5ef73f306b0c8d095818ac4d3e8",
                7: "42f9af312aa30482e705635b85e1232f1e89f055d7460aa0361c642a5ec1ad65",
                8: "ffdb8ef663130e9d0dee82ecdeab69c006dbe2dc05ff41352b79b7d21b9f3902",
                9: "b6363055cba47768e05b222390ebf1c9c09af70d3cbd6896dc68c86707311c6e"
            },
            purple: {
                1: "e854b65457dce33c1570ee22dfdc6f3dbe74b49606d08bc92d69fb6d1ed7690a",
                2: "50c81f51ce9f30ce89dd3f01a9812c846e7fbb7a00fc95d72726a772d2ef5bd7",
                3: "0901c032e718a09d5e4c9c1f47646a3958da7bb566a2d4da06322d7be2a911aa",
                4: "a2e279292822c0f181b7726bcef1ee6c3d7a18b2763ec4d8c0a54ca452fc5e04",
                5: "16e43ef9f23e514f900ede4bde7bcb81aa062af961c553374fc7c80566cf8b47",
                6: "1ed2cae2808bb656eb89d986c9e10289fc273cb7d026b989af0aac39722c6989",
                7: "8cae82b95463c7ca3ab55f0bf652d10e2212b43d99e442d89fda9b1951c8b261",
                8: "faf0aa1407d058709db1338ba8d4c42495911d63e77e9653b74b26ff25f4f355",
                9: "68d2b702b4240b2cd2886fb146d2c9835e1a2fd79b8d218cb5b7fb32cecb4bfa"
            }
        };

        const hash = iconHashes[modeColor][rank];
        return `../assets/en/svg/text/scene/rank/number/tx_nb_${rank}_${modeColor}-${hash}.svg`;
    };

    let cachedLeaderboardData = null;
    let mappingCache = null;

    const renderRankings = async (mode) => {
        const container = document.getElementById('ranking-cards-container');
        if (!container || !cachedLeaderboardData) return;
        
        container.innerHTML = ''; 

        if (!mappingCache) {
            const fetchJson = url => fetch(url).then(r => r.ok ? r.json() : []);
            mappingCache = await Promise.all([
                fetchJson('/assets/mapping/clothing.json'),
                fetchJson('/assets/mapping/headgear.json'),
                fetchJson('/assets/mapping/shoes.json'),
                fetchJson('/assets/mapping/weapons.json')
            ]);
        }
        const [clothing, headgear, shoes, weapons] = mappingCache;

        const getImg = (list, id, folder) => {
            const fallback = "/assets/weapons/NotFound^w.png";
            if (id === undefined || id === null) return fallback;
            const item = list.find(i => String(i.id) === String(id));
            if (item && item.image) return `../assets/${folder}/${item.image}`;
            return fallback;
        };

        const modeMap = { 'regular': 0, 'gachi': 1, 'fes': 2 };
        const apiModeKey = `mode_${modeMap[mode] || 0}`;
        const players = cachedLeaderboardData[apiModeKey] || [];
        const isFes = mode === 'fes';

        players.forEach((player, index) => {
            const rankNum = index + 1;
            const displayScore = Math.round(player.RankingScore);
            
            const powerIconHtml = (isFes && player.is_top_100_fes) 
                ? `<img src="/assets/en/svg/ui/34b4b97a4411.svg" class="rank-power-icon">` 
                : '';

            const weaponImg = getImg(weapons, player.weapon, 'weapons');
            const headImg = getImg(headgear, player.headgear, 'headgear');
            const clothesImg = getImg(clothing, player.clothes, 'clothing');
            const shoesImg = getImg(shoes, player.shoes, 'shoes');
            let miiImgUrl = `https://mii.spfn.net/${player.PId}/main.png`;
            if (String(player.PId) === "1582814308") {
                miiImgUrl = "/assets/faceimg.png"
            }
            const fallbackMii = `/assets/weapons/ParameterIcon^q.png`;

            const card = document.createElement('div');
            card.className = `rank-card-container`;
            card.innerHTML = `
                <div class="rank-bg"></div>
                <div class="rank-profile-circle">
                    <img src="${miiImgUrl}" 
                         class="rank-mii-img" 
                         onerror="this.src='${fallbackMii}'; this.style.filter='invert(1)';" 
                         style="width: 100%; height: 100%; border-radius: 50%; object-fit: contain;">
                </div>
                <img src="${getRankIcon(rankNum, mode)}" class="rank-accent ${!isFes ? 'standard-mode-fix' : ''}">
                <div class="rank-name-row">
                    ${powerIconHtml}
                    <div class="rank-name">${player.MiiName || 'User'}</div>
                </div>
                <div class="rank-power-value">${displayScore}</div>
                <div class="rank-gear-row">
                    <div class="gear-wrapper main">
                        <img src="/assets/en/ui/gearbigbg.png" class="gear-bg">
                        <img src="${weaponImg}" class="gear-icon" onerror='this.src="/assets/weapons/NotFound^w.png"'>
                    </div>
                    <div class="gear-wrapper sub">
                        <img src="/assets/en/ui/gearsmallbg.png" class="gear-bg">
                        <img src="${headImg}" class="gear-icon" onerror='this.src="/assets/weapons/NotFound^w.png"'>
                    </div>
                    <div class="gear-wrapper sub">
                        <img src="/assets/en/ui/gearsmallbg.png" class="gear-bg">
                        <img src="${clothesImg}" class="gear-icon" onerror='this.src="/assets/weapons/NotFound^w.png"'>
                    </div>
                    <div class="gear-wrapper sub">
                        <img src="/assets/en/ui/gearsmallbg.png" class="gear-bg">
                        <img src="${shoesImg}" class="gear-icon" onerror='this.src="/assets/weapons/NotFound^w.png"'>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    };

    const updateTabUI = (mode) => {
        const regImg = document.getElementById('img-regular');
        const gachiImg = document.getElementById('img-gachi');
        const fesImg = document.getElementById('img-fes');
        const modeTitleImg = document.getElementById('rank-mode-title');
        const splatfestSubtitle = document.querySelector('.splatfest-subtitle');
        
        const modeSelection = document.querySelector('.mode-selection');
        const glassPanel = document.querySelector('.rank-glass-panel');
        
        if (modeSelection) modeSelection.style.display = 'flex';
        if (glassPanel) glassPanel.style.display = 'block';

        const images = {
            regular: "../assets/en/svg/ui/btn_tab_regular_selected-b636e3d21ace9434120061a32658b21a34feb6468553b6d6da30ce890b85ec1f.svg",
            gachi: "../assets/en/svg/ui/btn_tab_gachi_selected-4796f167399dca12cb274dcb0348cdf709a1f722ddd241210e55a3e04fdb6ff4.svg",
            fes: "../assets/en/svg/ui/btn_tab_fes_selected-7a0ef00ee7f4877df0c7b32998f6bad81fd3f8c28e287168dfffe7d6efb09f77.svg",
            regular_off: "../assets/en/svg/ui/btn_tab_regular-40682de5f47922c608c0ddf6eddd44efcf4b0516092041cdb48977f777030487.svg",
            gachi_off: "../assets/en/svg/ui/btn_tab_gachi-1ab8351babd76ea6dd8e23eb86293c8ceafaf23b9cae3001166fabf3a01011a7.svg",
            fes_off: "../assets/en/svg/ui/btn_tab_fes-f6f7d08ee7f4877df0c7b32998f6bad81fd3f8c28e287168dfffe7d6efb09f77.svg"
        };
        const titleTextImages = {
            regular: "/assets/en/svg/text/scene/rank/tx_regularmatch-b107a49b118c434fce83fcff580b5f695b9b57a29f86bb75df000dbe1d675869.svg", 
            gachi: "/assets/en/svg/text/scene/rank/tx_gachimatch-8d02f62c7ffeb506d31e371ec7e2f5a1d01fd1c4117676f726973e28845ffb19.svg",
            fes: "/assets/en/svg/text/scene/rank/tx_splatfest-7a0ef00ee7f4877df0c7b32998f6bad81fd3f8c28e287168dfffe7d6efb09f77.svg"
        };

        if (regImg) regImg.src = (mode === 'regular') ? images.regular : images.regular_off;
        if (gachiImg) gachiImg.src = (mode === 'gachi') ? images.gachi : images.gachi_off;
        if (fesImg) fesImg.src = (mode === 'fes') ? images.fes : images.fes_off;
        if (modeTitleImg) {
            modeTitleImg.src = titleTextImages[mode] || titleTextImages.regular;
        }
        if (splatfestSubtitle) {
            splatfestSubtitle.style.display = (mode === 'fes') ? 'block' : 'none';
        }
        
        renderRankings(mode);
    };

    const init = async () => {
        const cachedUser = sessionStorage.getItem('user_cache');
        if (cachedUser) renderData(JSON.parse(cachedUser));

        try {
            await Promise.all([
                fetch("/api/v1/me", { credentials: 'include' })
                    .then(res => res.ok ? res.json() : Promise.reject(res))
                    .then(data => {
                        if (!data) return;
                        sessionStorage.setItem('user_cache', JSON.stringify(data));
                        renderData(data);
                    }).catch(() => {}),

                fetch("/api/v1/leaderboard")
                    .then(res => res.json())
                    .then(data => {
                        cachedLeaderboardData = data;
                        const urlParams = new URLSearchParams(window.location.search);
                        const mode = urlParams.get('mode') || 'regular';
                        updateTabUI(mode);
                    })
            ]);
        } catch (err) {
            console.error("Initialization failed:", err);
        } finally {
            const loadingOverlay = document.getElementById("loading-overlay");
            if (loadingOverlay) loadingOverlay.style.display = "none";
        }
    };

    document.querySelectorAll('.mode-selection a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = new URL(this.href, window.location.origin);
            const newMode = url.searchParams.get('mode') || 'regular';
            
            window.history.pushState({}, '', this.href);
            updateTabUI(newMode);
        });
    });

    init();
});