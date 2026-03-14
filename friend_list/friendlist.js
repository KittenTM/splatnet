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

    const renderData = (data) => {
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) {}
        }
        const nameEl = document.getElementById('mii-name');
        const imgEl = document.getElementById('mii-img');
        if (nameEl) nameEl.textContent = data.nickname || data.mii.name || "User";
        if (imgEl && (data.mii && data.mii.data)) {
            imgEl.src = `https://mii-unsecure.ariankordi.net/miis/image.png?erri=s6u7r-rsp&data=${encodeURIComponent(data.mii.data)}&type=face&width=270`;
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
        .catch(() => {
            if (!cached) document.getElementById('mii-name').textContent = "Guest";
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