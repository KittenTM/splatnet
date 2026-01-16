const API_URL = "https://api.splatcord.ink/prod/s1rotations";

function stageNames(stages, lang = "en-US") {
    return stages.map(s => s.translatedNames[lang]);
}

function stageImagePath(stageName) {
    const firstWord = stageName
        .split(" ")[0]
        .toLowerCase()
        .replace(/['.]/g, "");

    return `/assets/stages/${firstWord}.jpg`;
}

async function fetchRotations() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        const rotations = data?.pretendo?.rotations ?? {};
        const now = new Date();

        const timestamps = Object.keys(rotations).sort(
            (a, b) => Number(a) - Number(b)
        );

        for (const ts of timestamps) {
            const start = new Date(Number(ts));
            const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

            if (end < now) continue;

            const r = rotations[ts];

            return [{
                turf: stageNames(r.turfStages).map(stageImagePath),
                ranked: stageNames(r.rankedStages).map(stageImagePath),
                ranked_mode: r.rankedMode?.translatedNames?.["en-US"] ?? "Ranked"
            }];
        }

        return [];
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
    const frameDuration = 50;

    let animationId;

    image.onload = () => {
        function animate(timestamp = 0) {
            if (loadingOverlay.style.display === "none") {
                cancelAnimationFrame(animationId);
                return;
            }

            if (!lastUpdateTime) lastUpdateTime = timestamp;
            const elapsed = timestamp - lastUpdateTime;

            if (elapsed > frameDuration) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(
                    image,
                    0, currentFrame * frameHeight,
                    frameWidth, frameHeight,
                    0, 0,
                    frameWidth, frameHeight
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
        loadingOverlay.style.display = "none"; // always hide loading
    }

    if (!rotations.length) {
        container.innerHTML = `
            <h2 class="error-message">
                Something went wrong! Try reloading the page. If this problem persists you may be ratelimited.
            </h2>
        `;

        return;
    }

    for (const rotation of rotations) {
        container.innerHTML += `
            <div class="stages-section">
                <h2>Turf War</h2>
                <div class="stages">
                    ${rotation.turf.map(img =>
                        `<img src="${img}" alt="Turf Stage">`
                    ).join("")}
                </div>
            </div>

            <div class="stages-section">
                <h2>Ranked Battle (${rotation.ranked_mode})</h2>
                <div class="stages">
                    ${rotation.ranked.map(img =>
                        `<img src="${img}" alt="Ranked Stage">`
                    ).join("")}
                </div>
            </div>
        `;
    }
}

animateLoadingCanvas();
renderStages();
