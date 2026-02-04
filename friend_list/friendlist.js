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

animateLoadingCanvas();

//todo: actually make it useful..
function friendsbox() {
    const infoBox = document.createElement('div');
    infoBox.className = 'splat-info-box';
    
    infoBox.innerHTML = `
        <p>In Splatoon, you can join online matches that your friends are participating in. Here will show your friends that are online. Register your friends on Wii U and play Splatoon!</p>
    `;
    const contentArea = document.querySelector('.content');
    if (contentArea) {
        contentArea.appendChild(infoBox);
    }
}

friendsbox();