const holes = document.querySelectorAll('.mole-hole');
const scoreElement = document.getElementById('score-value');
const timeElement = document.getElementById('time-value');
const highScoreElement = document.getElementById('high-score-value');
const startButton = document.getElementById('start-button');
const whackSound = document.getElementById('whack-sound');
const backgroundMusic = document.getElementById('background-music');

let score = 0;
let highScore = 0;
let timeLeft = 30;
let gameInterval;
let gameActive = false;

function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    return holes[index];
}

function peep() {
    const hole = randomHole();
    const mole = document.createElement('div');
    mole.classList.add('mole');
    hole.appendChild(mole);

    mole.addEventListener('click', whack);

    const peepTime = Math.random() * 1000 + 500;
    setTimeout(() => {
        hole.removeChild(mole);
        if (gameActive) peep();
    }, peepTime);
}

function whack(e) {
    score++;
    scoreElement.textContent = score;
    e.target.style.transform = 'translateY(100%)';
    whackSound.currentTime = 0;
    whackSound.play();
    setTimeout(() => {
        e.target.remove();
    }, 100);
}

function updateTime() {
    timeLeft--;
    timeElement.textContent = timeLeft;
    if (timeLeft === 0) endGame();
}

function startGame() {
    score = 0;
    timeLeft = 30;
    scoreElement.textContent = score;
    timeElement.textContent = timeLeft;
    gameActive = true;
    startButton.disabled = true;
    backgroundMusic.play();
    peep();
    gameInterval = setInterval(updateTime, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    startButton.disabled = false;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
    }
    alert(`Game Over! Your score: ${score}`);
}

startButton.addEventListener('click', startGame);

if (localStorage.getItem('whackAMoleHighScore')) {
    highScore = parseInt(localStorage.getItem('whackAMoleHighScore'));
    highScoreElement.textContent = highScore;
}

window.addEventListener('beforeunload', () => {
    localStorage.setItem('whackAMoleHighScore', highScore);
});