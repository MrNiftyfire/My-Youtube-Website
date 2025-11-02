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

/// ===== FLAPPY BIRD GAME (menu bar excluded + mobile-friendly) =====
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('flappyCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Set smaller size
  canvas.width = 300;
  canvas.height = 450;

  // Load textures
  const bgImg = new Image();
  bgImg.src = 'Flappy Bird Background (Game).png';
  const birdImg = new Image();
  birdImg.src = 'Flappy Bird.png';
  const pipeImg = new Image();
  pipeImg.src = 'Pipe.png';
  const groundImg = new Image();
  groundImg.src = 'Grass.png';

  // Game variables
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

  // ===== CLICK / TAP ANYWHERE EXCEPT MENU BAR =====
  function isClickOnMenuBar(target) {
    // check if clicked element or its parent is the menu bar
    return target.closest && target.closest('.menu-bar');
  }

  document.addEventListener('click', e => {
    if (isClickOnMenuBar(e.target)) return; // ignore menu bar clicks
    handleInput();
  });

  document.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (isClickOnMenuBar(element)) return; // ignore touches on menu bar

    const rect = canvas.getBoundingClientRect();
    if (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    ) {
      handleInput();
    }
    // Don't preventDefault → keeps scrolling enabled
  });

  // Spacebar support (desktop)
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

    // Bird physics
    velocity += gravity;
    birdY += velocity;

    // Add pipes
    if (frame % 100 === 0) addPipe();

    // Move and draw pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      const p = pipes[i];
      p.x -= 2;

      // Top pipe
      ctx.save();
      ctx.translate(p.x, 0);
      ctx.scale(1, -1);
      ctx.drawImage(pipeImg, 0, -p.top, 50, p.top);
      ctx.restore();

      // Bottom pipe
      ctx.drawImage(pipeImg, p.x, p.bottom, 50, canvas.height - p.bottom - groundHeight);

      // Collision detection
      if (
        birdX + 30 > p.x && birdX < p.x + 50 &&
        (birdY < p.top || birdY + 24 > p.bottom)
      ) {
        gameOver = true;
      }

      // Remove passed pipes
      if (p.x + 50 < 0) {
        pipes.splice(i, 1);
        score++;
      }
    }

    // Draw ground
    for (let i = 0; i < canvas.width; i += 80) {
      ctx.drawImage(groundImg, i, canvas.height - groundHeight, 80, groundHeight);
    }

    // Draw bird
    ctx.drawImage(birdImg, birdX, birdY, 30, 24);

    // Ground collision
    if (birdY + 24 >= canvas.height - groundHeight) {
      gameOver = true;
    }

    // Score text
    ctx.fillStyle = "white";
    ctx.font = "20px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + score, canvas.width / 2, 40);

    // Game over overlay
    if (gameOver) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "28px Fredoka, sans-serif";
      ctx.fillText("Game Over!", canvas.width / 2, 200);
      ctx.font = "16px Fredoka, sans-serif";
      ctx.fillText("Click, or Press Space", canvas.width / 2, 230);
      return;
    }

    requestAnimationFrame(loop);
  }

  // Start screen
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
    ctx.fillText("Click, or Press Space", canvas.width / 2, 220);
  }

  drawStartScreen();
});
