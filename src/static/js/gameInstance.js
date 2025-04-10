import domHandler from "./domHandler";
import { displayBoard, testPlaceShips } from "./eventHandlers";
import { Player, AIPlayer } from "./Player";

const gameInstance = function gameInstance() {
  // Create players. One real, one computer. Populate each gameboard
  const players = {
    1: null,
    2: null,
  };
  let turn = 1;
  let winner = null;

  const init = function init(pvp) {
    players[1] = new Player(3);
    if (pvp === true) players[2] = new Player(3);
    else players[2] = new AIPlayer(3);

    // testPlaceShips(players[1]);
    // testPlaceShips(players[2]);

    const player = displayBoard(1, players[1].gameboard);
    displayBoard(2, players[2].gameboard);

    domHandler.initHandlers("click", handleTurn);
  };

  const endGame = function endGame() {
    winner = turn;
    alert("winner is player" + turn);
  };

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
    if (winner) return;

    const rowcol = e.target.dataset.rowcol;
    if (!rowcol) return;

    if (e.currentTarget.firstChild.dataset.boardNo == turn) {
      console.log("Ignored. Player click on its own board");
      return;
    }

    const rival = getRivalTurn();
    let attack = playTurn(rival, rowcol);
    // If attacking the same spot twice
    if (attack === null) return;
    displayBoard(rival);

    let gameover = players[rival].gameboard.areSunk();
    if (gameover === true) endGame();
    else if (players[rival].type === "computer") {
      const AIrowcol = players[rival].generateRandomMove();
      const AIrival = turn;
      attack = playTurn(AIrival, AIrowcol);
      displayBoard(AIrival);

      let gameover = players[AIrival].gameboard.areSunk();
      if (gameover === true) endGame();
    } else changeTurn();
  };

  return { init };
};

export default gameInstance;
