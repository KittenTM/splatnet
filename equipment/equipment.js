fetch("../header.html")
.then(res => res.text())
.then(html => {
const headerContainer = document.getElementById("header-container");
headerContainer.innerHTML = html;

const logoutForm = document.getElementById("logout-form");
if (logoutForm && typeof CONFIG !== 'undefined') {
    const apiBase = CONFIG.API_BASE_URL.replace(/\/$/, "");
    logoutForm.action = apiBase + "/api/v1/spfn/logout";
    
    const originInput = document.getElementById("logout_frontend_origin");
    if (originInput) {
        originInput.value = window.location.origin;
    }
}

const friendButton = headerContainer.querySelector('.menu-item.equipment');
if (friendButton) {
friendButton.classList.add('active');
}
    
// temporaily force hide lol
document.getElementById("loading-overlay").style.display = "none";
});