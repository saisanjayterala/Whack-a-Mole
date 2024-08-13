const holes = document.querySelectorAll('.mole-hole');
const scoreElement = document.getElementById('score-value');
const timeElement = document.getElementById('time-value');
const levelElement = document.getElementById('level-value');
const startButton = document.getElementById('start-button');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const gameOverModal = document.getElementById('game-over');
const levelUpModal = document.getElementById('level-up');
const finalScoreElement = document.getElementById('final-score');
const highestLevelElement = document.getElementById('highest-level');
const molesWhackedElement = document.getElementById('moles-whacked');
const accuracyElement = document.getElementById('accuracy');
const newLevelElement = document.getElementById('new-level');
const bonusPointsElement = document.getElementById('bonus-points');
const playAgainButton = document.getElementById('play-again');
const continueButton = document.getElementById('continue');
const freezeTimeButton = document.getElementById('freeze-time');
const doublePointsButton = document.getElementById('double-points');
const whackAllButton = document.getElementById('whack-all');
const shieldButton = document.getElementById('shield');
const freezeCountElement = document.getElementById('freeze-count');
const doubleCountElement = document.getElementById('double-count');
const whackAllCountElement = document.getElementById('whack-all-count');
const shieldCountElement = document.getElementById('shield-count');

let score = 0;
let timeLeft = 30;
let level = 1;
let gameInterval;
let gameActive = false;
let difficulty = 'medium';
let molesWhacked = 0;
let totalClicks = 0;
let isFrozen = false;
let isDoublePoints = false;
let combo = 0;
let freezeCount = 3;
let doubleCount = 3;
let whackAllCount = 1;
let shieldCount = 2;
let isShieldActive = false;

const difficultySettings = {
    easy: { minPeepTime: 2000, maxPeepTime: 3000, goldenMoleChance: 0.05, bombChance: 0.02 },
    medium: { minPeepTime: 1000, maxPeepTime: 2000, goldenMoleChance: 0.1, bombChance: 0.05 },
    hard: { minPeepTime: 500, maxPeepTime: 1500, goldenMoleChance: 0.15, bombChance: 0.08 }
};

function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    return holes[index];
}

function peep() {
    const hole = randomHole();
    const mole = document.createElement('div');
    mole.classList.add('mole', 'appear');
    
    const rand = Math.random();
    if (rand < difficultySettings[difficulty].bombChance) {
        mole.classList.add('bomb');
        mole.innerHTML = '<i class="fas fa-bomb"></i>';
    } else if (rand < difficultySettings[difficulty].goldenMoleChance + difficultySettings[difficulty].bombChance) {
        mole.classList.add('golden-mole');
        mole.innerHTML = '<i class="fas fa-medal"></i>';
    } else {
        mole.innerHTML = '<i class="fas fa-paw"></i>';
    }
    
    hole.appendChild(mole);

    void mole.offsetWidth;

    mole.addEventListener('click', whack);

    const { minPeepTime, maxPeepTime } = difficultySettings[difficulty];
    const peepTime = Math.random() * (maxPeepTime - minPeepTime) + minPeepTime;
    
    setTimeout(() => {
        if (hole.contains(mole)) {
            hole.removeChild(mole);
            combo = 0;
        }
        if (gameActive) peep();
    }, isFrozen ? peepTime * 2 : peepTime);
}
function whack(e) {
    totalClicks++;
    if (e.target.classList.contains('whacked')) return;
    
    if (e.target.classList.contains('bomb')) {
        if (isShieldActive) {
            isShieldActive = false;
            document.body.classList.remove('shield-active');
            e.target.remove();
            return;
        }
        endGame();
        return;
    }
    
    molesWhacked++;
    combo++;
    let points = 1 * combo;
    if (e.target.classList.contains('golden-mole')) {
        points = 5 * combo;
    }
    if (isDoublePoints) {
        points *= 2;
    }
    score += points;
    scoreElement.textContent = score;
    e.target.classList.add('whacked');
    
    showComboMultiplier(e.target, combo);
    
    setTimeout(() => {
        e.target.remove();
    }, 100);
    
    if (score >= level * 100) {
        levelUp();
    }
}

function showComboMultiplier(target, combo) {
    const multiplier = document.createElement('div');
    multiplier.textContent = `x${combo}`;
    multiplier.classList.add('combo-multiplier');
    target.parentNode.appendChild(multiplier);
    
    setTimeout(() => {
        multiplier.remove();
    }, 1000);
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
    level = 1;
    molesWhacked = 0;
    totalClicks = 0;
    combo = 0;
    freezeCount = 3;
    doubleCount = 3;
    whackAllCount = 1;
    shieldCount = 2;
    scoreElement.textContent = score;
    timeElement.textContent = timeLeft;
    levelElement.textContent = level;
    freezeCountElement.textContent = freezeCount;
    doubleCountElement.textContent = doubleCount;
    whackAllCountElement.textContent = whackAllCount;
    shieldCountElement.textContent = shieldCount;
    gameActive = true;
    startButton.disabled = true;
    difficultyButtons.forEach(btn => btn.disabled = true);
    freezeTimeButton.disabled = false;
    doublePointsButton.disabled = false;
    whackAllButton.disabled = false;
    shieldButton.disabled = false;
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
    whackAllButton.disabled = true;
    shieldButton.disabled = true;
    showGameOverModal();
}

function showGameOverModal() {
    finalScoreElement.textContent = score;
    highestLevelElement.textContent = level;
    molesWhackedElement.textContent = molesWhacked;
    accuracyElement.textContent = ((molesWhacked / totalClicks) * 100).toFixed(2);
    gameOverModal.style.display = 'block';
}

function hideGameOverModal() {
    gameOverModal.style.display = 'none';
}

function levelUp() {
    level++;
    levelElement.textContent = level;
    const bonusPoints = level * 50;
    score += bonusPoints;
    scoreElement.textContent = score;
    showLevelUpModal(bonusPoints);
}

function showLevelUpModal(bonusPoints) {
    gameActive = false;
    clearInterval(gameInterval);
    newLevelElement.textContent = level;
    bonusPointsElement.textContent = bonusPoints;
    levelUpModal.style.display = 'block';
}

function hideLevelUpModal() {
    levelUpModal.style.display = 'none';
    gameActive = true;
    timeLeft += 10; 
    timeElement.textContent = timeLeft;
    gameInterval = setInterval(updateTime, 1000);
    peep();
}

function freezeTime() {
    if (!isFrozen && freezeCount > 0) {
        isFrozen = true;
        freezeCount--;
        freezeCountElement.textContent = freezeCount;
        document.body.classList.add('freeze-active');
        setTimeout(() => {
            isFrozen = false;
            document.body.classList.remove('freeze-active');
        }, 5000);
    }
}

function activateDoublePoints() {
    if (!isDoublePoints && doubleCount > 0) {
        isDoublePoints = true;
        doubleCount--;
        doubleCountElement.textContent = doubleCount;
        document.body.classList.add('double-points-active');
        setTimeout(() => {
            isDoublePoints = false;
            document.body.classList.remove('double-points-active');
        }, 5000);
    }
}

function whackAll() {
    if (whackAllCount > 0) {
        whackAllCount--;
        whackAllCountElement.textContent = whackAllCount;
        const activeMoles = document.querySelectorAll('.mole:not(.whacked)');
        activeMoles.forEach(mole => {
            mole.click();
        });
    }
}

function activateShield() {
    if (!isShieldActive && shieldCount > 0) {
        isShieldActive = true;
        shieldCount--;
        shieldCountElement.textContent = shieldCount;
        document.body.classList.add('shield-active');
        setTimeout(() => {
            isShieldActive = false;
            document.body.classList.remove('shield-active');
        }, 10000);
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

continueButton.addEventListener('click', hideLevelUpModal);

freezeTimeButton.addEventListener('click', freezeTime);
doublePointsButton.addEventListener('click', activateDoublePoints);
whackAllButton.addEventListener('click', whackAll);
shieldButton.addEventListener('click', activateShield);

document.querySelector('.difficulty-btn[data-difficulty="medium"]').classList.add('active');