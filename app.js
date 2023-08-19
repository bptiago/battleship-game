// Gerar coordenadas aleatórias
function randomNum(max, min) {
    return Math.round(Math.random() * (max - min) + min);
}

// Será posta 6 navios no jogo
function generateTargetCoords() {
    let shipCoordinates = [];

    const numOfShips = randomNum(3, 5);

    for (let i = 0; i < numOfShips; i++) {
        const x = randomNum(4, 0);
        const y = randomNum(7, 0);
        shipCoordinates.push(`ship${x}${y}`);
    }

    return shipCoordinates;
}

// Função listener de cada célula da table
function handleClick(i, j) {

    // Quando acaba as vidas
    if (lives == 0) {
        alert("No lives left! Press the Reset button.")

        notifElement.className = "end-msg";
        notifElement.innerHTML = `No more lives. You missed ${numOfShips} ships.`;

        return;
    };
    
    // Quanda ganha
    if (numOfShips == 0) {
        alert("You won! Reset to play more.")

        notifElement.innerHTML = `You won!`;

        return;
    }

    const td = document.getElementById(`ship${i}${j}`);
    const tdId = td.id;
    console.log(`Cell hit: ${tdId}`)

    // Flag de hit
    let hitFlag = false;

    for (let item of shipCoordinates) {
        if (tdId == item) hitFlag = true;
    }

    return hitFlag ? handleHit(td) : handleMiss(td);
}

function handleHit(tableCell) {
	tableCell.src = "./assets/shipwreck.png";
    // Aumentar score e restaurar uma vida
	score++;
    lives++;

    // Diminur número de navios
    numOfShips--;

    // Atualizar HTML interno
    notifElement.innerHTML = `You gained a life!`;
    setTimeout(() => notifElement.innerHTML = `Ships left: ${numOfShips}`, 1000);
    scoreElement.innerHTML = `Score: ${score}`;
    livesElement.innerHTML = `Lives: ${lives}`;

	return;
}

function handleMiss(tableCell) {
	tableCell.src = "./assets/ocean.png";
    
    // Diminuir vida
    lives--;

    // Atualizar HTML
    livesElement.innerHTML = `Lives: ${lives}`;

	return;
}


const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const notifElement = document.getElementById('alert');

const shipCoordinates = generateTargetCoords();

let score = 0;
let lives = 15;
let numOfShips = shipCoordinates.length;

notifElement.innerHTML = `Ships left: ${numOfShips}`;
