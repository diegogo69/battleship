import { initGame } from "./handlers";

const initDom = function () {
  const newPvPBtn = document.querySelector(".new-pvp-btn");
  const newPvCBtn = document.querySelector(".new-pvc-btn");
  newPvPBtn.addEventListener("click", () => initGame(true));
  newPvCBtn.addEventListener("click", () => initGame(false));
};

export default initDom