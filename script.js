const holes = document.querySelectorAll('.mole-hole');
const scoreElement = document.getElementById('score-value');
const timeElement = document.getElementById('time-value');
const highScoreElement = document.getElementById('high-score-value');
const startButton = document.getElementById('start-button');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const gameOverModal = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const finalHighScoreElement = document.getElementById('final-high-score');
const playAgainButton = document.getElementById('play-again');

let score = 0;
let highScore = 0;
let timeLeft = 30;
let gameInterval;
let gameActive = false;
let difficulty = 'medium';

const difficultySettings = {
    easy: { minPeepTime: 1000, maxPeepTime: 2000 },
    medium: { minPeepTime: 500, maxPeepTime: 1500 },
    hard: { minPeepTime: 300, maxPeepTime: 1000 }
};

function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    return holes[index];
}

function peep() {
    const hole = randomHole();
    const mole = document.createElement('div');
    mole.classList.add('mole', 'appear');
    hole.appendChild(mole);

    mole.addEventListener('click', whack);

    const { minPeepTime, maxPeepTime } = difficultySettings[difficulty];
    const peepTime = Math.random() * (maxPeepTime - minPeepTime) + minPeepTime;
    
    setTimeout(() => {
        hole.removeChild(mole);
        if (gameActive) peep();
    }, peepTime);
}

function whack(e) {
    score++;
    scoreElement.textContent = score;
    e.target.classList.add('whacked');
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
    difficultyButtons.forEach(btn => btn.disabled = true);
    peep();
    gameInterval = setInterval(updateTime, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    startButton.disabled = false;
    difficultyButtons.forEach(btn => btn.disabled = false);
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
    }
    showGameOverModal();
}

function showGameOverModal() {
    finalScoreElement.textContent = score;
    finalHighScoreElement.textContent = highScore;
    gameOverModal.style.display = 'block';
}

function hideGameOverModal() {
    gameOverModal.style.display = 'none';
}

startButton.addEventListener('click', startGame);

difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        difficulty = btn.dataset.difficulty;
        difficultyButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

playAgainButton.addEventListener('click', () => {
    hideGameOverModal();
    startGame();
});

if (localStorage.getItem('whackAMoleHighScore')) {
    highScore = parseInt(localStorage.getItem('whackAMoleHighScore'));
    highScoreElement.textContent = highScore;
}

window.addEventListener('beforeunload', () => {
    localStorage.setItem('whackAMoleHighScore', highScore);
});