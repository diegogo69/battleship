import handlers from "./handlers";
import Gameboard from "./Gameboard";

const SHIPS_NO = Gameboard.SHIPS_NO;
const createShips = function (
  dragstartFn = handlers.dragstart,
  dragendFn = handlers.dragend,
  rotateFn = handlers.rotateShip,
) {
  const shipContainer = document.createElement("div");
  shipContainer.classList.add("ships-container");

  for (let i = 0; i < SHIPS_NO; i++) {
    const shipLength = i + 1;

    const ship = document.createElement("div");
    ship.id = shipLength;
    ship.classList.add("ship");
    ship.classList.add('flex-row');
    ship.setAttribute("draggable", true);
    ship.dataset.length = shipLength;
    ship.dataset.orientation = "horizontal";

    for (let j = 0; j < shipLength; j++) {
      const shipCell = document.createElement("div");
      shipCell.classList.add("ship-cell");
      ship.appendChild(shipCell);
    }

    ship.addEventListener("dragstart", dragstartFn);
    ship.addEventListener("dragend", dragendFn);
    ship.addEventListener('dblclick', rotateFn)
    shipContainer.appendChild(ship);
  }

  return shipContainer;
};

export default createShips;
