const COLUMNS = 7;
const ROWS = 6;
const EMPTY_POSITION = 0;
const GAME_STATUSES = {
    playing: 'playing',
    over: 'over'
};
const boardFaceDiv = document.getElementById("board-face");
const currentPlayerName = document.getElementById("current-player-name");
const currentPlayerColor = document.getElementById("player-color");
const winnerPlayerDiv = document.getElementById("winner-player");
const restartGameDiv = document.getElementById("restart");

let currentPlayer = 0;
let players = [];
let gameStatus = GAME_STATUSES.playing;

addPlayer();
addPlayer();
addPlayer();

let boardColumns = initializeGameBoard(COLUMNS, ROWS);
function onPlaceTokenClick(column) {
    const columnIndex = column - 1;
    addTokenToColumn(columnIndex, players[currentPlayer]);
}

const addTokenToColumn = (column, token) => {
    if (gameStatus === GAME_STATUSES.over) {
        return;
    }
    const index = boardColumns[column].findIndex(x => x === EMPTY_POSITION);
    boardColumns[column][index] = token;
    updateBoard();
    const isWinner = checkBoard();
    if (isWinner) {
        winnerPlayerDiv.innerText = players[currentPlayer] + " has won !!!";
        gameStatus = GAME_STATUSES.over;
        restartGameDiv.classList.remove("d-none");
    }
    changePlayer();
};

const updateBoard = () => {
    for (let i = 0; i < boardFaceDiv.children.length; i++) {
        const holeDiv = boardFaceDiv.children[i];
        const rowIndex = ROWS - 1 - Math.floor(i / COLUMNS);
        const columnIndex = (i % COLUMNS);
        const isEmpty = boardColumns[columnIndex][rowIndex] === EMPTY_POSITION;

        if (!isEmpty) {
            holeDiv.classList.remove("empty");
            holeDiv.classList.add(boardColumns[columnIndex][rowIndex]);
        } else {
            holeDiv.classList.remove(...holeDiv.classList);
            holeDiv.classList.add("empty");
            holeDiv.classList.add("hole");
        }
    };
};

const checkBoard = () => {
    const hasWonColumn = _hasColumnWinner(boardColumns);
    if (hasWonColumn) return true;
    const hasWonRow = _hasRowWinner(boardColumns);
    if (hasWonRow) return true;
    const hasWonMainDiagonal = _hasMainDiagonalWinner(boardColumns);
    if (hasWonMainDiagonal) return true;
    const hasWonSecondaryDiagonal = _hasSecondaryDiagonalWinner(boardColumns);
    if (hasWonSecondaryDiagonal) return true;
};

/**
 * 
 * @param {Array} column 
 * @returns 
 */
const _hasColumnWinner = (board) => {
    for (let i = 0; i < board.length; i++) {
        const column = board[i];
        const checkColumn = hasConsecutiveTokens(column);
        if (checkColumn) return true;
    }
    return false;
};

const hasConsecutiveTokens = (array, requiredConsecutivePlaces = 4) => {
    let candidateWinnerName = array[0];
    let consecutivePlaces = 0;
    for (let index = 0; index < array.length; index++) {
        const playerName = array[index];
        if (playerName === candidateWinnerName) {
            consecutivePlaces++;
            if (consecutivePlaces === requiredConsecutivePlaces && candidateWinnerName !== EMPTY_POSITION) return true;
        } else {
            candidateWinnerName = playerName;
            consecutivePlaces = 1;
        }
    }
    return false;
};

const _hasRowWinner = board => {
    for (let rowIndex = 0; rowIndex < ROWS; rowIndex++) {
        const row = board.map(column => column[rowIndex]);
        const checkRow = hasConsecutiveTokens(row);
        if (checkRow) return true;
    }
    return false;
};

const _hasMainDiagonalWinner = (board, requiredConsecutivePlaces = 4) => {
    const arrays = [];
    for (let columnIndex = 0; columnIndex < board.length; columnIndex++) {
        const column = board[columnIndex];
        for (let j = 0; j < column.length; j++) {
            if (arrays[columnIndex + j]) {
                arrays[columnIndex + j].push(column[j]);
            } else {
                arrays[columnIndex + j] = [column[j]];
            }
        }
    }
    for (let i = 0; i < arrays.length; i++) {
        const hasDiagonal = hasConsecutiveTokens(arrays[i]);
        if (hasDiagonal) {
            return true;
        }
    }
    return false;
};

const _hasSecondaryDiagonalWinner = (board, requiredConsecutivePlaces = 4) => {
    const paddings = Math.max(board.length, board[0].length) - 2;
    const arrays = [];
    for (let columnIndex = 0; columnIndex < board.length; columnIndex++) {
        const column = board[columnIndex];
        for (let j = 0; j < column.length; j++) {
            if (arrays[paddings + columnIndex - j]) {
                arrays[paddings + columnIndex - j].push(column[j]);
            } else {
                arrays[paddings + columnIndex - j] = [column[j]];
            }
        }
    }
    for (let i = 0; i < arrays.length; i++) {
        const hasDiagonal = hasConsecutiveTokens(arrays[i]);
        if (hasDiagonal) return true;
    }
    return false;
};
const changePlayer = () => {
    currentPlayerColor.classList.remove(players[currentPlayer]);
    currentPlayer++;
    if (currentPlayer >= players.length) {
        currentPlayer = 0;
    }
    currentPlayerName.innerText = players[currentPlayer];
    currentPlayerColor.classList.add(players[currentPlayer]);
};

function addPlayer() {
    players.push("player" + (players.length + 1));
}

function initializeGameBoard(numberOfColumns, numberOfRows) {
    return Array(numberOfColumns).fill(0).map(x => Array(numberOfRows).fill(EMPTY_POSITION));
}


const playAgain = () => {
    boardColumns = initializeGameBoard(COLUMNS, ROWS);
    updateBoard();
    currentPlayer = 0;
    changePlayer();
    restartGameDiv.classList.add("d-none");
    winnerPlayerDiv.innerText = "";
    gameStatus = GAME_STATUSES.playing;
};