// === Image Switcher (not affected by other buttons) ===
const trailerImages = [
  "Minecraft Achievements.png",
  "Blooket Calculator.png",
  "Chess Achievements.png",
  "Blooket Blooks.png",
  "Duolingo Achievements.png",
  "MSM.png"
];

let currentTrailerIndex = 0;
const trailerImageElement = document.getElementById("swapImage");
const musicButton = document.getElementById("music-toggle"); // music button reference

if (trailerImageElement) {
  trailerImageElement.style.cursor = "pointer";

  document.addEventListener("click", (event) => {
    const target = event.target;

    // ✅ Ignore clicks on other buttons, menus, or the music button
    if (
      target.closest(".menu-bar") ||          // menu area
      target.closest(".top-menu") ||          // top menu bar
      target.closest("#music-toggle") ||      // music toggle button
      target.closest("button") ||             // any generic button
      target.tagName === "A"                  // any links
    ) {
      return; // ignore
    }

    // ✅ Only trigger if clicking on the image itself
    if (target === trailerImageElement) {
      trailerImageElement.style.transition = "opacity 0.4s ease";
      trailerImageElement.style.opacity = "0"; // fade out

      setTimeout(() => {
        currentTrailerIndex = (currentTrailerIndex + 1) % trailerImages.length;
        trailerImageElement.src = trailerImages[currentTrailerIndex];
        trailerImageElement.style.opacity = "1"; // fade in
      }, 400);
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("flappyCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = 300;
  canvas.height = 450;

  // === Images ===
  const bgImg = new Image();
  bgImg.src = "Flappy Bird Background (Game).png";
  const birdImg = new Image();
  birdImg.src = "Flappy Bird.png";
  const upPipeImg = new Image();
  upPipeImg.src = "Up Pipe.png"; // bottom pipe
  const downPipeImg = new Image();
  downPipeImg.src = "Down Pipe.png"; // top pipe
  const groundImg = new Image();
  groundImg.src = "Grass.png";

  // === Sounds ===
  const flySound = new Audio("Flappy Bird Fly.mp3");
  const scoreSound = new Audio("Flappy Bird Score.mp3");
  const dieSound = new Audio("Flappy Bird Die.mp3");

  // === Game Variables ===
  let birdX = 70;
  let birdY = 150;
  let gravity = 0.4;
  let lift = -7;
  let velocity = 0;
  let pipes = [];
  let frame = 0;
  let score = 0;
  const groundHeight = 60;
  const pipeGap = 120;
  let gameOver = false;
  let gameStarted = false;

  // === Add Pipe Pair ===
  function addPipe() {
    const topHeight = Math.floor(Math.random() * 120) + 50;
    pipes.push({
      x: canvas.width,
      top: topHeight,
      bottom: topHeight + pipeGap,
      passed: false
    });
  }

  // === Restart ===
  function restartGame() {
    birdY = 150;
    velocity = 0;
    pipes = [];
    frame = 0;
    score = 0;
    gameOver = false;
    gameStarted = true;
    addPipe();
    loop();
  }

  function handleInput() {
    if (!gameStarted) {
      restartGame();
    } else if (gameOver) {
      restartGame();
    } else {
      velocity = lift;
      flySound.currentTime = 0;
      flySound.play();
    }
  }

  // === Ignore Menu Bar Clicks ===
  function isClickOnMenuBar(target) {
    return target.closest && target.closest(".menu-bar");
  }

  let touchJustTriggered = false;

  document.addEventListener("click", e => {
    if (touchJustTriggered) {
      touchJustTriggered = false;
      return;
    }
    if (isClickOnMenuBar(e.target)) return;
    handleInput();
  });

  document.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (isClickOnMenuBar(element)) return;
    touchJustTriggered = true;
    handleInput();
  });

  document.addEventListener("keydown", e => {
    if (e.code === "Space") {
      e.preventDefault();
      handleInput();
    }
  });

  // === Main Loop ===
  function loop() {
    if (gameOver) return;
    frame++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    velocity += gravity;
    birdY += velocity;

    // === Top of screen reset ===
    if (birdY < -30) {
      dieSound.currentTime = 0;
      dieSound.play();
      restartGame();
      return;
    }

    if (frame % 100 === 0) addPipe();

    // === Pipes ===
    for (let i = pipes.length - 1; i >= 0; i--) {
      const p = pipes[i];
      p.x -= 2;

      // Top pipe (Down Pipe.png)
      ctx.drawImage(downPipeImg, p.x, 0, 50, p.top);

      // Bottom pipe (Up Pipe.png)
      ctx.drawImage(
        upPipeImg,
        p.x,
        p.bottom,
        50,
        canvas.height - p.bottom - groundHeight
      );

      // Collision check
      if (
        birdX + 30 > p.x &&
        birdX < p.x + 50 &&
        (birdY < p.top || birdY + 24 > p.bottom)
      ) {
        dieSound.currentTime = 0;
        dieSound.play();
        gameOver = true;
      }

      // Scoring (once per tunnel)
      if (!p.passed && p.x + 50 < birdX) {
        score++;
        p.passed = true;
        scoreSound.currentTime = 0;
        scoreSound.play();
      }

      // Remove offscreen pipes
      if (p.x + 50 < 0) {
        pipes.splice(i, 1);
      }
    }

    // === Ground ===
    for (let i = 0; i < canvas.width; i += 80) {
      ctx.drawImage(groundImg, i, canvas.height - groundHeight, 80, groundHeight);
    }

    // === Bird ===
    ctx.drawImage(birdImg, birdX, birdY, 30, 24);

    // === Ground Collision ===
    if (birdY + 24 >= canvas.height - groundHeight) {
      dieSound.currentTime = 0;
      dieSound.play();
      gameOver = true;
    }

    // === Score ===
    ctx.fillStyle = "white";
    ctx.font = "20px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + score, canvas.width / 2, 40);

    // === Game Over Screen ===
    if (gameOver) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "28px Fredoka, sans-serif";
      ctx.fillText("Game Over!", canvas.width / 2, 200);
      ctx.font = "16px Fredoka, sans-serif";
      ctx.fillText("Tap, or Press Space to Start", canvas.width / 2, 230);
      return;
    }

    requestAnimationFrame(loop);
  }

  function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    for (let i = 0; i < canvas.width; i += 80) {
      ctx.drawImage(groundImg, i, canvas.height - groundHeight, 80, groundHeight);
    }
    ctx.drawImage(birdImg, birdX, birdY, 30, 24);
    ctx.fillStyle = "white";
    ctx.font = "22px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Tap, or Press Space to Start", canvas.width / 2, 220);
  }

  drawStartScreen();
});

