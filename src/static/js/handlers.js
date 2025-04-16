import domHandler from "./domHandler";
import createShips from "./createShips";
import createBoard from "./createBoard";
import gameInstance from "./gameInstance";
import Gameboard from "./Gameboard";

const handlers = (function () {
  const initGame = function initGame(pvp) {
    const game = gameInstance();
    game.init(pvp);
  };

  const isValidPlacement = function isValidPlacement(
    rowcol,
    length,
    horizontal,
    gameboard,
    boardNode,
    shipID,
  ) {

    const {row, col} = Gameboard.validateCoordinates(rowcol)

    // Ship element overlaps other ship elements
    for (let next = 1; next < length; next++) {
      let nextCell = null;
      if (horizontal) {
        nextCell = boardNode.children[row].children[col + next];
      } else {
        nextCell = boardNode.children[row + next].children[col];
      }
      
      if ((nextCell.firstChild) && (nextCell.firstChild.classList.contains("ship"))) {
        if (nextCell.firstChild.id === shipID) {
          console.log('Ship overlaps itself. So it is a realocation') 
        } else {
          console.log('Ship element overlaps another ship element')
          return false
        }
      }
    }

    return gameboard.canBePlaced(row, col, length, horizontal)
  };

  const dragstart = function dragstartHandler(e) {
    const ship = e.currentTarget;
    
    e.dataTransfer.setData("ship-id", ship.id);
    e.dataTransfer.setData("ship-class", ship.classList.contains("ship"));
    e.dataTransfer.setData("length", ship.dataset.length);
    e.dataTransfer.setData("orientation", ship.dataset.orientation);

    // random test to create and arbitrary el render img
    // const img = document.createElement('div');
    // img.classList.add('ship');
    // [1,2,3].forEach(el => {
    //   const cel = document.createElement('div')
    //   cel.classList.add('ship-cell')
    //   img.appendChild(cel)
    // });
    // e.dataTransfer.setDragImage(img, 10, 10); // 10, 10 -> drag image xOffset, yOffset
    
    e.dataTransfer.setDragImage(e.currentTarget, 10, 10); // 10, 10 -> drag image xOffset, yOffset

    ship.classList.add("dragging");

    console.log(`Dragging ship of length: ${ship.dataset.length}`);
    console.log(`Dragging ship of orientation: ${ship.dataset.orientation}`);
  };

  const dragend = function dragendHandler(e) {
    const ship = e.currentTarget;
    ship.classList.remove("dragging");
  }

  const dragover = function dragoverHandler(e) {
    e.preventDefault(); // Necessary to allow dropping

    const shipClass = e.dataTransfer.getData("ship-class");
    if (shipClass !== "true") return;

    e.currentTarget.classList.add("hovered");
    e.dataTransfer.dropEffect = "move";
  };


  const drop = function dropHandler(e, gameboard) {
    e.preventDefault();
    // Dragged element is not ship
    const shipClass = e.dataTransfer.getData("ship-class");
    if (shipClass !== "true") return;

    // Ship dropped in a non valid gameboard grid cell
    if (!(e.target.classList.contains('gameboard-col'))) return;

    const cell = e.currentTarget;
    const shipID = e.dataTransfer.getData("ship-id");
    const dropCoordinate = cell.dataset.rowcol;
    const shipLength = parseInt(e.dataTransfer.getData("length"));
    const orientation = e.dataTransfer.getData("orientation") === 'horizontal';
    const boardNode = cell.closest(".gameboard");
    const boardNo = boardNode.dataset.boardNo;

    const validPlacement = isValidPlacement(
      dropCoordinate,
      shipLength,
      orientation,
      gameboard,
      boardNode,
      shipID,
    );

    // INVALID DROP
    if (validPlacement == false) {
      console.log("Invalid drop: Ship placement rejected.");
      // Provide visual feedback
      cell.classList.add("invalid-drop");
      setTimeout(() => {
        cell.classList.remove("invalid-drop");
      }, 500); // Remove visual indicator after 0.5 seconds
      return; // Reject the drop and exit
    }

    // VALID DROP
    console.log(`Valid drop ship of length ${shipLength} at ${dropCoordinate}`);
    cell.classList.remove("hovered");
    
    const ship = document.getElementById(shipID);
    // ship.parentNode.removeChild(ship);
    ship.classList.add('positioned')
    ship.classList.remove("dragging");
    cell.appendChild(ship)

    // If all ships have been placed
    if (validPlacement === null) {
      // Remove ships container

      createBoard.disableDragDrop();
      createBoard.enableTurnHandler();
    }
    // displayBoard(boardNo, gameboard);
    // displayBoards();
  };

  const dragleave = function dragleaveHandler(e) {
    e.currentTarget.classList.remove("hovered");
  };

  // Display ships container
  const displayShips = function displayShipContainer(doneFn) {
    const ships = createShips();
    const doneBtn = document.createElement('button')
    doneBtn.textContent = 'Done'
    doneBtn.classList.add('done-btn')
    doneBtn.addEventListener('click', (e) => {
      doneFn(e);
      displayBoards();
    })
    domHandler.render.ships(ships, doneBtn);
  };

  // Display gameboards
  const displayBoard = function displayBoard(playerNo) {
    const board = createBoard.boardNode(playerNo);
    domHandler.render.board[playerNo](board);
  };

  const displayBoards = function displayBoards() {
    displayBoard(1)
    displayBoard(2)
  };

  const testPlaceShips = function (player) {
    player.gameboard.placeShip("00", 1, true);
    player.gameboard.placeShip("01", 2, true);
    player.gameboard.placeShip("10", 2, false);
  };

  return {
    initGame,
    displayBoard,
    displayBoards,
    displayShips,
    dragstart,
    dragend,
    drop,
    dragover,
    dragleave,
    testPlaceShips,
  };
})();

export default handlers;
