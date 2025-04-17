import handlers from "./handlers";
import { Player, AIPlayer } from "./Player";
import createBoard from "./createBoard";

const gameInstance = function gameInstance() {
  // Create players. One real, one computer. Populate each gameboard
  const players = {
    1: null,
    2: null,
  };
  let turn = 1;
  let winner = null;
  let pvpGamemode = null;

  const createPlayers = function createPlayers(pvp) {
    if (pvp === true) return [new Player(3), new Player(3)];
    return [new Player(3), new AIPlayer(3)];
  };

  // Create players and reference game instance for creating gameboard elements
  // Setup ship placement by enabling drag and drop handlers for ships and gameboards
  // Display available ships
  // Render gameboards
  const init = function initGame(pvp) {
    [players[1], players[2]] = createPlayers(pvp);
    
    createBoard.initGameboard(turn, pvpGamemode, handleTurn, players[1], players[2]);
    createBoard.enableDragDrop(
      handlers.dragover,
      handlers.drop,
      handlers.dragleave,
    );

    handlers.displayBoards();
    handlers.displayShips(createBoard.doneFn);
  }

  const endGame = function endGame() {
    winner = turn;
    alert("winner is player" + turn);
    createBoard.disableTurnHandler()
  };

  const getRivalTurn = function getRivalTurn() {
    return turn === 1 ? 2 : 1;
  };

  const changeTurn = function changeTurn() {
    turn = getRivalTurn();
  };

  const playTurn = function playTurn(rival, rowcol) {
    return players[rival].gameboard.receiveAttack(rowcol);
  };

  const handleTurn = function handleTurn(e) {
    if (winner) return;

    const rowcol = e.target.dataset.rowcol;
    if (!rowcol) return;

    if (e.target.closest(".gameboard").dataset.boardNo == turn) {
      console.log("Ignored. Player click on its own board");
      return;
    }
    console.log('Turn on game Instance ' + turn)

    const rival = getRivalTurn();
    let hit = playTurn(rival, rowcol);

    // If attacking the same spot twice
    if (hit === null) return null;

    // handlers.displayBoard(rival);
    // If ship is hit. Do not change turn
    if (hit === true) {
      let gameover = players[rival].gameboard.areSunk();
      if (gameover === true) {
        endGame();
        return 
      }

      return true
    };

    // Computer turn handler
    if (players[rival].type === "computer") {
      const AIrowcol = players[rival].generateRandomMove();
      const AIrival = turn;
      hit = playTurn(AIrival, AIrowcol);
      // handlers.displayBoard(AIrival);

      let gameover = players[AIrival].gameboard.areSunk();
      if (gameover === true) endGame();
    }
    
    changeTurn();
    return false
  };

  return { init, handleTurn };
};

export default gameInstance;
