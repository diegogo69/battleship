// Function to create a board node, of the same structure as a board array
// A board node, with row nodes, each with col nodes
// board argument is expected to be a Gameboard object wich contains
// a shipsBoard array with the board ships
// a shotsBoard array with the received attacks
// The board dipslays a player ships, and the received shots

import handlers from "./handlers";
import shipsFromBoard from "./shipsFromBoard";

const GameboardNode = (function () {
  let clickFn = null;
  let dragoverFn = null;
  let dropFn = null;
  let dragleaveFn = null;
  let turnFn = null;

  let gameInstance = null;
  let shipsPlaced = null;

  const doneFn = function (e) {
    if (shipsPlaced !== false) return;
    // If there are still ship element to allocate
    const shipsWrapper = e.currentTarget.closest('.place-ships-wrapper');
    const shipsContainer = shipsWrapper.querySelector('.ships-container');
    if (shipsContainer.firstChild) return

    const turn = gameInstance.getTurn();

    console.log("Done fn");
    const boardNode = document.querySelector(`#gameboard-${turn}`);
    console.log(boardNode);

    // const boardNo = boardNode.dataset.boardNo;
    // players[boardNo].gameboard
    const ships = shipsFromBoard(boardNode);
    console.log(ships);

    ships.forEach((ship) => {
      gameInstance.players[turn].gameboard.placeShip(
        ship.rowcol,
        ship.length,
        ship.orientation,
      );
      console.log(ship);
    });

    console.log(gameInstance.isPvPGamemode())
    if (gameInstance.isPvPGamemode() == true) {
      if (turn === 1) {
        gameInstance.changeTurn(); // Now it's 2
        const turn = gameInstance.getTurn(); // 2
        handlers.displayHeader(turn, gameInstance.isPvPGamemode(), null, true)
        handlers.displayBoard(turn);
        handlers.displayShips(doneFn, turn);
        return;
      }
      gameInstance.changeTurn(); // Change again to 1
    }
    
    disableDragDrop();
    enableTurnHandler();
    shipsPlaced = true;
    handlers.displayHeader(gameInstance.getTurn(), gameInstance.isPvPGamemode(), null, false)
    handlers.displayBoards();
  };

  // Reference game instance
  const initGameboard = function init(game) {
    shipsPlaced = false;
    gameInstance = game;
    turnFn = gameInstance.handleTurn;
  };

  const enableTurnHandler = function enableTurnHandler() {
    clickFn = (e) => {
      const rowcol = e.target.dataset.rowcol;
      if (!rowcol) return;

      const turn = gameInstance.getTurn();

      console.log("Turn on board node " + turn);
      if (turn == e.currentTarget.dataset.boardNo) {
        console.log("Ignored, player click in its own board");
        return;
      }

      const hit = turnFn(e);
      if (hit === true) {
        const winner = gameInstance.checkWinner();
        if (winner !== null) { // Why null. Ah bcs it's initialize to null. and only change when a winner
          disableTurnHandler();
          handlers.displayWinner(winner, gameInstance.isPvPGamemode());
          handlers.displayHeader(gameInstance.getTurn(), gameInstance.isPvPGamemode(), winner, false)
        }
        handlers.displayBoards(); // Display boards as player continue hitting
        return;
      } else if (hit === null) {
        console.log("Board node: hitting same spot twice");
        return;
      }

      // HIt false: is miss
      if (gameInstance.isPvPGamemode() === true) {
        handlers.displayHeader(gameInstance.getTurn(), gameInstance.isPvPGamemode(), null, false)
        handlers.displayPassScreen();
        return
      } else {
        const winner = gameInstance.checkWinner();
        if (winner !== null) { // Why null. Ah bcs it's initialize to null. and only change when a winner
          disableTurnHandler();
          handlers.displayHeader(gameInstance.getTurn(), gameInstance.isPvPGamemode(), winner, false)
          handlers.displayWinner(winner, gameInstance.isPvPGamemode());
        }
        handlers.displayBoards(); 
      }
      // handlers.displayPassScreen();
    };
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

  const boardNode = function boardNode(boardNo, pass = false, board = null) {
    // Kinda use arguments, instead of module coupling and direct reference
    let gameboard;
    if (board == null) gameboard = gameInstance.players[boardNo].gameboard;
    else gameboard = board;

    const turn = gameInstance.getTurn();

    const boardNode = document.createElement("div");
    boardNode.id = `gameboard-${boardNo}`;
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
        // Display ships only for current turn
        if (pass === false && boardNo === turn) {
          const shipIndex = shipsBoard[rowIndex][colIndex];
          if (shipIndex !== null) {
            colNode.dataset.shipIndex = shipIndex; // unnused
            colNode.classList.add("hasShip");
            // colNode.textContent = shipIndex; // no longer used
          }

          // Add drag and drop handlers if enabled
          if (dropFn) {
            colNode.addEventListener("drop", (e) => {
              dropFn(e, gameboard);
            });
          }
          if (dragoverFn) colNode.addEventListener("dragover", dragoverFn);
          if (dragleaveFn) colNode.addEventListener("dragleave", dragleaveFn);
        }

        if (shotsBoard[rowIndex][colIndex] === false) {
          colNode.classList.add("isMiss");
        }

        if (shotsBoard[rowIndex][colIndex] === true) {
          colNode.classList.add("isHit");
        }

        rowNode.appendChild(colNode);
      });

      boardNode.appendChild(rowNode);
    });

    if (pass === true && boardNo !== turn) {
      const passDiv = document.createElement("div");
      const passHeading = document.createElement("h3");
      const passBtn = document.createElement("button");

      passDiv.classList.add("passScreen");
      passHeading.textContent = "Pass the turn!";
      passBtn.textContent = "Ready";
      passBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        handlers.displayBoards();
      });

      passDiv.appendChild(passHeading);
      passDiv.appendChild(passBtn);
      boardNode.appendChild(passDiv);
    }
    if (pass === false) {
      if (clickFn) boardNode.addEventListener("click", clickFn);
    }
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

export default GameboardNode;
