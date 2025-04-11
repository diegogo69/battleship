import { dropHandler, dragoverHandler, dragleaveHandler } from "./handlers";
// Function to create a board node, of the same structure as a board array
// A board node, with row nodes, each with col nodes
// board argument is expected to be a Gameboard object wich contains
// a shipsBoard array with the board ships
// a shotsBoard array with the received attacks
// The board dipslays a player ships, and the received shots

const createBoard = (function () {
  let dropFn = null;
  let dragoverFn = null;
  let dragleaveFn = null;

  const enableDragDrop = function enableDragDrop() {
    dropFn = dropHandler;
    dragoverFn = dragoverHandler;
    dragleaveFn = dragleaveHandler;
  };

  const disableDragDrop = function disableDragDrop() {
    dropFn = null;
    dragoverFn = null;
    dragleaveFn = null;
  };

  const boardNode = function boardNode(gameboard, boardNo) {
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

    // boardNode.addEventListener('click', clickFn);
    return boardNode;
  };

  return {
    boardNode,
    enableDragDrop,
    disableDragDrop,
  };
})();

export default createBoard;
