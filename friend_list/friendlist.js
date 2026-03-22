window.loadHeader(function(headerContainer) {
    const friendButton = headerContainer.querySelector('.menu-item.friend');
    if (friendButton) {
        friendButton.classList.add('active');
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

    const updateTwitterUI = () => {
        if (!twitterBtn || !twitterLabel) return;
        
        //this is so shitty but it works so i dont care
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
        twitterLabel.style.height = "";
        twitterLabel.style.transform = ""; 
    }
})
            .catch(() => {
                twitterBtn.dataset.linked = "false";
            });
    };

    const renderData = (data) => {
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) {}
        }
        const nameEl = document.getElementById('mii-name');
        const imgEl = document.getElementById('mii-img');
        const miiBlob = (data.mii && data.mii.data) || data.mii_data;

        if (nameEl) {
            const parsedName = miiBlob ? extractMiiName(miiBlob) : null;
            nameEl.textContent = parsedName || (data.mii && data.mii.name) || data.nickname || data.username || "User";
        }

        if (imgEl && miiBlob) {
            imgEl.src = `https://mii-unsecure.ariankordi.net/miis/image.png?data=${encodeURIComponent(miiBlob)}&type=face&width=270`;
            imgEl.style.display = 'block';
        }

        updateTwitterUI();
    };

    const cached = sessionStorage.getItem('user_cache');
    if (cached) renderData(JSON.parse(cached));

    fetch("/api/v1/me", { credentials: 'include' })
        .then(res => res.redirected ? (window.location.href = res.url) : (res.ok ? res.json() : Promise.reject(res)))
        .then(data => {
            if (!data) return;
            sessionStorage.setItem('user_cache', JSON.stringify(data));
            renderData(data);
        })
        .catch(() => {
            if (!cached) {
                const nameEl = document.getElementById('mii-name');
                if (nameEl) nameEl.textContent = "Guest";
            }
        });

    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) loadingOverlay.style.display = "none";
});

function friendsbox() {
    const infoBox = document.createElement('div');
    infoBox.className = 'splat-info-box';
    infoBox.innerHTML = `<p>In Splatoon, you can join online matches that your friends are participating in. Here will show your friends that are online. Register your friends on Wii U and play Splatoon!</p>`;
    const contentArea = document.querySelector('.content');
    if (contentArea) contentArea.appendChild(infoBox);
}

friendsbox();