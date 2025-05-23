// Retro Vatertags-Spiel – O Papa als Spielfigur

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// --- Game constants ---
const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

// Retro color palette
const COLORS = {
  papa: "#ff7b00",
  ama: "#57e2e5",
  mama: "#e557a8",
  bg: "#282828",
  heart: "#ff4444",
  text: "#fffbe8"
};

// "O Papa" sprite (retro blocky)
const PAPA_SPRITE = [
  " 000 ",
  "03330",
  "07770",
  "33333",
  "33333",
  "02220"
];

// --- Game state ---
let papa = {
  x: GAME_WIDTH / 2 - 12, // Start center
  y: GAME_HEIGHT - 40,
  w: 24,
  h: 24,
  speed: 3,
};

let started = false;

// --- Utility: draw pixel art ---
function drawSprite(sprite, x, y, color, pixel = 4) {
  for (let row = 0; row < sprite.length; row++) {
    for (let col = 0; col < sprite[row].length; col++) {
      if (sprite[row][col] !== " ") {
        ctx.fillStyle = color;
        ctx.fillRect(x + col * pixel, y + row * pixel, pixel, pixel);
      }
    }
  }
}

// --- Draw hearts ---
function drawHearts(count) {
  for (let i = 0; i < count; i++) {
    ctx.font = "16px 'Press Start 2P', monospace";
    ctx.fillStyle = COLORS.heart;
    ctx.fillText("❤", 16 + i * 24, 32);
  }
}

// --- Draw text (centered) ---
function drawText(txt, y, size=16, color=COLORS.text) {
  ctx.font = `${size}px 'Press Start 2P', monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(txt, GAME_WIDTH / 2, y);
}

// --- Main draw ---
function render() {
  // Background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Draw hearts (lives)
  drawHearts(3);

  // Draw Papa
  drawSprite(PAPA_SPRITE, papa.x, papa.y, COLORS.papa);

  // Title or instructions
  if (!started) {
    drawText("O Papa: Starte das Abenteuer!", 110, 12, COLORS.papa);
    drawText("Drücke Enter zum Starten", 140, 10, "#ffe066");
    drawText("Steuerung: Pfeiltasten", 170, 10, "#ffe066");
  }
}

// --- Movement & Game Loop ---
function updatePapa(keys) {
  if (keys["ArrowLeft"]) {
    papa.x = Math.max(0, papa.x - papa.speed);
  }
  if (keys["ArrowRight"]) {
    papa.x = Math.min(GAME_WIDTH - papa.w, papa.x + papa.speed);
  }
  if (keys["ArrowUp"]) {
    papa.y = Math.max(40, papa.y - papa.speed); // leave space for UI
  }
  if (keys["ArrowDown"]) {
    papa.y = Math.min(GAME_HEIGHT - papa.h, papa.y + papa.speed);
  }
}

// --- Keyboard Handling ---
const keys = {};

canvas.setAttribute("tabindex", 0);
canvas.focus();

window.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (!started && e.key === "Enter") {
    started = true;
    document.getElementById("start-msg").style.display = "none";
  }
});

window.addEventListener("keyup", e => {
  keys[e.key] = false;
});

// --- Game Loop ---
function gameLoop() {
  if (started) updatePapa(keys);
  render();
  requestAnimationFrame(gameLoop);
}

// --- Focus canvas for keyboard events ---
canvas.addEventListener("click", () => canvas.focus());
canvas.focus();

// --- Start ---
render();
gameLoop();