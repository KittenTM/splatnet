$(document).ready(function () {
    const form = $("#logout-form");
    if (typeof CONFIG === 'undefined') {
        alert("CRITICAL ERROR: config.js not loaded before logout.js");
        return;
    }

    const apiBase = CONFIG.API_BASE_URL;
    const targetAction = apiBase.replace(/\/$/, "") + "/spfn/logout";
    $("#logout_frontend_origin").val(window.location.origin);
    form.attr("action", targetAction);
    
    console.log("Form action set to: " + targetAction);

    form.submit(function(e) {
        alert("Submitting to: " + $(this).attr("action"));
        
        const submitBtn = $(":submit", this);
        submitBtn.prop("disabled", true).css("opacity", "0.5");
    });
});