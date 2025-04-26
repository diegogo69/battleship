import handlers from "./handlers";

const createShips = function (
  shipsArr,
  dragstartFn = handlers.dragstart,
  dragendFn = handlers.dragend,
  rotateFn = handlers.rotateShip,
) {
  const shipContainer = document.createElement("div");
  shipContainer.classList.add("ships-container");

  // name, length, horizontal, 
  shipsArr.forEach((ship, shipIndex) => {
    const shipNode = document.createElement("div");
    shipNode.id = shipIndex;
    shipNode.classList.add("ship");
    shipNode.classList.add('flex-row');
    shipNode.setAttribute("draggable", true);
    shipNode.dataset.length = ship.length;
    shipNode.dataset.orientation = "horizontal";
    const shipName = ship.name[0].toUpperCase() + ship.name.slice(1) 
    shipNode.setAttribute('title', shipName)

    for (let i = 0; i < ship.length; i++) {
      const shipCell = document.createElement("div");
      shipCell.classList.add("ship-cell");
      shipNode.appendChild(shipCell);
    }

    shipNode.addEventListener("dragstart", dragstartFn);
    shipNode.addEventListener("dragend", dragendFn);
    shipNode.addEventListener('dblclick', rotateFn)

    shipContainer.appendChild(shipNode);
  });

  return shipContainer;
};

export default createShips;
