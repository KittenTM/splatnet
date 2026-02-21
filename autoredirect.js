document.addEventListener("DOMContentLoaded", function () {
    const apiBase = CONFIG.API_BASE_URL;
    const friendListUrl = "/friend_list/index.html";

    async function checkExistingSession() {
        try {
            const response = await fetch(`${apiBase}/api/v1/session_id/check`, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                renderSeamlessPage();
            } else {
                window.location.href = "/sign_in";
            }
        } catch (err) {
            console.error("Auth check failed:", err);
            window.location.href = "/sign_in";
        }
    }

    async function renderSeamlessPage() {
        try {
            const res = await fetch(friendListUrl);
            if (!res.ok) throw new Error("Failed to fetch friend_list/index.html");
            let html = await res.text();
            html = html.replace(/src="\.\.\//g, 'src="/');
            html = html.replace(/href="\.\.\//g, 'href="/');
            const baseTag = `<base href="/friend_list/">`;
            
            if (html.includes('<head>')) {
                html = html.replace('<head>', `<head>\n    ${baseTag}`);
            } else {
                //fallback
                html = baseTag + html;
            }
            document.open();
            document.write(html);
            document.close();

        } catch (err) {
            console.error("Seamless render failed, falling back to redirect:", err);
            window.location.href = "/friend_list/index.html";
        }
    }

    checkExistingSession();
});