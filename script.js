const holes = document.querySelectorAll('.mole-hole');
const scoreElement = document.getElementById('score-value');
const startButton = document.getElementById('start-button');

let score = 0;
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

    setTimeout(() => {
        hole.removeChild(mole);
        if (gameActive) peep();
    }, 1000);
}

function whack(e) {
    score++;
    scoreElement.textContent = score;
    e.target.remove();
}

function startGame() {
    score = 0;
    scoreElement.textContent = score;
    gameActive = true;
    startButton.disabled = true;
    peep();
    setTimeout(() => {
        gameActive = false;
        startButton.disabled = false;
    }, 30000);
}

startButton.addEventListener('click', startGame);