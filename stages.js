const API_URL = "https://api.splatcord.ink/prod/s1rotations";

function stageNames(stages, lang = "en-US") {
    return stages.map(s => s.translatedNames[lang]);
}

function stageImagePath(stageName) {
    const firstWord = stageName
        .split(" ")[0]
        .toLowerCase()
        .replace(/['.]/g, "");
    return `/assets/stages/${firstWord}.png`;
}

async function fetchRotations() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const rotations = data?.pretendo?.rotations ?? {};
        const now = new Date();
        const timestamps = Object.keys(rotations).sort((a, b) => Number(a) - Number(b));

        const result = [];

        for (const ts of timestamps) {
            const start = new Date(Number(ts));
            const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
            if (end < now) continue;

            const r = rotations[ts];

            result.push({
                turf: stageNames(r.turfStages),
                ranked: stageNames(r.rankedStages),
                ranked_mode: r.rankedMode.replace(/([a-z])([A-Z])/g, "$1 $2"),
                startTime: start,
                endTime: end
            });
        }

        return result;
    } catch (error) {
        console.error("Failed to fetch rotations:", error);
        return [];
    }
}

function animateLoadingCanvas() {
    const canvas = document.getElementById("loading-canvas");
    const loadingOverlay = document.getElementById("loading-overlay");
    if (!canvas || !loadingOverlay) return;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = "/assets/loading.png";
    const frameWidth = 100;
    const frameHeight = 100;
    const totalFrames = 17;
    let currentFrame = 0;
    let lastUpdateTime = 0;
    let animationId;
    image.onload = () => {
        function animate(timestamp = 0) {
            if (loadingOverlay.style.display === "none") {
                cancelAnimationFrame(animationId);
                return;
            }
            if (!lastUpdateTime) lastUpdateTime = timestamp;
            const elapsed = timestamp - lastUpdateTime;
            if (elapsed > 50) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(
                    image,
                    0,
                    currentFrame * frameHeight,
                    frameWidth,
                    frameHeight,
                    0,
                    0,
                    frameWidth,
                    frameHeight
                );
                currentFrame = (currentFrame + 1) % totalFrames;
                lastUpdateTime = timestamp;
            }
            animationId = requestAnimationFrame(animate);
        }
        animationId = requestAnimationFrame(animate);
    };
}

async function renderStages() {
    const loadingOverlay = document.getElementById("loading-overlay");
    const container = document.getElementById("stages-container");
    let rotations = [];
    try {
        rotations = await fetchRotations();
    } catch (err) {
        console.error("Error in renderStages:", err);
    } finally {
        loadingOverlay.style.display = "none";
    }
    if (!rotations.length) {
        container.innerHTML = `<h2 class="error-message">Something went wrong! Try reloading the page. If this problem persists you may be ratelimited.</h2>`;
        return;
    }
    for (const rotation of rotations) {
        const optionsDate = { day: "2-digit", month: "2-digit" };
        const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
        const timeZone = "Europe/Paris";
        const formattedTime = `${rotation.startTime.toLocaleDateString("en-GB", { ...optionsDate, timeZone })} at ${rotation.startTime.toLocaleTimeString("en-GB", { ...optionsTime, timeZone })} (CEST) ~ ${rotation.endTime.toLocaleDateString("en-GB", { ...optionsDate, timeZone })} at ${rotation.endTime.toLocaleTimeString("en-GB", { ...optionsTime, timeZone })} (CEST)`;

        container.innerHTML += `
            <div class="rotation-time">${formattedTime}</div>

            <div class="stages-section">
                <img class="mode-title" src="/assets/regular.svg" alt="Regular Battle">
                <div class="mode-text">Regular Battle</div>
                <div class="stages">
                    ${rotation.turf.map(name => `
                        <div class="stage-tile">
                            <img src="${stageImagePath(name)}" alt="${name}">
                            <div class="stage-title">${name}</div>
                        </div>
                    `).join("")}
                </div>
            </div>

            <div class="stages-section">
                <img class="mode-title" src="/assets/ranked.svg" alt="Ranked Battle">
                <div class="mode-text">Ranked Battle</div>
                <div class="ranked-mode-labels">
                    <div class="battle-mode-text">Battle Mode</div>
                    <div class="ranked-mode-text">${rotation.ranked_mode}</div>
                </div>
                <div class="stages">
                    ${rotation.ranked.map(name => `
                        <div class="stage-tile">
                            <img src="${stageImagePath(name)}" alt="${name}">
                            <div class="stage-title">${name}</div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    }
}

animateLoadingCanvas();
renderStages();
