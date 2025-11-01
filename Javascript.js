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
