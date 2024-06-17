// script.js
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winning-message');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById('restartButton');
const xAttemptsElement = document.getElementById('xAttempts');
const oAttemptsElement = document.getElementById('oAttempts');

const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let oTurn;
let xAttempts;
let oAttempts;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    oTurn = false;
    xAttempts = 3;
    oAttempts = 3;
    updateAttemptsDisplay();
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.textContent = ''; // Clear the cell content
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick);
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('active');
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    const opponentClass = oTurn ? X_CLASS : O_CLASS;

    // Check if the cell is already taken
    if (cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)) {
        if (currentClass === X_CLASS) {
            xAttempts--;
            updateAttemptsDisplay();
            if (xAttempts <= 0) {
                alert("X attempted too many times on taken cells. O wins!");
                showBoard();
                endGame(false);
                return;
            }
        } else {
            oAttempts--;
            updateAttemptsDisplay();
            if (oAttempts <= 0) {
                alert("O attempted too many times on taken cells. X wins!");
                showBoard();
                endGame(false);
                return;
            }
        }
        alert("Cell already taken! Choose another cell.");
        return;
    }

    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        showBoard();
        endGame(false);
    } else if (isDraw()) {
        showBoard();
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
    } else {
        winningMessageTextElement.innerText = `${oTurn ? "X's" : "O's"} Wins!`;
    }
    winningMessageElement.classList.add('active');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    // Do not set the textContent to keep the board "blind"
}

function swapTurns() {
    oTurn = !oTurn;
    xAttempts = 3; // Reset attempts for new turn
    oAttempts = 3; // Reset attempts for new turn
    updateAttemptsDisplay();
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function showBoard() {
    cellElements.forEach(cell => {
        if (cell.classList.contains(X_CLASS)) {
            cell.textContent = 'X';
        } else if (cell.classList.contains(O_CLASS)) {
            cell.textContent = 'O';
        }
    });
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function updateAttemptsDisplay() {
    xAttemptsElement.textContent = xAttempts;
    oAttemptsElement.textContent = oAttempts;
}
