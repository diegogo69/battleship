import handlers from "./handlers";

const SHIPS_NO = 3;
const createShips = function (
  dragstartFn = handlers.dragstart,
  dragendFn = handlers.dragend,
) {
  const shipContainer = document.createElement("div");
  shipContainer.classList.add("ships-container");

  for (let i = 0; i < SHIPS_NO; i++) {
    const shipLength = i + 1;

    const ship = document.createElement("div");
    ship.setAttribute("id", shipLength);
    ship.classList.add("ship");
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
    shipContainer.appendChild(ship);
  }

  return shipContainer;
};

export default createShips;
