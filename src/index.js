import "./static/css/modern-normalize.css";
import "./static/css/styles.css";
import "./static/css/gameboard.css";

import gameInstance from "./static/js/gameInstance";


const initGame = function initGame() {

  const game = gameInstance();

  const playTurn = function playTurn(e) {
    game.handleTurn(e);
    if (game.getWinner() !== null) {
      alert(`Hello winner ${game.getWinner()}`);
    }
  }

  game.init(playTurn);

  // check winner if winner game = null
  // Display new game

};

initGame();