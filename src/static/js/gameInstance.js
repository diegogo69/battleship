import domHandler from "./domHandler";
import { displayBoard, enableDragDrop, displayShips, disableDragDrop, testPlaceShips } from "./handlers";
import { Player, AIPlayer } from "./Player";

const gameInstance = function gameInstance() {
  // Create players. One real, one computer. Populate each gameboard
  const players = {
    1: null,
    2: null,
  };
  let turn = 1;
  let winner = null;

  const createPlayers = function createPlayers(pvp) {
    if (pvp === true) return [new Player(3), new Player(3)];
    else return [new Player(3), new AIPlayer(3)()];
  };

  const init = function init(pvp) {
    // Create players
    [players[1], players[2]] = createPlayers(pvp);

    // Enable drag n drop functionality on ships and gameboard
    enableDragDrop();
    // Render gameboards
    displayBoard(1, players[1].gameboard);
    displayBoard(2, players[2].gameboard);

    // Setup for ship placement
    // Display available ships
    displayShips()
    // When ship is placed
    // If all ships are placed
    // Disable drag n drop functionality
    

    
    // At all ship placed
    // Start game instance
    // Enable attack functionaly

    // testPlaceShips(players[1]);
    // testPlaceShips(players[2]);


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
