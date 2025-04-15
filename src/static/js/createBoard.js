// Function to create a board node, of the same structure as a board array
// A board node, with row nodes, each with col nodes
// board argument is expected to be a Gameboard object wich contains
// a shipsBoard array with the board ships
// a shotsBoard array with the received attacks
// The board dipslays a player ships, and the received shots

import shipsFromBoard from "./shipsFromBoard";

const createBoard = (function () {
  let clickFn = null;
  let dragoverFn = null;
  let dropFn = null;
  let dragleaveFn = null;
  let turnFn = null;

  const players = {
    1: null,
    2: null,
  };

  const doneFn = function() {
    console.log('Done fn')
    const boardNode = document.querySelector('.gameboard')
    console.log(boardNode)

    const boardNo = boardNode.dataset.boardNo;
    // players[boardNo].gameboard
    const ships = shipsFromBoard(boardNode)
    console.log(ships)

    ships.forEach(ship => {
      players[boardNo].gameboard.placeShip(ship.rowcol, ship.length, ship.orientation)
      console.log(ship)
    });

  };

  
  // Reference game instance
  const initGameboard = function init(turnHandler, player1, player2) {
    turnFn = turnHandler;
    [players[1], players[2]] = [player1, player2]
    console.log(players)
  }

  const enableTurnHandler = function enableTurnHandler() {
    clickFn = turnFn;
    console.log("Click attack handler enabled");
  };

  const disableTurnHandler = function disableTurnHandler() {
    clickFn = null;
  };

  const enableDragDrop = function enableDragDrop(dragover, drop, dragleave) {
    dragoverFn = dragover;
    dropFn = drop;
    dragleaveFn = dragleave;
  };

  const disableDragDrop = function disableDragDrop() {
    dropFn = null;
    dragoverFn = null;
    dragleaveFn = null;
  };

  const boardNode = function boardNode(boardNo, board=null) {
    let gameboard;
    if (board == null) gameboard = players[boardNo].gameboard
    else gameboard = board
    const boardNode = document.createElement("div");
    boardNode.classList.add("gameboard");
    boardNode.dataset.boardNo = boardNo;

    const shipsBoard = gameboard.shipsBoard;
    const shotsBoard = gameboard.shotsBoard;

    shipsBoard.forEach(function iterateRows(row, rowIndex) {
      const rowNode = document.createElement("div");
      rowNode.classList.add("gameboard-row");

      shipsBoard[rowIndex].forEach(function iterateCols(col, colIndex) {
        const colNode = document.createElement("div");
        colNode.classList.add("gameboard-col");
        colNode.dataset.rowcol = `${rowIndex}${colIndex}`;

        // Each node may contain classes that identify if:
        // contains a ship, have been shot (miss or hit)
        const shipIndex = shipsBoard[rowIndex][colIndex];
        if (shipIndex !== null) {
          colNode.dataset.shipIndex = shipIndex;
          colNode.classList.add("hasShip");
          colNode.textContent = shipIndex;
        }

        if (shotsBoard[rowIndex][colIndex] === false) {
          colNode.classList.add("isMiss");
        }

        if (shotsBoard[rowIndex][colIndex] === true) {
          colNode.classList.add("isHit");
        }

        // Add drag and drop handlers if enabled
        if (dropFn) {
          colNode.addEventListener("drop", (e) => {
            dropFn(e, gameboard);
          });
        }
        if (dragoverFn) colNode.addEventListener("dragover", dragoverFn);
        if (dragleaveFn) colNode.addEventListener("dragleave", dragleaveFn);

        rowNode.appendChild(colNode);
      });

      boardNode.appendChild(rowNode);
    });

    if (clickFn) boardNode.addEventListener("click", clickFn);
    return boardNode;
  };

  return {
    boardNode,
    doneFn,
    initGameboard,
    enableTurnHandler,
    disableTurnHandler,
    enableDragDrop,
    disableDragDrop,
  };
})();

export default createBoard;
