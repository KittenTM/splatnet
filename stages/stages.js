let allRotations = [];
let currentIndex = 0;
const ITEMS_PER_PAGE = 5;
let observer;

window.loadHeader(function(headerContainer) {
    const stageButton = headerContainer.querySelector('.menu-item.stage');
    if (stageButton) {
        stageButton.classList.add('active');
    }

    const logoutForm = document.getElementById("logout-form");
    
    if (logoutForm) {
        logoutForm.action = "/api/v1/spfn/logout";
        const originInput = document.getElementById("logout_frontend_origin");
        if (originInput) originInput.value = window.location.origin;
        
        logoutForm.addEventListener('submit', () => {
            sessionStorage.removeItem('user_cache');
        });
    }

    const renderData = (data) => {
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) { console.error(e); }
        }
        const nameEl = document.getElementById('mii-name');
        const imgEl = document.getElementById('mii-img');
        if (nameEl) {
            nameEl.textContent = (data.mii && data.mii.name) || data.nickname || data.user_id || data.username || "User";
        }
        if (imgEl) {
            const miiBlob = (data.mii && data.mii.data) || data.mii_data;
            if (miiBlob) {
                imgEl.src = `https://mii-unsecure.ariankordi.net/miis/image.png?erri=s6u7r-rsp&data=${encodeURIComponent(miiBlob)}&type=face&width=270`;
                imgEl.style.display = 'block';
            }
        }
    };

    const cached = sessionStorage.getItem('user_cache');
    if (cached) renderData(JSON.parse(cached));

    fetch("/api/v1/me", { credentials: 'include' })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => {
            sessionStorage.setItem('user_cache', JSON.stringify(data));
            renderData(data);
        })
        .catch(err => {
            if (!cached) {
                const nameEl = document.getElementById('mii-name');
                if (nameEl) nameEl.textContent = "Guest";
            }
            console.error(err);
        });

    renderStages();
});

const API_URL = "/api/v1/boss";

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
  return "sprite";
}

async function fetchRotations() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    const rotations = data?.pretendo?.rotations ?? {};
    const now = new Date();
    let allData = Object.keys(rotations).map(ts => {
      const start = new Date(Number(ts));
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      const r = rotations[ts];
      return {
        turf: stageNames(r.turfStages),
        ranked: stageNames(r.rankedStages),
        ranked_mode: r.rankedMode.replace(/([a-z])([A-Z])/g, "$1 $2"),
        startTime: start,
        endTime: end,
        isExpired: end < now
      };
    });
    const active = allData.filter(r => !r.isExpired).sort((a, b) => a.startTime - b.startTime);
    const past = allData.filter(r => r.isExpired).sort((a, b) => b.startTime - a.startTime);
    return [...active, ...past];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function renderStages() {
    const container = document.getElementById("stages-container");
    const loadingOverlay = document.getElementById("loading-overlay");
    
    try {
        allRotations = await fetchRotations();
        if (!allRotations.length) {
            container.innerHTML = `<h2 class="error-message">Something went wrong! Try reloading the page.</h2>`;
            if (loadingOverlay) loadingOverlay.style.display = 'none';
            return;
        }
        
        container.innerHTML = "";
        
        const trigger = document.createElement('div');
        trigger.id = 'scroll-trigger';
        trigger.style.height = '10px';
        trigger.style.display = 'none';
        container.after(trigger);

        loadMore(true);

        observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && currentIndex > 0 && currentIndex < allRotations.length) {
                loadMore(false);
            }
        }, { rootMargin: '0px 0px 100px 0px' });
        
        observer.observe(trigger);

    } catch (err) {
        console.error(err);
        if (loadingOverlay) loadingOverlay.style.display = 'none';
    }
}

function loadMore(isInitial) {
    const container = document.getElementById("stages-container");
    const loadingOverlay = document.getElementById("loading-overlay");
    const trigger = document.getElementById('scroll-trigger');

    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        if (typeof window.animateLoadingCanvas === 'function') {
            window.animateLoadingCanvas();
        }
    }

    const waitTime = isInitial ? 0 : 800;

    setTimeout(() => {
        const nextBatch = allRotations.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);
        const now = new Date();
        let html = "";
        
        nextBatch.forEach((rotation, index) => {
            const isFirstItem = isInitial && index === 0;
            const isAboutToExpire = !rotation.isExpired && (rotation.endTime - now) < (15 * 60 * 1000);
            const optionsDate = { day: "2-digit", month: "2-digit" };
            if (rotation.isExpired) optionsDate.year = "numeric";
            const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
            const timeZone = "Europe/Paris";
            const formattedTime = `${rotation.startTime.toLocaleDateString("en-GB", { ...optionsDate, timeZone })} at ${rotation.startTime.toLocaleTimeString("en-GB", { ...optionsTime, timeZone })} (CEST) ~ ${rotation.endTime.toLocaleDateString("en-GB", { ...optionsDate, timeZone })} at ${rotation.endTime.toLocaleTimeString("en-GB", { ...optionsTime, timeZone })} (CEST)`;
            
            if (isFirstItem) {
                if (isAboutToExpire) {
                    html += `<div class="expiring-warning" style="background: #ffcc00; color: #000; padding: 12px; text-align: center; font-weight: bold; border-radius: 8px; margin-bottom: 20px;">NOTICE: This rotation is about to expire!</div>`;
                } else if (rotation.isExpired) {
                    html += `<div class="expiring-warning" style="background: #ff4444; color: #fff; padding: 12px; text-align: center; font-weight: bold; border-radius: 8px; margin-bottom: 20px;">NOTICE: This rotation has expired!</div>`;
                }
            }

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
        });

        container.insertAdjacentHTML('beforeend', html);
        currentIndex += ITEMS_PER_PAGE;

        if (loadingOverlay) loadingOverlay.style.display = 'none';
        if (trigger) trigger.style.display = 'block';

        if (currentIndex >= allRotations.length) {
            if (observer) observer.disconnect();
            if (trigger) trigger.remove();
        }
    }, waitTime);
}