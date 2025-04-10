import { initGame, dragstartHandler } from "./eventHandlers";

const initDom = function () {
  const newPvPBtn = document.querySelector(".new-pvp-btn");
  const newPvCBtn = document.querySelector(".new-pvc-btn");
  newPvPBtn.addEventListener("click", () => initGame(true));
  newPvCBtn.addEventListener("click", () => initGame(false));

  const ships = document.querySelectorAll(".ship");
  ships.forEach((ship) => {
    ship.addEventListener("dragstart", dragstartHandler);

    ship.addEventListener("dragend", () => {
      ship.classList.remove("dragging");
    });
  });
};

export default initDom