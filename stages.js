const API_URL = "https://api.splatcord.ink/prod/s1rotations";

function stageNames(stages, lang = "en-US") {
    return stages.map(s => s.translatedNames[lang]);
}

function stageImagePath(stageName) {
    const firstWord = stageName
        .split(" ")[0]
        .toLowerCase()
        .replace(/['.]/g, "");

    return `../../assets/stages/${firstWord}.jpg`;
}

async function fetchRotations() {
    const res = await fetch(API_URL);
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
}

async function renderStages() {
    const container = document.getElementById("stages-container");
    const rotations = await fetchRotations();

    if (!rotations.length) {
        container.innerHTML = "<h2>No rotations available</h2>";
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

renderStages();
