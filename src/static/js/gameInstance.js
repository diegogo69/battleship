import { Player, AIPlayer } from "./Player";

const gameInstance = function gameInstance() {
  // Create players. One real, one computer. Populate each gameboard
  const players = {
    1: null,
    2: null,
  };
  const SHIPS_NO = 5;
  const aiLevels = ['easy', 'normal', 'hard'];
  let turn = 1;
  let winner = null;
  let pvpGamemode = null;
  let aiLevel = aiLevels[0];

  const getAiLevels = function getDifficulty() {
    return aiLevels;
  }

  const getAiLevel = function getAiLevel() {
    return aiLevel;
  }

  const setAiLevel = function setAiLevel(lvl) {
    aiLevel = lvl;
    console.log('ai level: ' + aiLevel)
  }

  const createPlayers = function createPlayers() {
    if (pvpGamemode === true) return [new Player(SHIPS_NO), new Player(SHIPS_NO)];
    const computer = new AIPlayer(SHIPS_NO);
    computer.gameboard.randomShips();
    console.log(computer.gameboard.shipsBoard)
    return [new Player(SHIPS_NO), computer];
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
    return pvpGamemode;
  };
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
    const AIplayer = 2; //getRivalTurn();
    const AIrival = 1;

    let rowcol = players[AIplayer].generateRandomMove(aiLevel);
    let isHit = players[AIrival].gameboard.receiveAttack(rowcol);
    players[AIplayer].setLastHit({ isHit, rowcol });
    players[AIplayer].addLastShots(rowcol)
    let i = 1;
    while (isHit) {
      // turn = AIplayer;
      const gameover = players[AIrival].gameboard.areSunk();
      if (gameover === true) {
        winner = AIplayer;
        console.log('AI WINS. shot at: ' + rowcol)
        break;
      }
      
      rowcol = players[AIplayer].generateRandomMove(aiLevel);
      isHit = players[AIrival].gameboard.receiveAttack(rowcol);
      players[AIplayer].setLastHit({ isHit, rowcol });
      players[AIplayer].addLastShots(rowcol)
      i++;
    }

    console.log('AI CONSECUTIVE TURNS: ' + i)
    return isHit;
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
    console.log("PLayer hit at: " + rowcol);


    // If ship is hit. Do not change turn
    if (hit) {
      let gameover = players[rival].gameboard.areSunk();
      if (gameover === true) {
        winner = turn;
      }
      return true;
    }

    if (pvpGamemode === true) {
      changeTurn();
    } else {
      const AIplayer = rival;
      const AIrival = turn;
      hit = playAITurn();
      return hit;
    }
    // changeTurn(); // both ai
    return false;
  };

  return {
    init,
    handleTurn,
    changeTurn,
    players,
    playAITurn,
    getTurn,
    checkWinner,
    isPvPGamemode,
    getRivalTurn,
    getAiLevels,
    getAiLevel,
    setAiLevel,
  };
};

export default gameInstance;
