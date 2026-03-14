$(document).ready(function () {
    const form = $("#logout-form");

    $("#logout_frontend_origin").val(window.location.origin);
    form.attr("action", "/api/v1/spfn/logout");
    
    form.submit(function(e) {
        const submitBtn = $(":submit", this);
        submitBtn.prop("disabled", true).css("opacity", "0.5");
    });
});