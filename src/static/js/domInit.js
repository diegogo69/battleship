import handlers from "./handlers";

const initDom = function () {
  const newPvPBtn = document.querySelector(".new-pvp-btn");
  const newPvCBtn = document.querySelector(".new-pvc-btn");
  newPvPBtn.addEventListener("click", () => handlers.initGame(true));
  newPvCBtn.addEventListener("click", () => handlers.initGame(false));
};

export default initDom