const API_URL = "https://api.splatcord.ink/prod/s1rotations";

function loadHeader() {
  fetch("../../../header.html")
    .then(res => res.text())
    .then(html => {
      const headerContainer = document.getElementById("header-container");
      if (headerContainer) {
        headerContainer.innerHTML = html;

        const stageButton = headerContainer.querySelector('.menu-item.stage');
        if (stageButton) {
          stageButton.classList.add('active');
        }
      }
    })
    .catch(err => console.error("Failed to load header:", err));
}

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
        endTime: end,
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
  image.src = "/assets/en/loading/@2x-se6335ab797-cb27d69f23a4d1112bc2a0d272538f39dd3017be20e5f2e3f4a460bd0071b68d.png";
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

//pain in the ass to implement. im proud of ts
const canvas = document.getElementById("squid-canvas");
const ctx = canvas.getContext("2d");
const frameWidth = 64;
const frameHeight = 64;
const totalFrames = 8;
const squidCount = 5;
const squids = [];
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const titleYThreshold = 0;

function createSquid() {
  return {
    x: Math.random() * canvasWidth,
    y: canvasHeight + Math.random() * 300,
    currentFrame: Math.floor(Math.random() * totalFrames),
    speed: 0.05 + Math.random() * 0.15,
    lastFrameUpdate: 0
  };
}

for (let i = 0; i < squidCount; i++) {
  squids.push(createSquid());
}

let lastTimestamp = 0;

const image = new Image();
image.src = "/assets/ika-8e075a29ff487983044303f98958fb8c852bc3e9ab07ee7597724b6c0aa4a5d7.png";

image.onload = () => {
  function animate(timestamp = 0) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = timestamp - lastTimestamp;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (const squid of squids) {
      squid.y -= squid.speed * delta;

      if (squid.y + frameHeight < titleYThreshold) {
        squid.x = Math.random() * canvasWidth;
        squid.y = canvasHeight + Math.random() * 300;
        squid.currentFrame = Math.floor(Math.random() * totalFrames);
        squid.speed = 0.05 + Math.random() * 0.15;
      }

      if (timestamp - squid.lastFrameUpdate > 100) {
        squid.currentFrame = (squid.currentFrame + 1) % totalFrames;
        squid.lastFrameUpdate = timestamp;
      }

      ctx.drawImage(
        image,
        squid.currentFrame * frameWidth,
        0,
        frameWidth,
        frameHeight,
        squid.x,
        squid.y,
        frameWidth,
        frameHeight
      );
    }

    lastTimestamp = timestamp;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
};

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
              <div class="mode-text">Regular Battle</div>
          </div>
          
          <div class="stages">
              ${rotation.turf.map(name => `
                  <div class="stage-item">
                      <img src="${stageImagePath(name)}" alt="${name}">
                      <div class="stage-title">${name}</div>
                  </div>
              `).join("")}
          </div>
      </div>

      <div class="stages-section">
          <div class="mode-header">
              <img class="mode-title" src="/assets/en/svg/ui/ico_stage_gachi-d2041f3d0fc360ad6c7c00dc4f5bfd1aa626a251d35af88c076b5498d8eb991d.svg" alt="Ranked Battle">
              <div class="mode-text">Ranked Battle</div>
          </div>

          <div class="ranked-mode-labels">
              <div class="battle-mode-text">Battle Mode</div>
              <div class="ranked-mode-text">${rotation.ranked_mode}</div>
          </div>

          <div class="stages">
              ${rotation.ranked.map(name => `
                  <div class="stage-item">
                      <img src="${stageImagePath(name)}" alt="${name}">
                      <div class="stage-title">${name}</div>
                  </div>
              `).join("")}
          </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

loadHeader();
animateLoadingCanvas();
renderStages();