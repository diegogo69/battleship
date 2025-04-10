import domHandler from "./domHandler";
import createBoard from "./createBoard";
import gameInstance from "./gameInstance";


const initGame = function initGame(pvp) {
  const game = gameInstance();
  game.init(pvp);
};

const isValidPlacement = function isValidPlacement(
  shipLength,
  orientation,
  shipHeadCoordinate,
  gameboard,
) {
  return gameboard.placeShip(
    shipHeadCoordinate,
    +shipLength,
    orientation === "horizontal",
  );
};

function dragstartHandler(e) {
  const ship = e.currentTarget;
  const gameboard = e.target.closest(".gameboard");

  e.dataTransfer.setData("ship-id", ship.id);
  e.dataTransfer.setData("length", ship.dataset.length);
  e.dataTransfer.setData("orientation", ship.dataset.orientation);
  //   e.dataTransfer.setData("boardNo", gameboard.dataset.boardNo);
  // e.dataTransfer.setData('draggedCellIndex', e.target.dataset.cellIndex); // Actual ship cell that fired drag event

  e.dataTransfer.setDragImage(e.currentTarget, 10, 10);

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

  const shipID = e.dataTransfer.getData("ship-id");
  const dropCoordinate = cell.dataset.rowcol;
  const shipLength = e.dataTransfer.getData("length");
  const orientation = e.dataTransfer.getData("orientation");
  //   const boardNo = e.dataTransfer.getData("boardNo");
  const boardNo = cell.closest(".gameboard").dataset.boardNo;

  console.log(`Dropped ship of length ${shipLength} at ${dropCoordinate}`);

  const validPlacement = isValidPlacement(
    shipLength,
    orientation,
    dropCoordinate,
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

  // cell.appendChild(document.getElementById(shipID));
};

const dragleaveHandler = function dragleaveHandler(e) {
  e.currentTarget.classList.remove("hovered");
};

// Display gameboards
const displayBoard = function displayBoard(playerNo, gameboard) {
  const board = createBoard(gameboard, playerNo);
  domHandler.render.board[playerNo](board);
};

const testPlaceShips = function (player) {
  player.gameboard.placeShip("00", 1, true);
  player.gameboard.placeShip("01", 2, true);
  player.gameboard.placeShip("10", 2, false);
};

export {
  initGame,
  displayBoard,
  dragstartHandler,
  dropHandler,
  dragoverHandler,
  dragleaveHandler,
  testPlaceShips,
};
