window.loadHeader(function(headerContainer) {
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
    };

    const getRankIcon = (rank) => {
        const icons = {
            1: "tx_nb_1_purple-e854b65457dce33c1570ee22dfdc6f3dbe74b49606d08bc92d69fb6d1ed7690a.svg",
            2: "tx_nb_2_purple-50c81f51ce9f30ce89dd3f01a9812c846e7fbb7a00fc95d72726a772d2ef5bd7.svg",
            3: "tx_nb_3_purple-0901c032e718a09d5e4c9c1f47646a3958da7bb566a2d4da06322d7be2a911aa.svg",
            4: "tx_nb_4_purple-a2e279292822c0f181b7726bcef1ee6c3d7a18b2763ec4d8c0a54ca452fc5e04.svg",
            5: "tx_nb_5_purple-16e43ef9f23e514f900ede4bde7bcb81aa062af961c553374fc7c80566cf8b47.svg",
            6: "tx_nb_6_purple-1ed2cae2808bb656eb89d986c9e10289fc273cb7d026b989af0aac39722c6989.svg",
            7: "tx_nb_7_purple-8cae82b95463c7ca3ab55f0bf652d10e2212b43d99e442d89fda9b1951c8b261.svg",
            8: "tx_nb_8_purple-faf0aa1407d058709db1338ba8d4c42495911d63e77e9653b74b26ff25f4f355.svg",
            9: "tx_nb_9_purple-68d2b702b4240b2cd2886fb146d2c9835e1a2fd79b8d218cb5b7fb32cecb4bfa.svg"
        };
        return `../assets/en/svg/text/scene/rank/number/${icons[rank]}`;
    };

    const renderRankings = () => {
        const container = document.getElementById('ranking-cards-container');
        if (!container) return;
        container.innerHTML = '';

        for (let i = 1; i <= 9; i++) {
            const card = document.createElement('div');
            card.className = 'rank-card-container';
            card.innerHTML = `
                <div class="rank-bg"></div>
                <div class="rank-profile-circle"></div>
                <img src="${getRankIcon(i)}" class="rank-accent">
                <div class="rank-name-row">
                    <img src="/assets/en/svg/ui/34b4b97a4411.svg" class="rank-power-icon">
                    <div class="rank-name">Player ${i}</div>
                </div>
                <div class="rank-power-value">${2500 - (i * 10)}</div>
                <div class="rank-gear-row">
                    <img src="/assets/en/ui/gearbigbg.png" class="gear-main">
                    <img src="/assets/en/ui/gearsmallbg.png" class="gear-sub">
                    <img src="/assets/en/ui/gearsmallbg.png" class="gear-sub">
                    <img src="/assets/en/ui/gearsmallbg.png" class="gear-sub">
                </div>
            `;
            container.appendChild(card);
        }
    };

    const init = () => {
        const cached = sessionStorage.getItem('user_cache');
        if (cached) renderData(JSON.parse(cached));

        fetch("/api/v1/me", { credentials: 'include' })
            .then(res => {
                if (res.redirected) {
                    window.location.href = res.url;
                    return;
                }
                return res.ok ? res.json() : Promise.reject(res);
            })
            .then(data => {
                if (!data) return;
                sessionStorage.setItem('user_cache', JSON.stringify(data));
                renderData(data);
            })
            .catch(err => {
                if (!cached) {
                    const nameEl = document.getElementById('mii-name');
                    if (nameEl) nameEl.textContent = "Guest";
                }
            });

        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode') || 'regular';
        
        const regImg = document.getElementById('img-regular');
        const gachiImg = document.getElementById('img-gachi');
        const fesImg = document.getElementById('img-fes');
        
        const images = {
            regular: "../assets/en/svg/ui/btn_tab_regular_selected-b636e3d21ace9434120061a32658b21a34feb6468553b6d6da30ce890b85ec1f.svg",
            gachi: "../assets/en/svg/ui/btn_tab_gachi_selected-4796f167399dca12cb274dcb0348cdf709a1f722ddd241210e55a3e04fdb6ff4.svg",
            fes: "../assets/en/svg/ui/btn_tab_fes_selected-7a0ef00ee7f4877df0c7b32998f6bad81fd3f8c28e287168dfffe7d6efb09f77.svg",
            regular_off: "../assets/en/svg/ui/btn_tab_regular-40682de5f47922c608c0ddf6eddd44efcf4b0516092041cdb48977f777030487.svg",
            gachi_off: "../assets/en/svg/ui/btn_tab_gachi-1ab8351babd76ea6dd8e23eb86293c8ceafaf23b9cae3001166fabf3a01011a7.svg",
            fes_off: "../assets/en/svg/ui/btn_tab_fes-f6f7d08ee7f4877df0c7b32998f6bad81fd3f8c28e287168dfffe7d6efb09f77.svg"
        };

        if (regImg) regImg.src = (mode === 'regular') ? images.regular : images.regular_off;
        if (gachiImg) gachiImg.src = (mode === 'gachi') ? images.gachi : images.gachi_off;
        if (fesImg) fesImg.src = (mode === 'fes') ? images.fes : images.fes_off;

        renderRankings();

        const loadingOverlay = document.getElementById("loading-overlay");
        if (loadingOverlay) {
            loadingOverlay.style.display = "none";
        }
    };

    document.querySelectorAll('.mode-selection a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            window.history.pushState({}, '', href);
            init();
        });
    });

    init();
});