import "./static/css/modern-normalize.css";
import "./static/css/styles.css";
import "./static/css/gameboard.css";

import gameInstance from "./static/js/gameInstance";

const initGame = function initGame() {
  const game = gameInstance();
  game.init();
};

const newGameBtn = document.querySelector('.new-game-btn')
newGameBtn.addEventListener('click', initGame)

initGame();