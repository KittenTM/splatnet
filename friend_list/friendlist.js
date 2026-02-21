fetch("../header.html")
    .then(res => res.text())
    .then(html => {
        const headerContainer = document.getElementById("header-container");
        if (headerContainer) {
            headerContainer.innerHTML = html;
        }

        if (typeof CONFIG !== 'undefined') {
            const apiBase = CONFIG.API_BASE_URL.replace(/\/$/, "");

            const logoutForm = document.getElementById("logout-form");
            if (logoutForm) {
                logoutForm.action = apiBase + "/api/v1/spfn/logout";
                const originInput = document.getElementById("logout_frontend_origin");
                if (originInput) originInput.value = window.location.origin;
            }

            fetch(apiBase + "/api/v1/me", { credentials: 'include' })
                .then(res => {
                    if (!res.ok) throw new Error("Status: " + res.status);
                    return res.json();
                })
                .then(data => {
                    if (typeof data === 'string') {
                        try {
                            data = JSON.parse(data);
                        } catch (e) {
                            console.error("Failed to parse inner JSON:", e);
                        }
                    }

                    const nameEl = document.getElementById('mii-name');
                    const imgEl = document.getElementById('mii-img');

                    if (nameEl) {
                        const displayName = 
                            (data.mii && data.mii.name) || 
                            data.nickname || 
                            data.user_id || 
                            data.username || 
                            "User";
                            
                        nameEl.textContent = displayName;
                    }

                    if (imgEl) {
                        const miiBlob = (data.mii && data.mii.data) || data.mii_data;
                        if (miiBlob) {
                            const encodedData = encodeURIComponent(miiBlob);
                            imgEl.src = `https://mii-unsecure.ariankordi.net/miis/image.png?erri=s6u7r-rsp&data=${encodedData}&type=face&width=270`;
                            imgEl.style.display = 'block';
                        }
                    }
                })
                .catch(err => {
                    const nameEl = document.getElementById('mii-name');
                    if (nameEl) nameEl.textContent = "Guest";
                    console.error("Profile Error:", err);
                });
        }

const friendButton = headerContainer.querySelector('.menu-item.friend');
if (friendButton) {
friendButton.classList.add('active');
}
    
// temporaily force hide lol
document.getElementById("loading-overlay").style.display = "none";
});

//todo: actually make it useful..
function friendsbox() {
    const infoBox = document.createElement('div');
    infoBox.className = 'splat-info-box';
    
    infoBox.innerHTML = `
        <p>In Splatoon, you can join online matches that your friends are participating in. Here will show your friends that are online. Register your friends on Wii U and play Splatoon!</p>
    `;
    const contentArea = document.querySelector('.content');
    if (contentArea) {
        contentArea.appendChild(infoBox);
    }
}

friendsbox();