// Elementos HTML
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const notifElement = document.getElementById('alert');
const mainGame = document.querySelector('.main-container');
const startMenu = document.querySelector('.radio-boxes');

// Função listener de cada célula da table
function handleClick(i, j) {
    console.log(shipCoordinates);
    // Checkpoint para quando acaba as vidas
    if (isDead()) return;
    
    // Checkpoint para quando ganha
    if(isWin()) return;

    // Captando a célula clicada
    const tableCell = document.getElementById(`ship${i}${j}`);
    console.log(`Cell hit: ${tableCell.id}`);

    // Ataque básico
    if (selectedAttack == 'basic-attack') {
        if (isHit(tableCell)) {
            showHitShip(tableCell);
            score++;
            numOfShips--;

            // send notif
            // update score and lives div
        } else {
            showOcean(tableCell);
            lives--;
            // send notif
            // update score and lives div
        }
    } 
    // Ataque de bomba
    else if (selectedAttack == 'bomb') {
        const surroundingCells = getBombAttackSurroundingCells(i, j);

        const numOfShipsHit = getNumOfShipsHit(surroundingCells)
        
        numOfShipsHit ? score += numOfShipsHit : lives--;

        numOfShips -= numOfShipsHit;

        // send notif
        // update score and lives div
        
        showAttackedTiles(surroundingCells);
    }
    // Ataque atômico
    else if (selectedAttack == 'atomic-bomb') {
       const surroundingCells = getAtomicAttackSurroundingCells(i, j);
       
       const numOfShipsHit = getNumOfShipsHit(surroundingCells);
       
       numOfShipsHit ? score += numOfShipsHit : lives--;
       
       numOfShips -= numOfShipsHit;

       // send notif
       // update score and lives div

       showAttackedTiles(surroundingCells);
    }
    // Checker de opção inválida
    else {
        alert('Choose a valid attack option!');
        return;
    }

    // Checando se a célula clicada é uma bomba
    for (let i = 0; i < bonusCoordinates.length; i++) {
        if (tableCell.id == bonusCoordinates[0]) {
            tableCell.src = "./assets/nuke.jpeg";
            return;
        }
        else if (tableCell.id == bonusCoordinates[1]) {
            tableCell.src = "./assets/missile.jpeg";
            return;
        }
    }
}

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

// Função de hit
function handleHit(tableCell, shipsHit) {
	tableCell.src = "./assets/shipwreck.png";

    // Aumentar score
	score += shipsHit;

    // Diminur número de navios
    numOfShips -= shipsHit;

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

    // Diminuir vida
    lives--;
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
let selectedAttack = '';

// Inicialização de HTML dentro do game
notifElement.innerHTML = `Ships left: ${numOfShips}`;

// Getter de isNotif
function isNotifDisabled() {
    return isNotif;
}

// Função para verificar qual radio check está marcado
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

// Watcher do select de ataques
function watchAttackSelector() {
    const selectValue = document.getElementById('atk-type').value;
    console.log(selectValue);
    selectedAttack = selectValue;
}

// Checkpoint de zero vidas
function isDead() {
    if (lives == 0) {
        alert("No lives left! Press the Reset button.")

        notifElement.className = "end-msg";
        notifElement.innerHTML = `No more lives. You missed ${numOfShips} ships.`;

        return true;
    };
}

// Win checkpoint
function isWin() {
    if (numOfShips == 0) {
        alert("You won! Reset to play more.")

        notifElement.innerHTML = `You won!`;

        return true;
    }
}

function isHit(tableCell) {
    let hitFlag = false;

    for (let shipCoordinate of shipCoordinates) {
        if (tableCell.id == shipCoordinate) {
            hitFlag = true;
        }
    }

    return hitFlag;
}

// Bomb Attack
function getBombAttackSurroundingCells(i, j) {
	const surroundingCells = [];
	
	for (let a = -1; a < 2; a++) {
        if (a == 0) {
            for (let b = -1; b < 2; b++) {
                const cell = document.getElementById(`ship${i + a}${j + b}`);
                surroundingCells.push(cell);
            }
        }

        const cell = document.getElementById(`ship${i + a}${j}`);
        surroundingCells.push(cell);
    }

	return surroundingCells;
}

// Identificar células de ataque atômico
function getAtomicAttackSurroundingCells(i, j) {
    const surroundingCells = [];
    
    for (let a = -1; a < 2; a++) {
        for (let b = -1; b < 2; b++) {
            const cell = document.getElementById(`ship${i + a}${j + b}`);
            surroundingCells.push(cell);
        }
    }

    return surroundingCells;
}

// Mostrar células atacadas
function showAttackedTiles(surroundingCells) {
    for (surroundingCell of surroundingCells) {

        let flag = false;

        for (shipCoordinate of shipCoordinates) {
            if (surroundingCell.id == shipCoordinate) {
                flag = true;
                console.log(surroundingCell.id)
            }
        }

        flag ? showHitShip(surroundingCell) : showOcean(surroundingCell);
    }

    return;
}

function getNumOfShipsHit(surroundingCells) {
    let shipsHit = 0;

    for (surroundingCell of surroundingCells) {
        for (shipCoordinate of shipCoordinates) {
            if (surroundingCell.id == shipCoordinate) {
                shipsHit++;
            }
        }
    }

    return shipsHit;
}

function showHitShip(tableCell) {
    tableCell.src = './assets/shipwreck.png';
}
  
  function showOcean(tableCell) {
    tableCell.src = './assets/ocean.png';
}