async function finalizeLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    const statusDiv = document.getElementById('status');

    if (!code || !state) {
        statusDiv.innerHTML = "<h2>Error: Missing data from Twitter</h2>";
        return;
    }

    try {
        const response = await fetch(`/api/v1/me/twitter/confirm?state=${state}&code=${code}`, {
            method: 'GET',
        });

        const data = await response.json();

        if (response.ok) {
            statusDiv.innerHTML = `
                <h2>Success!</h2>
                <p>Linked as @${data.handle}</p>
                <p>Redirecting you back...</p>
            `;
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            statusDiv.innerHTML = `<h2>Error: ${data.detail || 'Failed to link'}</h2>`;
        }
    } catch (err) {
        statusDiv.innerHTML = "<h2>Failed to connect to backend</h2>";
    }
}

finalizeLink();