// Elementos HTML
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const notifElement = document.getElementById('alert');
const mainGame = document.querySelector('.main-container');
const startMenu = document.querySelector('.radio-boxes');

// Gerar coordenadas aleatórias
function randomNum(max, min) {
    return Math.round(Math.random() * (max - min) + min);
}

// Será posta 6 navios no jogo
function generateTargetCoords() {
    let shipCoordinates = [];

    const numOfShips = randomNum(10, 15);

    for (let i = 0; i < numOfShips; i++) {
        const x = randomNum(8, 0);
        const y = randomNum(12, 0);
        shipCoordinates.push(`ship${x}${y}`);
    }

    return shipCoordinates;
}

// Gerar coordenadas dos 2 bônus
function generateBonusCoords() {
    let bonusCoordinates = [];

    for (let i = 0; i < 2; i++) {
        const x = randomNum(8, 0);
        const y = randomNum(12, 0);
        bonusCoordinates.push(`ship${x}${y}`)
    }

    return bonusCoordinates;
}

// Função listener de cada célula da table
function handleClick(i, j) {
    // Checkpoint para quando acaba as vidas
    if (lives == 0) {
        alert("No lives left! Press the Reset button.")

        notifElement.className = "end-msg";
        notifElement.innerHTML = `No more lives. You missed ${numOfShips} ships.`;

        return;
    };
    
    // Checkpoint para quando ganha
    if (numOfShips == 0) {
        alert("You won! Reset to play more.")

        notifElement.innerHTML = `You won!`;

        return;
    }

    // Captando a célula clicada
    const td = document.getElementById(`ship${i}${j}`);
    const tdId = td.id;
    console.log(`Cell hit: ${tdId}`)

    // Checando se a célula clicada é uma bomba
    for (let i = 0; i < bonusCoordinates.length; i++) {
        if (tdId == bonusCoordinates[0]) {
            td.src = "./assets/nuke.jpeg";
            return;
        }
        else if (tdId == bonusCoordinates[1]) {
            td.src = "./assets/missile.jpeg";
            return;
        }
    }

    // Checkpoint de Hit ou Miss
    let hitFlag = false;
    for (let item of shipCoordinates) {
        if (tdId == item) hitFlag = true;
    }
    return hitFlag ? handleHit(td) : handleMiss(td);
}


// Função de hit
function handleHit(tableCell) {
	tableCell.src = "./assets/shipwreck.png";
    // Aumentar score e restaurar uma vida
	score++;

    // Diminur número de navios
    numOfShips--;

    // Desativar notificação, se habilitado
    if (!isNotifDisabled()) {
        notifElement.innerHTML = `Você acertou um alvo!`;
        setTimeout(() => notifElement.innerHTML = `Ships left: ${numOfShips}`, 1000);    
    }
    
    notifElement.innerHTML = `Ships left: ${numOfShips}`;
    scoreElement.innerHTML = `Score: ${score}`;

	return;
}

// Função de erro
function handleMiss(tableCell) {
	tableCell.src = "./assets/ocean.png";
    console.log(lives)
    // Diminuir vida
    lives--;
    console.log(lives)
    livesElement.innerHTML = `Lives: ${lives}`;

    // Desativar notificação, se habilitado
    if (!isNotifDisabled()) {
        notifElement.innerHTML = `Deu água!`;
        setTimeout(() => notifElement.innerHTML = `Ships left: ${numOfShips}`, 1000);
    }

	return;
}

window.addEventListener("load", () => {
    checkElement = document.getElementById('chk-notifs');
    checkElement.addEventListener('click', (e) => {
        isNotif = e.target.checked;
    })
});

// Variáveis de função
const shipCoordinates = generateTargetCoords();
const bonusCoordinates = generateBonusCoords();

// Variáveis globais
let score = 0;
let numOfShips = shipCoordinates.length;
let checkElement;
let isNotif = false;
let radioCheckedValue;
let lives;

// Inicialização de HTML dentro do game
notifElement.innerHTML = `Ships left: ${numOfShips}`;

// Getter de isNotif
function isNotifDisabled() {
    return isNotif;
}

// Função para verificar qual radio está marcado
function handleRadio() {
    const radioElements = document.querySelectorAll('#rad');
    for (let radio of radioElements) {
        if (radio.checked) {
            radioCheckedValue = parseInt(radio.value);
            livesElement.innerHTML = `Lives: ${radioCheckedValue}`

            mainGame.style.visibility = "visible";
            startMenu.style.display = "none";

            lives = radioCheckedValue;
        }
    }
    return;
}

// Verificação de coordenadas do bônus X coordenadas navios
function isCoordsRepeated() {
    for (let bonusCoord of bonusCoordinates) {
        for (let shipCoord of shipCoordinates) {
            if (bonusCoord == shipCoord) {
                return true;
            }
        }
    }

    return false;
}