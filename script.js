const holes = document.querySelectorAll('.mole-hole');
const scoreElement = document.getElementById('score-value');
const timeElement = document.getElementById('time-value');
const highScoreElement = document.getElementById('high-score-value');
const startButton = document.getElementById('start-button');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const gameOverModal = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const finalHighScoreElement = document.getElementById('final-high-score');
const molesWhackedElement = document.getElementById('moles-whacked');
const accuracyElement = document.getElementById('accuracy');
const playAgainButton = document.getElementById('play-again');
const freezeTimeButton = document.getElementById('freeze-time');
const doublePointsButton = document.getElementById('double-points');

let score = 0;
let highScore = 0;
let timeLeft = 30;
let gameInterval;
let gameActive = false;
let difficulty = 'medium';
let molesWhacked = 0;
let totalClicks = 0;
let isFrozen = false;
let isDoublePoints = false;

const difficultySettings = {
    easy: { minPeepTime: 1000, maxPeepTime: 2000, goldenMoleChance: 0.05 },
    medium: { minPeepTime: 500, maxPeepTime: 1500, goldenMoleChance: 0.1 },
    hard: { minPeepTime: 300, maxPeepTime: 1000, goldenMoleChance: 0.15 }
};

function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    return holes[index];
}

function peep() {
    const hole = randomHole();
    const mole = document.createElement('div');
    mole.classList.add('mole', 'appear');
    
    if (Math.random() < difficultySettings[difficulty].goldenMoleChance) {
        mole.classList.add('golden-mole');
    }
    
    hole.appendChild(mole);

    mole.addEventListener('click', whack);

    const { minPeepTime, maxPeepTime } = difficultySettings[difficulty];
    const peepTime = Math.random() * (maxPeepTime - minPeepTime) + minPeepTime;
    
    setTimeout(() => {
        if (hole.contains(mole)) {
            hole.removeChild(mole);
        }
        if (gameActive) peep();
    }, isFrozen ? peepTime * 2 : peepTime);
}

function whack(e) {
    totalClicks++;
    if (e.target.classList.contains('whacked')) return;
    
    molesWhacked++;
    let points = 1;
    if (e.target.classList.contains('golden-mole')) {
        points = 5;
    }
    if (isDoublePoints) {
        points *= 2;
    }
    score += points;
    scoreElement.textContent = score;
    e.target.classList.add('whacked');
    setTimeout(() => {
        e.target.remove();
    }, 100);
}

function updateTime() {
    if (!isFrozen) {
        timeLeft--;
    }
    timeElement.textContent = timeLeft;
    if (timeLeft === 0) endGame();
}

function startGame() {
    score = 0;
    timeLeft = 30;
    molesWhacked = 0;
    totalClicks = 0;
    scoreElement.textContent = score;
    timeElement.textContent = timeLeft;
    gameActive = true;
    startButton.disabled = true;
    difficultyButtons.forEach(btn => btn.disabled = true);
    freezeTimeButton.disabled = false;
    doublePointsButton.disabled = false;
    peep();
    gameInterval = setInterval(updateTime, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    startButton.disabled = false;
    difficultyButtons.forEach(btn => btn.disabled = false);
    freezeTimeButton.disabled = true;
    doublePointsButton.disabled = true;
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
    }
    showGameOverModal();
}

function showGameOverModal() {
    finalScoreElement.textContent = score;
    finalHighScoreElement.textContent = highScore;
    molesWhackedElement.textContent = molesWhacked;
    accuracyElement.textContent = ((molesWhacked / totalClicks) * 100).toFixed(2);
    gameOverModal.style.display = 'block';
}

function hideGameOverModal() {
    gameOverModal.style.display = 'none';
}

function freezeTime() {
    if (!isFrozen) {
        isFrozen = true;
        document.body.classList.add('freeze-active');
        setTimeout(() => {
            isFrozen = false;
            document.body.classList.remove('freeze-active');
        }, 5000);
    }
}

function activateDoublePoints() {
    if (!isDoublePoints) {
        isDoublePoints = true;
        document.body.classList.add('double-points-active');
        setTimeout(() => {
            isDoublePoints = false;
            document.body.classList.remove('double-points-active');
        }, 5000);
    }
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

freezeTimeButton.addEventListener('click', freezeTime);
doublePointsButton.addEventListener('click', activateDoublePoints);

if (localStorage.getItem('whackAMoleHighScore')) {
    highScore = parseInt(localStorage.getItem('whackAMoleHighScore'));
    highScoreElement.textContent = highScore;
}

window.addEventListener('beforeunload', () => {
    localStorage.setItem('whackAMoleHighScore', highScore);
});