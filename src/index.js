import "./static/css/modern-normalize.css";
import "./static/css/styles.css";
import "./static/css/gameboard.css";

import gameInstance from "./static/js/gameInstance";

const initGame = function initGame(pvp) {
  const game = gameInstance();
  game.init(pvp);
};

const newPvPBtn = document.querySelector('.new-pvp-btn')
const newPvCBtn = document.querySelector('.new-pvc-btn')
newPvPBtn.addEventListener('click', () => initGame(true))
newPvCBtn.addEventListener('click', () => initGame(false))
