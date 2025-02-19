import domHandler from "./domHandler";
import createBoard from "./createBoard";
import Player from "./Player";

const testPlaceShips = function (player) {
  player.gameboard.placeShip("00", 1, true);
  player.gameboard.placeShip("01", 2, true);
  player.gameboard.placeShip("10", 2, false);
};

// Game instance module (Factory)
const gameInstance = function gameInstance() {
  // Create Player1
  // Create Player2
  const players = {
    player1: null,
    player2: null,
  };

  let callback = null;

  const init = function init(fn) {
    callback = fn;

    players.player1 = new Player(true, 3);
    players.player2 = new Player(false, 3);
    // Populate each player's gameboard with predetermined coordinates
    // Place three ships. Of len 1, 2, 2. For each
    testPlaceShips(players.player1);
    testPlaceShips(players.player2);

    displayBoard(1);
    displayBoard(2);
  };
  let winner = null;
  const getWinner = function getWinner() {
    return winner
  }
  // For testing place default ships for both players

  let turn = 1;

  const getRivalTurn = function () {
    return turn === 1 ? 2 : 1;
  };

  const changeTurn = function () {
    turn = getRivalTurn();
  };

  const displayBoard = function displayBoard(playerNo) {
    const player = `player${playerNo}`;
    const board = createBoard(players[player].gameboard, playerNo, callback);
    domHandler.render.board[player](board);
  };
  const updateBoard = function updateBoard(playerNo) {
    const player = `player${playerNo}`;

    domHandler.clear[player]();
    const board = createBoard(players[player].gameboard, playerNo, callback);
    domHandler.render.board[player](board);
  };

  const playTurn = function playTurn(rival, rowcol) {
    return players[`player${rival}`].gameboard.receiveAttack(rowcol);
  };

  const handleTurn = function handleTurn(e) {
    const rowcol = e.target.dataset.rowcol;
    if (!rowcol) return;

    if (e.currentTarget.dataset.boardNo == turn) {
      console.log("Ignored. Player click on its own board");
      return;
    }

    const rival = getRivalTurn();

    const gameover = playTurn(rival, rowcol);
    updateBoard(rival);

    if (gameover === true) endGame();
    else changeTurn();
  };

  const endGame = function endGame() {
    winner = turn;

    domHandler.removeEventListener.player1('click', callback)
    domHandler.removeEventListener.player2('click', callback)
    // Determine winner based on current turn

    // Remove board event listeners
    // Show winner msg
    // Show new game button
  };

  return { init, getWinner, handleTurn };
};

export default gameInstance;
