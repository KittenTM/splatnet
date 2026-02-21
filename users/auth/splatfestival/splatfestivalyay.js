$(document).ready(function () {
    const form = $("#auth-form");
    const errorContainer = $("#auth-error");
    const urlParams = new URLSearchParams(window.location.search);
    const apiBase = CONFIG.API_BASE_URL;

    $("#frontend_origin").val(window.location.origin);
    
    form.attr("action", apiBase + "/api/v2/sso/spfn/generate_token");

    async function checkExistingSession() {
        try {
            const response = await fetch(apiBase + "/api/v1/session_id/check", {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                window.location.href = "/friend_list/";
            }
        } catch (err) {
            console.log("auth check failed");
        }
    }

    if (!urlParams.has('error')) {
        checkExistingSession();
    }

    if (urlParams.has('error')) {
        errorContainer.text("Invalid SFID or Password").show();
        if (urlParams.has('username')) {
            $("input[name='username']").val(urlParams.get('username'));
        }
    }

    form.submit(function() {
        const submitBtn = $(":submit", this);
        submitBtn.prop("disabled", true).val("Signing In...");
        setTimeout(function() {
            submitBtn.prop("disabled", false).val("Sign In");
        }, 10000);
    });
});