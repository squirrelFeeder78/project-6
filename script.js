// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let score = 0;
let timeLeft = 30;
let timerInterval;
let plopAudio = new Audio('plop.mp3');
let sizzleAudio = new Audio('sizzle.mp3');

const scoreSpan = document.getElementById("score");
const timeSpan = document.getElementById("time");
const gameContainer = document.getElementById("game-container");
const startBtn = document.getElementById("start-btn");

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 30;
  scoreSpan.textContent = score;
  timeSpan.textContent = timeLeft;
  startBtn.disabled = true;
  clearDrops();
  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  timeSpan.textContent = timeLeft;
  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  // Remove remaining drops
  clearDrops();
  // Show final score and replay UI
  showEndScreen();
}

function clearDrops() {
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }
}

let winMessages = [
  "Amazing! You’re a water hero! 💧",
  "Fantastic! Clean water champion! 🏆",
  "You crushed it! Every drop counts!",
  "Outstanding! Water for all!",
  "Incredible! You made a splash!"
];
let loseMessages = [
  "Try again! Clean water needs you!",
  "Don’t give up! The world needs more clean water!",
  "Keep going! Every drop matters!",
  "Oops! Dirty water got you this time!",
  "Almost! Give it another shot!"
];

function showEndScreen() {
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(255,255,255,0.95)';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '10';

  let message = '';
  if (score >= 200) {
    message = winMessages[Math.floor(Math.random() * winMessages.length)];
  } else if (score < 0) {
    message = loseMessages[Math.floor(Math.random() * loseMessages.length)];
  } else {
    message = 'Game Over! Thanks for playing!';
  }

  overlay.innerHTML = `
    <h2>${message}</h2>
    <p>Your Score: <strong>${score}</strong></p>
    <button id="replay-btn">Play Again</button>
    <a href="https://www.charitywater.org/" target="_blank" style="margin-top:10px;color:#2E9DF7;text-decoration:underline;">Learn more at charity: water</a>
  `;
  gameContainer.appendChild(overlay);
  document.getElementById('replay-btn').onclick = function() {
    overlay.remove();
    startBtn.disabled = false;
    scoreSpan.textContent = 0;
    timeSpan.textContent = 30;
    score = 0;
    timeLeft = 30;
  };
}

function createDrop() {
  if (!gameRunning) return;
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  // Randomly decide if drop is clean or dirty
  const isClean = Math.random() < 0.7; // 70% clean, 30% dirty
  drop.className = isClean ? "water-drop" : "water-drop bad-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  gameContainer.appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove();
  });
  drop.addEventListener("click", function handleDropClick(e) {
    if (!gameRunning) return;
    if (isClean) {
      score += 20;
      plopAudio.currentTime = 0;
      plopAudio.play();
    } else {
      score -= 50;
      sizzleAudio.currentTime = 0;
      sizzleAudio.play();
    }
    scoreSpan.textContent = score;
    drop.remove();
  });
}
