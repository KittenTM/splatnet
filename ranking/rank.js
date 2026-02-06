fetch("../header.html")
.then(res => res.text())
.then(html => {
const headerContainer = document.getElementById("header-container");
headerContainer.innerHTML = html;

const friendButton = headerContainer.querySelector('.menu-item.rank');
if (friendButton) {
friendButton.classList.add('active');
}
    
// temporaily force hide lol
document.getElementById("loading-overlay").style.display = "none";
});