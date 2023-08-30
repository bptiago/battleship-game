// Elementos HTML
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const notifElement = document.getElementById('alert');
const mainGame = document.querySelector('.main-container');
const startMenu = document.querySelector('.radio-boxes');

// Variáveis de função
const shipCoordinates = generateTargetCoords();
const bonusCoordinates = shipCoordinates.splice(-2, 2); // É um splice pois é o meio mais fácil de evitar a repetição de coord entre um navio e um bônus

// Variáveis globais
let score = 0;
let numOfShips = shipCoordinates.length;
let checkElement;
let isNotif = false;
let radioCheckedValue;
let lives;
let selectedAttack = '';
let bomb = 2;
let atomicBomb = 1;

// Inicialização de HTML dentro do game
notifElement.innerHTML = `Ships left: ${numOfShips}`;

// Função listener de cada célula da table
function handleClick(i, j) {    

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
            
            updateScore(1);
      
            if (isNotifDisabled) notifyHit();
            // update score and lives div
        } else {
            if (tableCell.id == bonusCoordinates[0]) {
              showBomb(tableCell);
              notifyBonus();
              bomb++;
            }
            else if (tableCell.id == bonusCoordinates[1]) {
              showAtomicBomb(tableCell);
              notifyBonus();
              atomicBomb++;
            } else {
              showOcean(tableCell);
              
              updateLives();
              
              if (isNotifDisabled) notifyMiss();
            }
        }
    } 
    // Ataque de bomba
    else if (selectedAttack == 'bomb') {

        // Checagem de munição
        if (!bomb) {alert('You have no more bombs! Find more.'); return;}

        // Decréscimo de munição
        bomb--;

        const surroundingCells = getBombAttackSurroundingCells(i, j);
        const numOfShipsHit = getNumOfShipsHit(surroundingCells);
        const numOfBonusHit = getNumOfBonusHit(surroundingCells);

        if (numOfShipsHit) {
            updateScore(numOfShipsHit);
            if (isNotifDisabled) notifyHit();
        } else if (numOfBonusHit) {
            if (isNotifDisabled) notifyBonus();
        }
        else {
            updateLives();
            if (isNotifDisabled) notifyMiss();
        }

        showAttackedTiles(surroundingCells);
    }
    // Ataque atômico
    else if (selectedAttack == 'atomic-bomb') {
        
        // Checagem de munição
        if (!atomicBomb) {alert('You have no more nuke! Find more.'); return;}

        // Decréscimo de munição
        atomicBomb--;

        const surroundingCells = getAtomicAttackSurroundingCells(i, j);
        const numOfShipsHit = getNumOfShipsHit(surroundingCells);
        const numOfBonusHit = getNumOfBonusHit(surroundingCells);

        if (numOfShipsHit) {
            updateScore(numOfShipsHit);
            if (isNotifDisabled) notifyHit();
        } else if (numOfBonusHit) {
            if (isNotifDisabled) notifyBonus();
        }
        else {
            updateLives();
            if (isNotifDisabled) notifyMiss();
        }
        
        showAttackedTiles(surroundingCells);
    }
    // Checker de opção inválida
    else {
        alert('Choose a valid attack option!');
        return;
    }
}

// Gerar coordenadas aleatórias
function randomNum(max, min) {
    return Math.round(Math.random() * (max - min) + min);
}

// Geração de coordenadas dos navios e de 2 bônus (são os últimos 2 índices)
function generateTargetCoords() {
    let shipCoordinates = [];

    const numOfShips = randomNum(10, 15);

    for (let i = 0; i < numOfShips; i++) {
        const x = randomNum(7, 0);
        const y = randomNum(11, 0);
        shipCoordinates.push(`ship${x}${y}`);
    }

    return shipCoordinates;
}

window.addEventListener("load", () => {
    checkElement = document.getElementById('chk-notifs');
    checkElement.addEventListener('click', (e) => {
        isNotif = e.target.checked;
    })
});

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

// Verificar se foi acertado um navio
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

// Verificar se foi acertado um navio
function getNumOfBonusHit(surroundingCells) {
    let bonusHit = 0;

    for (surroundingCell of surroundingCells) {
        for (bonusCoordinate of bonusCoordinates) {
            if (surroundingCell.id == bonusCoordinate) {
                bonusHit++;
            }
        }
    }

    return bonusHit;
}

// Mostrar células atacadas
function showAttackedTiles(surroundingCells) {
    for (surroundingCell of surroundingCells) {

        let shipFlag = false;
        let bombFlag = false;
        let atomicBombFlag = false
        
        // Checagem de navios
        for (shipCoordinate of shipCoordinates) {
            if (surroundingCell.id == shipCoordinate) {
                shipFlag = true;
                console.log(surroundingCell.id)
            }
        }
        
        // Checagem de bônus
        if (surroundingCell.id == bonusCoordinates[0]) {bomb++; bombFlag = true;}
        if (surroundingCell.id == bonusCoordinates[1]) {atomicBomb++; atomicBombFlag = true;}

        // Mudança de imagem
        if (shipFlag) showHitShip(surroundingCell);
        else if (bombFlag) showBomb(surroundingCell);
        else if (atomicBombFlag) showAtomicBomb(surroundingCell);
        else showOcean(surroundingCell);
    }

    return;
}

// Atualizar stats (score and lives)
function updateScore(numOfShipsHit) {
    numOfShips -= numOfShipsHit;
    
    score += numOfShipsHit;
    
    notifElement.innerHTML = `Ships left: ${numOfShips}`;
    scoreElement.innerHTML = `Score: ${score}`;
    
    return;
}

function updateLives() {
    lives--;
    livesElement.innerHTML = `Lives: ${lives}`;
    
    return;
}

// Mensagens de notificação
function notifyMiss() {
    notifElement.innerHTML = `You missed xD`;
    setTimeout(() => notifElement.innerHTML = `Ships left: ${numOfShips}`, 1000);
    
    return;
}

function notifyBonus() {
    notifElement.innerHTML = `You found a bonus!`;
    setTimeout(() => notifElement.innerHTML = `Ships left: ${numOfShips}`, 1000);
    
    return;
}

function notifyHit() {
    notifElement.innerHTML = `It's a Hit!`;
    setTimeout(() => notifElement.innerHTML = `Ships left: ${numOfShips}`, 1000);
    
    return;
}

// Mudar src da tile atacada
function showHitShip(tableCell) {
    tableCell.src = './assets/shipwreck.png';
}
  
function showOcean(tableCell) {
    tableCell.src = './assets/ocean.png';
}

function showBomb(tableCell) {
    tableCell.src = './assets/missile.jpeg';
}

function showAtomicBomb(tableCell) {
    tableCell.src = './assets/nuke.jpeg';
}