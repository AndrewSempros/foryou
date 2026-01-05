// Βάλε εδώ τον κωδικό που θες:
const PASSCODE = "271025";

// --- Lock/Gift logic ---
const lockScreen = document.getElementById("lockScreen");
const giftPage   = document.getElementById("giftPage");
const codeInput  = document.getElementById("codeInput");
const unlockBtn  = document.getElementById("unlockBtn");
const errorMsg   = document.getElementById("errorMsg");
const backBtn    = document.getElementById("backBtn");

// Αν κάνει refresh αφού ξεκλειδώσει
if (sessionStorage.getItem("unlocked") === "1") showGift();

function showGift(){
  lockScreen.classList.add("hidden");
  giftPage.classList.remove("hidden");
  startHearts();
}

function tryUnlock(){
  const value = codeInput.value.trim();
  if (value === PASSCODE) {
    sessionStorage.setItem("unlocked", "1");
    showGift();
  } else {
    errorMsg.textContent = "Λάθος κωδικός 😛";
    codeInput.value = "";
    codeInput.focus();
  }
}

function goBackToLock(){
  sessionStorage.removeItem("unlocked");
  giftPage.classList.add("hidden");
  lockScreen.classList.remove("hidden");

  stopHearts();

  errorMsg.textContent = "";
  codeInput.value = "";
  codeInput.focus();
}

unlockBtn.addEventListener("click", tryUnlock);
codeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});
backBtn.addEventListener("click", goBackToLock);


// ---- Hearts Animation (gift page only) ----
const heartsCanvas = document.getElementById("heartsCanvas");
const hctx = heartsCanvas.getContext("2d");

let hw = 0, hh = 0;
let hearts = [];
let heartsRunning = false;
let rafId = null;

function resizeHearts() {
  hw = heartsCanvas.width = window.innerWidth;
  hh = heartsCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeHearts);

function spawnHeart() {
  return {
    x: Math.random() * hw,
    y: hh + 40 + Math.random() * 240,   // ✅ ξεκινάει πάντα κάτω
    s: 10 + Math.random() * 18,
    v: 0.8 + Math.random() * 2.0,
    a: 0.25 + Math.random() * 0.45,
    wob: Math.random() * Math.PI * 2,
  };
}

function drawHeart(x, y, size, alpha) {
  hctx.save();
  hctx.translate(x, y);
  hctx.scale(size / 20, size / 20);
  hctx.globalAlpha = alpha;

  hctx.beginPath();
  hctx.moveTo(0, 6);
  hctx.bezierCurveTo(-14, -6, -10, -20, 0, -10);
  hctx.bezierCurveTo(10, -20, 14, -6, 0, 6);
  hctx.closePath();

  hctx.fillStyle = "#ff4d8d";
  hctx.fill();
  hctx.restore();
}

function heartsLoop() {
  if (!heartsRunning) return;

  hctx.clearRect(0, 0, hw, hh);

  for (let i = 0; i < hearts.length; i++) {
    const p = hearts[i];

    p.wob += 0.03;
    p.y -= p.v;
    p.x += Math.sin(p.wob) * 0.8;

    drawHeart(p.x, p.y, p.s, p.a);

    // ✅ reset όταν φύγει τελείως πάνω
    if (p.y < -(p.s + 220)) {
      hearts[i] = spawnHeart();
    }
  }

  rafId = requestAnimationFrame(heartsLoop);
}

function startHearts() {
  heartsCanvas.classList.remove("hidden");
  heartsCanvas.classList.add("on");
  resizeHearts();

  hearts = Array.from({ length: 55 }, () => spawnHeart());
  heartsRunning = true;
  heartsLoop();
}

function stopHearts() {
  heartsRunning = false;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;

  hearts = [];
  hctx.clearRect(0, 0, hw, hh);

  heartsCanvas.classList.remove("on");
  heartsCanvas.classList.add("hidden");
}

