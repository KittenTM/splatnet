window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('error')) {
        const errorContainer = document.getElementById("auth-error");
        if (errorContainer) {
            errorContainer.textContent = "Invalid SFID or Password";
            errorContainer.style.display = "block"; // Show the red text
        }
        
        //user convenience.....grrr
        const userField = document.getElementsByName("username")[0];
        if (userField && urlParams.has('username')) {
            userField.value = urlParams.get('username');
        }
    }
}