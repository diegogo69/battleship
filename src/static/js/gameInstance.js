import { Player, AIPlayer } from "./Player";

const gameInstance = function gameInstance() {
  // Create players. One real, one computer. Populate each gameboard
  const players = {
    1: null,
    2: null,
  };
  let turn = 1;
  let winner = null;
  let pvpGamemode = null;

  const createPlayers = function createPlayers() {
    if (pvpGamemode === true) return [new Player(3), new Player(3)];
    const computer = new AIPlayer(3);
    computer.gameboard.randomShips();
    return [new Player(3), computer];
  };

  // Create players and reference game instance for creating gameboard elements
  // Setup ship placement by enabling drag and drop handlers for ships and gameboards
  // Display available ships
  // Render gameboards
  const init = function initGame(pvp) {
    pvpGamemode = pvp;
    [players[1], players[2]] = createPlayers();
  };

  const isPvPGamemode = function isPvPGamemode() {
    return pvpGamemode
  }
  const getRivalTurn = function getRivalTurn() {
    return turn === 1 ? 2 : 1;
  };

  const changeTurn = function changeTurn() {
    turn = getRivalTurn();
  };

  const getTurn = function getTurn() {
    return turn;
  };

  const checkWinner = function checkWinner() {
    return winner;
  };

  const playPlayerTurn = function playPlayerTurn(rowcol) {
    const rival = getRivalTurn();
    return players[rival].gameboard.receiveAttack(rowcol);
  };

  const playAITurn = function playAITurn() {
    const AIplayer = getRivalTurn();
    const AIrival = turn;

    const AIrowcol = players[AIplayer].generateRandomMove();
    return players[AIrival].gameboard.receiveAttack(AIrowcol);
  };

  const handleTurn = function handleTurn(e) {
    if (winner) return;

    const rowcol = e.target.dataset.rowcol;
    if (!rowcol) return;

    if (e.target.closest(".gameboard").dataset.boardNo == turn) {
      console.log("Ignored. Player click on its own board");
      return;
    }

    console.log("Turn on game Instance " + turn);

    const rival = getRivalTurn();
    let hit = playPlayerTurn(rowcol);

    // If attacking the same spot twice
    if (hit === null) return null;

    // If ship is hit. Do not change turn
    if (hit === true) {
      let gameover = players[rival].gameboard.areSunk();
      if (gameover === true) {
        winner = turn;
      }
      return true;
    }

    if (pvpGamemode === true) {
      changeTurn();
    } else {
      const AIPlayer = rival;
      const AIrival = turn;
      hit = playAITurn();

      let gameover = players[AIrival].gameboard.areSunk();
      if (gameover === true) winner = AIPlayer;
    }

    return false;
  };

  return {
    init,
    handleTurn,
    changeTurn,
    players,
    getTurn,
    checkWinner,
    isPvPGamemode,
    getRivalTurn,
  };
};

export default gameInstance;
