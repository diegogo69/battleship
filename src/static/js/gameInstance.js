import domHandler from "./domHandler";
import createBoard from "./createBoard";
import Player from "./Player";

const testPlaceShips = function (player) {
  player.gameboard.placeShip("00", 1, true);
  player.gameboard.placeShip("01", 2, true);
  player.gameboard.placeShip("10", 2, false);
};

const gameInstance = function gameInstance() {
  // Create players. One real, one computer. Populate each gameboard
  const players = {
    1: null,
    2: null,
  }
  let turn = 1;
  let winner = null;


  // Display gameboards
  const displayBoard = function displayBoard(playerNo) {
    const player = players[playerNo];
    const board = createBoard(player.gameboard, playerNo);
    domHandler.render.board[playerNo](board);
  };

  const init = function init(callback) {
    players[1] = new Player(true, 3),
    players[2] = new Player(false, 3),

    testPlaceShips(players[1]);
    testPlaceShips(players[2]);

    displayBoard(1);
    displayBoard(2);

    domHandler.initHandlers('click', handleTurn)
  }

  const endGame = function endGame() {
    winner = turn
    alert('winner is player' + turn)
  }

  const getRivalTurn = function () {
    return turn === 1 ? 2 : 1;
  };

  const changeTurn = function () {
    turn = getRivalTurn();
  };

  const playTurn = function playTurn(rival, rowcol) {
    return players[rival].gameboard.receiveAttack(rowcol);
  };

  const handleTurn = function handleTurn(e) {
    if (winner) return

    const rowcol = e.target.dataset.rowcol;
    if (!rowcol) return;

    if (e.currentTarget.firstChild.dataset.boardNo == turn) {
      console.log("Ignored. Player click on its own board");
      return;
    }

    const rival = getRivalTurn();
    let attack = playTurn(rival, rowcol);
    // If attacking the same spot twice
    if (attack === null) return
    displayBoard(rival);

    let gameover = players[rival].gameboard.areSunk()
    if (gameover === true) endGame();

    else if (players[rival].type === 'computer') {
      const AIrowcol = players[rival].generateRandomMove();
      const AIrival = turn;
      attack = playTurn(AIrival, AIrowcol)
      displayBoard(AIrival);

      let gameover = players[AIrival].gameboard.areSunk()
      if (gameover === true) endGame();
    }

    else changeTurn();
  };

  return { init, }
}


export default gameInstance;
