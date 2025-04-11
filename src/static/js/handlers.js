import domHandler from "./domHandler";
import createShips from "./createShips";
import createBoard from "./createBoard";
import gameInstance from "./gameInstance";

const initGame = function initGame(pvp) {
  const game = gameInstance();
  createBoard.enableDragDrop;
  game.init(pvp);
};

const isValidPlacement = function isValidPlacement(
  shipHeadCoordinate,
  shipLength,
  orientation,
  gameboard,
) {
  return gameboard.placeShip(
    shipHeadCoordinate,
    parseInt(shipLength),
    orientation === "horizontal",
  );
};

function dragstartHandler(e) {
  const ship = e.currentTarget;

  e.dataTransfer.setData("ship-id", ship.id);
  e.dataTransfer.setData("length", ship.dataset.length);
  e.dataTransfer.setData("orientation", ship.dataset.orientation);

  e.dataTransfer.setDragImage(e.currentTarget, 15, 10); // 10, 10 -> drag image xOffset, yOffset

  ship.classList.add("dragging");

  console.log(`Dragging ship of length: ${ship.dataset.length}`);
  console.log(`Dragging ship of orientation: ${ship.dataset.orientation}`);
}

const dragoverHandler = function dragoverHandler(e) {
  e.preventDefault(); // Necessary to allow dropping
  e.currentTarget.classList.add("hovered");
  e.dataTransfer.dropEffect = "move";
};

const dropHandler = function dropHandler(e, gameboard) {
  e.preventDefault();
  const cell = e.currentTarget;

  const dropCoordinate = cell.dataset.rowcol;
  const shipLength = e.dataTransfer.getData("length");
  const orientation = e.dataTransfer.getData("orientation");
  const shipID = e.dataTransfer.getData("ship-id");
  const boardNo = cell.closest(".gameboard").dataset.boardNo;

  console.log(`Dropped ship of length ${shipLength} at ${dropCoordinate}`);

  const validPlacement = isValidPlacement(
    dropCoordinate,
    shipLength,
    orientation,
    gameboard,
  );

  // INVALID DROP
  if (!validPlacement) {
    console.log("Invalid drop: Ship placement rejected.");
    // Provide visual feedback
    cell.classList.add("invalid-drop");
    setTimeout(() => {
      cell.classList.remove("invalid-drop");
    }, 500); // Remove visual indicator after 0.5 seconds
    return; // Reject the drop and exit
  }

  // VALID DROP
  console.log(`Valid drop: Ship placed starting at ${dropCoordinate}.`);
  cell.classList.remove("hovered");
  displayBoard(boardNo, gameboard);

  const ship = document.getElementById(shipID)
  ship.parentNode.removeChild(ship)
};

const dragleaveHandler = function dragleaveHandler(e) {
  e.currentTarget.classList.remove("hovered");
};

// Display ships container
const displayShips = function displayShipContainer() {
  const ships = createShips();
  domHandler.render.ships(ships)
}

// Display gameboards
const displayBoard = function displayBoard(playerNo, gameboard) {
  const board = createBoard.boardNode(gameboard, playerNo);
  domHandler.render.board[playerNo](board);
};

// Intermediate functions to be used in gameInstance module
const enableDragDrop = function enableDragDrop() {
  createBoard.enableDragDrop();
};
const disableDragDrop = function disableDragDrop() {
  createBoard.disableDragDrop();
};

const testPlaceShips = function (player) {
  player.gameboard.placeShip("00", 1, true);
  player.gameboard.placeShip("01", 2, true);
  player.gameboard.placeShip("10", 2, false);
};

export {
  initGame,
  displayBoard,
  displayShips,
  enableDragDrop,
  disableDragDrop,
  dragstartHandler,
  dropHandler,
  dragoverHandler,
  dragleaveHandler,
  testPlaceShips,
};
