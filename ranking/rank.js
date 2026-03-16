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

    const cached = sessionStorage.getItem('user_cache');
    if (cached) renderData(JSON.parse(cached));

    fetch("/api/v1/me", { credentials: 'include' })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => {
            sessionStorage.setItem('user_cache', JSON.stringify(data));
            renderData(data);
        })
        .catch(err => {
            if (!cached) {
                const nameEl = document.getElementById('mii-name');
                if (nameEl) nameEl.textContent = "Guest";
            }
            console.error("Profile fetch failed:", err);
        });

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const images = {
        regular: "../assets/en/svg/ui/btn_tab_regular_selected-b636e3d21ace9434120061a32658b21a34feb6468553b6d6da30ce890b85ec1f.svg",
        gachi: "../assets/en/svg/ui/btn_tab_gachi_selected-4796f167399dca12cb274dcb0348cdf709a1f722ddd241210e55a3e04fdb6ff4.svg"
    };

    if (mode === 'regular') {
        const regImg = document.getElementById('img-regular');
        if (regImg) regImg.src = images.regular;
    } else if (mode === 'gachi') {
        const gachiImg = document.getElementById('img-gachi');
        if (gachiImg) gachiImg.src = images.gachi;
    }

    if (typeof loadRankings === 'function') {
        loadRankings();
    }

    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) {
        loadingOverlay.style.display = "none";
    }
});