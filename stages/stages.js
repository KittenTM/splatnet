const API_URL = `${CONFIG.API_BASE_URL}/api/v1/boss`;

function stageNames(stages, lang = "en-US") {
  return stages.map(s => s.translatedNames[lang]);
}

function getStageClass(stageName) {
  const name = stageName.toLowerCase();
  
  if (name.includes("ancho-v")) return "sprite-ancho-v";
  if (name.includes("arowana")) return "sprite-arowana";
  if (name.includes("blackbelly")) return "sprite-blackbelly";
  if (name.includes("bluefin")) return "sprite-bluefin";
  if (name.includes("camp")) return "sprite-camp";
  if (name.includes("flounder")) return "sprite-flounder";
  if (name.includes("hammerhead")) return "sprite-hammerhead";
  if (name.includes("kelp")) return "sprite-kelp";
  if (name.includes("mahi-mahi")) return "sprite-mahi-mahi";
  if (name.includes("moray")) return "sprite-moray";
  if (name.includes("museum")) return "sprite-museum";
  if (name.includes("piranha")) return "sprite-piranha";
  if (name.includes("port")) return "sprite-port";
  if (name.includes("saltspray")) return "sprite-saltspray";
  if (name.includes("urchin")) return "sprite-urchin";
  if (name.includes("walleye")) return "sprite-walleye";
  
  return "sprite"; // fallback
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
        endTime: end,
      });
    }

    return result;
  } catch (error) {
    console.error("Failed to fetch rotations:", error);
    return [];
  }
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
    container.innerHTML = `<h2 class="error-message">Something went wrong! Try reloading the page.</h2>`;
    return;
  }

  let html = "";

  for (const rotation of rotations) {
    const optionsDate = { day: "2-digit", month: "2-digit" };
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
    const timeZone = "Europe/Paris";
    const formattedTime = `${rotation.startTime.toLocaleDateString("en-GB", { ...optionsDate, timeZone })} at ${rotation.startTime.toLocaleTimeString("en-GB", { ...optionsTime, timeZone })} (CEST) ~ ${rotation.endTime.toLocaleDateString("en-GB", { ...optionsDate, timeZone })} at ${rotation.endTime.toLocaleTimeString("en-GB", { ...optionsTime, timeZone })} (CEST)`;

    html += `
      <div class="rotation-time">${formattedTime}</div>

      <div class="stages-section">
          <div class="mode-header">
              <img class="mode-title" src="/assets/en/svg/ui/ico_stage_regular-54557ab86d0cba16cf002e6d299f87dccb41655de8a171d32928bfebda3f3692.svg" alt="Regular Battle">
              <div class="mode-text"><img src="/assets/en/svg/text/scene/stage/tx_regularmatch-2cee60cbe41a1594b8d5ef867138f99d843cfce6efe0c490a41632b2e99ec685.svg" alt="Regular Battle"></div>
          </div>
          
          <div class="stages">
              ${rotation.turf.map(name => `
                  <div class="stage-item">
                      <div class="sprite ${getStageClass(name)}"></div>
                      <div class="stage-title">${name}</div>
                  </div>
              `).join("")}
          </div>
      </div>

      <div class="stages-section">
          <div class="mode-header">
              <img class="mode-title" src="/assets/en/svg/ui/ico_stage_gachi-d2041f3d0fc360ad6c7c00dc4f5bfd1aa626a251d35af88c076b5498d8eb991d.svg" alt="Ranked Battle">
              <div class="mode-text"><img src="/assets/en/svg/text/scene/stage/tx_gachimatch-08a066c73d4dcf466c435be611b996ffd7930d19d9a6a865b712cd5dd802534f.svg" alt="Ranked Battle"></div>
          </div>

          <div class="ranked-mode-labels">
              <div class="battle-mode-text"><img src="/assets/en/svg/text/scene/stage/tx_rule-76cf0777fb715a9478f8b579512541f3f14ed834566e0b6e153834a57d726021.svg" alt="Battle Mode"></div>
              <div class="ranked-mode-text">${rotation.ranked_mode}</div>
          </div>

          <div class="stages">
              ${rotation.ranked.map(name => `
                  <div class="stage-item">
                      <div class="sprite ${getStageClass(name)}"></div>
                      <div class="stage-title">${name}</div>
                  </div>
              `).join("")}
          </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

renderStages();