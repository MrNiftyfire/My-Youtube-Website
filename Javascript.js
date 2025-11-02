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

if (trailerImageElement) {
  trailerImageElement.addEventListener("click", () => {
    trailerImageElement.style.opacity = "0"; // fade out

    setTimeout(() => {
      currentTrailerIndex = (currentTrailerIndex + 1) % trailerImages.length;
      trailerImageElement.src = trailerImages[currentTrailerIndex];
      trailerImageElement.style.opacity = "1"; // fade back in
    }, 400); // matches CSS transition
  });
}

// ===== FLAPPY BIRD GAME (menu bar excluded + mobile-friendly + no double input) =====
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('flappyCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = 300;
  canvas.height = 450;

  const bgImg = new Image();
  bgImg.src = 'Flappy Bird Background (Game).png';
  const birdImg = new Image();
  birdImg.src = 'Flappy Bird.png';
  const pipeImg = new Image();
  pipeImg.src = 'Pipe.png';
  const groundImg = new Image();
  groundImg.src = 'Grass.png';

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

  function addPipe() {
    const topHeight = Math.floor(Math.random() * 120) + 50;
    pipes.push({
      x: canvas.width,
      top: topHeight,
      bottom: topHeight + pipeGap
    });
  }

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
    }
  }

  // Helper: check if click/tap is on the menu bar
  function isClickOnMenuBar(target) {
    return target.closest && target.closest('.menu-bar');
  }

  // ===== CLICK / TAP ANYWHERE EXCEPT MENU BAR (no double tap) =====
  let touchJustTriggered = false; // prevents duplicate click after touch

  function isClickOnMenuBar(target) {
    return target.closest && target.closest('.menu-bar');
  }

  // Handle clicks (desktop and synthetic mobile clicks)
  document.addEventListener('click', e => {
    // Skip if a touch just fired (mobile)
    if (touchJustTriggered) {
      touchJustTriggered = false;
      return;
    }

    if (isClickOnMenuBar(e.target)) return; // ignore menu bar
    handleInput();
  });

  // Handle taps (real mobile touches)
  document.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    // Ignore taps on menu bar
    if (isClickOnMenuBar(element)) return;

    // Mark so the next synthetic click is ignored
    touchJustTriggered = true;

    // Check if touch is inside canvas area
    const rect = canvas.getBoundingClientRect();
    if (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    ) {
      handleInput();
    } else {
      // Touch outside canvas (still triggers game)
      handleInput();
    }
    // Don't preventDefault → keeps scroll working
  });

  // Space key (desktop)
  document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      e.preventDefault();
      handleInput();
    }
  });

  function loop() {
    if (gameOver) return;
    frame++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    velocity += gravity;
    birdY += velocity;

    if (frame % 100 === 0) addPipe();

    for (let i = pipes.length - 1; i >= 0; i--) {
      const p = pipes[i];
      p.x -= 2;

      ctx.save();
      ctx.translate(p.x, 0);
      ctx.scale(1, -1);
      ctx.drawImage(pipeImg, 0, -p.top, 50, p.top);
      ctx.restore();

      ctx.drawImage(pipeImg, p.x, p.bottom, 50, canvas.height - p.bottom - groundHeight);

      if (
        birdX + 30 > p.x && birdX < p.x + 50 &&
        (birdY < p.top || birdY + 24 > p.bottom)
      ) {
        gameOver = true;
      }

      if (p.x + 50 < 0) {
        pipes.splice(i, 1);
        score++;
      }
    }

    for (let i = 0; i < canvas.width; i += 80) {
      ctx.drawImage(groundImg, i, canvas.height - groundHeight, 80, groundHeight);
    }

    ctx.drawImage(birdImg, birdX, birdY, 30, 24);

    if (birdY + 24 >= canvas.height - groundHeight) {
      gameOver = true;
    }

    ctx.fillStyle = "white";
    ctx.font = "20px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + score, canvas.width / 2, 40);

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
