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
    const shipsWrapper = e.currentTarget.closest(".place-ships-wrapper");
    const shipsContainer = shipsWrapper.querySelector(".ships-container");
    if (shipsContainer.firstChild) return;

    const turn = gameInstance.getTurn();

    console.log("Done fn");
    const boardNode = document.querySelector(`#gameboard-${turn}`);
    console.log(boardNode);

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

    console.log(gameInstance.isPvPGamemode());
    if (gameInstance.isPvPGamemode() == true) {
      if (turn === 1) {
        gameInstance.changeTurn(); // Now it's 2
        const turn = gameInstance.getTurn(); // 2
        handlers.displayHeader(turn, gameInstance.isPvPGamemode(), null, true);
        handlers.displayBoard(turn);
        handlers.displayShips(doneFn, turn);
        return;
      }
      gameInstance.changeTurn(); // Change again to 1
    }

    disableDragDrop();
    enableTurnHandler();
    shipsPlaced = true;
    handlers.displayHeader(
      gameInstance.getTurn(),
      gameInstance.isPvPGamemode(),
      null,
      false,
    );
    handlers.displayBoards();
  };

  // Reference game instance
  const initGameboard = function init(game) {
    shipsPlaced = false;
    gameInstance = game;
    turnFn = gameInstance.handleTurn;
  };

  const endGame = function endGame(winner) {
    disableTurnHandler();
    handlers.displayWinner(winner, gameInstance.isPvPGamemode());
    handlers.displayHeader(
      gameInstance.getTurn(),
      gameInstance.isPvPGamemode(),
      winner,
      false,
    );
  };

  const enableTurnHandler = function enableTurnHandler() {
    clickFn = (e) => {
      const rowcol = e.target.dataset.rowcol;
      if (!rowcol) return;

      const turn = gameInstance.getTurn();

      if (turn == e.currentTarget.dataset.boardNo) {
        console.log("Ignored, player click in its own board");
        // throw "Ignored, player click in its own board";

        return;
      }

      const hit = turnFn(e);
      if (hit === null) return;

      // If computer hits a ship, check if it won or keep the turn
      // When a computer gets a hit the turn value is set to two in the game instance
      // If the computer does not wins, and gets a miss, change turn back to 1
      if (!gameInstance.isPvPGamemode()) {
          const winner = gameInstance.checkWinner();
          if (winner !== null) {
            endGame(winner);
          }
          handlers.displayBoards(); // Display boards as player continue hitting
          return;
      }

      // If a real player gets a hit, both in 1 player and 2 player gamemodes
      // Check if it's the winner
      if (hit) {
        const winner = gameInstance.checkWinner();
        if (winner !== null) {
          endGame(winner);
        }
        handlers.displayBoards(); // Display boards as player continue hitting
        return;
      }

      // When a player gets a miss in 2 players gamemode
      // Display a pass screen to hide the rival ships
      if (gameInstance.isPvPGamemode() && hit === false) {
        // HIt false: is miss
        handlers.displayHeader(
          gameInstance.getTurn(),
          gameInstance.isPvPGamemode(),
          null,
          false,
        );
        handlers.displayPassScreen();
        return;
      }

      // For a miss in 1 player gamemode render the gameboards
      // if (hit === false) {
      //   handlers.displayBoards();
      // }
    };
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

  const boardNode = function boardNode(
    boardNo,
    pass = false,
    boardInstance = null,
  ) {
    // Kinda use arguments, instead of module coupling and direct reference
    let gameboard;
    if (boardInstance !== null) gameboard = boardInstance;
    else gameboard = gameInstance.players[boardNo].gameboard;

    const boardNode = document.createElement("div");
    boardNode.id = `gameboard-${boardNo}`;
    boardNode.classList.add("gameboard");
    boardNode.dataset.boardNo = boardNo;

    // Empty board
    const isMockup = boardInstance !== null;
    const turn = isMockup ? boardNo : gameInstance.getTurn(); //
    const winner = isMockup ? null : gameInstance.checkWinner(); //
    if (!winner && boardNo !== turn) {
      boardNode.classList.add("being-attacked");
    }

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
        // Display ships only for current turn being-attacked
        if (!isMockup && pass === false && boardNo === turn) {
          const shipIndex = shipsBoard[rowIndex][colIndex];
          if (shipIndex !== null) {
            colNode.classList.add("hasShip");
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

    if (!isMockup && pass === true && boardNo !== turn) {
      const passDiv = document.createElement("div");
      const passHeading = document.createElement("h3");
      const passBtn = document.createElement("button");

      passDiv.classList.add("passScreen");
      passHeading.textContent = `Player ${turn} attacks`;
      passBtn.textContent = "Ready";
      passBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        handlers.displayBoards();
      });

      passDiv.appendChild(passHeading);
      passDiv.appendChild(passBtn);
      boardNode.appendChild(passDiv);
    }

    if (!isMockup) {
      if (pass === false && clickFn)
        boardNode.addEventListener("click", clickFn);

      const playerBoardSpan = document.createElement("div"); //
      playerBoardSpan.classList.add("player-board-span");
      const playerSpan = document.createElement("span"); //
      playerBoardSpan.appendChild(playerSpan);

      for (let i = 0; i < gameboard.shipsNo; i++) {
        const shipSpan = document.createElement("div");
        if (i < gameboard.sunks) {
          shipSpan.classList.add("isHit");
        } else {
          shipSpan.classList.add("hasShip");
        }
        playerBoardSpan.appendChild(shipSpan);
      }

      if (shipsPlaced && gameInstance.isPvPGamemode()) {
        playerSpan.textContent = `Player ${boardNo} ships:`;
      } else if (shipsPlaced && boardNo == 1) {
        playerSpan.textContent = "Your ships:";
      } else if (shipsPlaced) {
        playerSpan.textContent = "Computer's ships:";
      }

      boardNode.appendChild(playerBoardSpan);
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
