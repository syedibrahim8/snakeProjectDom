const board = document.querySelector(".board");
const blockHeight = 50;
const blockWidth = 50;

const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".btn-restart");

const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const modal = document.querySelector(".modal");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerId = null;
let direction = "down";

const blocks = {};
let snake = [{ x: 1, y: 3 }];
let food = getRandomFood();

let score = 0;
let time = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreElement.textContent = highScore;


for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}


function getRandomFood() {
  return {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
}

function clearBoard() {
  Object.values(blocks).forEach((block) =>
    block.classList.remove("fill", "food")
  );
}

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function render() {
  let head;

  if (direction === "left") head = { x: snake[0].x, y: snake[0].y - 1 };
  if (direction === "right") head = { x: snake[0].x, y: snake[0].y + 1 };
  if (direction === "down") head = { x: snake[0].x + 1, y: snake[0].y };
  if (direction === "up") head = { x: snake[0].x - 1, y: snake[0].y };

  if (
    head.x < 0 ||
    head.x >= rows ||
    head.y < 0 ||
    head.y >= cols
  ) {
    gameOver();
    return;
  }

  clearBoard();

  /* Food */
  if (head.x === food.x && head.y === food.y) {
    snake.unshift(head);
    food = getRandomFood();
    score += 10;
    scoreElement.textContent = score;
  } else {
    snake.unshift(head);
    snake.pop();
  }

  blocks[`${food.x}-${food.y}`].classList.add("food");

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}

function startGame() {
  modal.style.display = "none";
  startGameModal.style.display = "none";
  gameOverModal.style.display = "none";

  if (intervalId) clearInterval(intervalId);
  if (timerId) clearInterval(timerId);

  intervalId = setInterval(render, 250);

  timerId = setInterval(() => {
    time++;
    timeElement.textContent = formatTime(time);
  }, 1000);
}

function gameOver() {
  clearInterval(intervalId);
  clearInterval(timerId);
  intervalId = null;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("snakeHighScore", highScore);
    highScoreElement.textContent = highScore;
  }

  modal.style.display = "flex";
  gameOverModal.style.display = "flex";
}

function restartGame() {
  clearInterval(intervalId);
  clearInterval(timerId);

  snake = [{ x: 1, y: 3 }];
  direction = "down";
  food = getRandomFood();

  score = 0;
  time = 0;

  scoreElement.textContent = score;
  timeElement.textContent = "00:00";

  clearBoard();
  startGame();
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  if (e.key === "ArrowDown" && direction !== "up") direction = "down";
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});