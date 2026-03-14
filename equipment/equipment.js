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

    const renderData = (data) => {
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } 
            catch (e) { console.error(e); }
        }
        const nameEl = document.getElementById('mii-name');
        const imgEl = document.getElementById('mii-img');
        if (nameEl) {
            nameEl.textContent = (data.mii && data.mii.name) || data.nickname || data.user_id || data.username || "User";
        }
        if (imgEl) {
            const miiBlob = (data.mii && data.mii.data) || data.mii_data;
            if (miiBlob) {
                imgEl.src = `https://mii-unsecure.ariankordi.net/miis/image.png?erri=s6u7r-rsp&data=${encodeURIComponent(miiBlob)}&type=face&width=270`;
                imgEl.style.display = 'block';
            }
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
            console.error(err);
        });

    const equipButton = headerContainer.querySelector('.menu-item.equipment');
    if (equipButton) {
        equipButton.classList.add('active');
    }

    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
        overlay.style.display = "none";
    }
});