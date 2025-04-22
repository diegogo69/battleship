import domHandler from "./domHandler";
import createShips from "./createShips";
import GameboardNode from "./GameboardNode";
import gameInstance from "./gameInstance";
import Gameboard from "./Gameboard";
import createMainPage from "./createMainPage";

const handlers = (function () {
  const isValidDomArea = function isValidDomArea(
    row,
    col,
    length,
    isHorizontal,
    boardNode,
    shipID,
  ) {
    // const {row, col} = Gameboard.validateCoordinates(rowcol)

    const { rowStart, rowEnd, colStart, colEnd } = Gameboard.getSorroundings(
      row,
      col,
      isHorizontal,
      length,
    );
    // const boardNode = gridCell.closest('.gameboard');

    for (let curRow = rowStart; curRow <= rowEnd; curRow++) {
      for (let curCol = colStart; curCol <= colEnd; curCol++) {
        const rowNode = boardNode.children[curRow];
        if (rowNode == null) return [false];
        const cell = rowNode.children[curCol];
        if (cell == null) return false;

        // If cell is free, or same ship
        // cell != null &&
        const sameShip = cell.classList.contains(`by-ship-${shipID}`);
        const occupied = cell.classList.contains(`occupied`);
        if (occupied && sameShip) {
          console.log(
            "Ship overlaps itself. So it is a realocation at " +
              curRow +
              "" +
              curCol,
          );
          // console.log('valid cell ' + row + '' + col)
        } else if (occupied) {
          console.log(
            "Ship element overlaps another ship element at " +
              curRow +
              "" +
              curCol,
          );
          // console.log('invalid cell ' + row + '' + col)
          return false;
        }
      }
    }
    return true;
  };
  const occupyCells = function occupyCells(ship, isOccupy = true) {
    const isGridCell = ship.parentNode.classList.contains("gameboard-col");
    if (!isGridCell) return;

    const gridCell = ship.parentNode;
    const row = parseInt(gridCell.dataset.rowcol[0]);
    const col = parseInt(gridCell.dataset.rowcol[1]);
    const length = parseInt(ship.dataset.length);
    const isHorizontal = ship.dataset.orientation == "horizontal";
    const boardNode = ship.closest(".gameboard");
    for (let i = 0; i < length; i++) {
      let cell = null;

      if (i === 0) {
        cell = boardNode.children[row].children[col];
      } else if (isHorizontal) {
        const next = col + i;
        if (next >= Gameboard.SIZE) return false;
        cell = boardNode.children[row].children[next];
      } else {
        const next = row + i;
        if (next >= Gameboard.SIZE) return false;
        cell = boardNode.children[next].children[col];
      }

      if (isOccupy == true) {
        cell.classList.add(`occupied`);
        cell.classList.add(`by-ship-${ship.id}`);
      } else {
        if (
          cell != null &&
          cell.classList.contains(`occupied`) &&
          cell.classList.contains(`by-ship-${ship.id}`)
        ) {
          cell.classList.remove(`occupied`);
          cell.classList.remove(`by-ship-${ship.id}`);
        }
      }
    }
  };
  const isValidDomPlacement = function isValidDomPlacement(
    row,
    col,
    length,
    horizontal,
    boardNode,
    shipID,
  ) {
    const validBounds = Gameboard.validateBounds(row, col, length, horizontal);
    if (!validBounds) return false;

    const validArea = isValidDomArea(
      row,
      col,
      length,
      horizontal,
      boardNode,
      shipID,
    );

    return validArea;
  };
  const isValidPlacement = function isValidPlacement(
    rowcol,
    length,
    horizontal,
    gameboard,
    boardNode,
    shipID,
  ) {
    const { row, col } = Gameboard.validateCoordinates(rowcol);
    const isDomValid = isValidDomPlacement(
      row,
      col,
      length,
      horizontal,
      boardNode,
      shipID,
    );
    if (!isDomValid) return false;
    return gameboard.canBePlaced(row, col, length, horizontal);
  };

  const dragstart = function dragstartHandler(e) {
    const ship = e.currentTarget;
    const isPlaced = ship.parentNode.classList.contains("gameboard-col");

    e.dataTransfer.setData("ship-id", ship.id);
    e.dataTransfer.setData("ship-class", ship.classList.contains("ship"));
    e.dataTransfer.setData("length", ship.dataset.length);
    e.dataTransfer.setData("orientation", ship.dataset.orientation);
    e.dataTransfer.setData('is-placed', isPlaced)
    e.dataTransfer.setDragImage(e.currentTarget, 10, 25); // 10, 10 -> drag image xOffset, yOffset

    ship.classList.add("dragging");

    console.log(`Dragging ship of length: ${ship.dataset.length}`);
    console.log(`Dragging ship of orientation: ${ship.dataset.orientation}`);
  };

  const dragend = function dragendHandler(e) {
    const ship = e.currentTarget;
    ship.classList.remove("dragging");
  };

  const dragover = function dragoverHandler(e) {
    e.preventDefault(); // Necessary to allow dropping

    const shipClass = e.dataTransfer.getData("ship-class");
    if (shipClass !== "true") return;

    // e.currentTarget.classList.add("hovered");
    // e.dataTransfer.dropEffect = "move";
  };

  const drop = function dropHandler(e, gameboard) {
    e.preventDefault();
    // Dragged element is not ship
    const shipClass = e.dataTransfer.getData("ship-class");
    if (shipClass !== "true") return;

    // Ship dropped in a non valid gameboard grid cell
    if (!e.target.classList.contains("gameboard-col")) return;

    const cell = e.currentTarget;
    const shipID = e.dataTransfer.getData("ship-id");
    const dropCoordinate = cell.dataset.rowcol;
    const shipLength = parseInt(e.dataTransfer.getData("length"));
    const isHorizontal = e.dataTransfer.getData("orientation") === "horizontal";
    const boardNode = cell.closest(".gameboard");
    const boardNo = boardNode.dataset.boardNo;

    const validPlacement = isValidPlacement(
      dropCoordinate,
      shipLength,
      isHorizontal,
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

    // Free the cells previously occupy by ship
    const shipIsPlaced = e.dataTransfer.getData('is-placed') === 'true';
    if (shipIsPlaced) {
      occupyCells(ship, false);
    }

    // ship.parentNode.removeChild(ship);
    ship.classList.add("positioned");
    ship.classList.remove("dragging");
    cell.appendChild(ship);

    occupyCells(ship, true);
    // If all ships have been placed
    if (validPlacement === null) {
      GameboardNode.disableDragDrop();
      GameboardNode.enableTurnHandler();
    }
  };

  const dragleave = function dragleaveHandler(e) {
    e.currentTarget.classList.remove("hovered");
  };

  const rotateShip = function rotateShip(e) {
    const ship = e.currentTarget;

    if (ship.parentNode.classList.contains("gameboard-col")) {
      const row = parseInt(ship.parentNode.dataset.rowcol[0]);
      const col = parseInt(ship.parentNode.dataset.rowcol[1]);
      const length = parseInt(ship.dataset.length);
      const horizontal = ship.dataset.orientation !== "horizontal";
      const boardNode = ship.closest(".gameboard");
      const shipID = ship.id;
      const canRotate = isValidDomPlacement(
        row,
        col,
        length,
        horizontal,
        boardNode,
        shipID,
      );
      if (!canRotate) {
        console.log("Cannot rotate as it overlaps other ships");
        return;
      } else {
        occupyCells(ship, false);
      }
    }
    const flexRow = ship.classList.contains("flex-row");
    if (flexRow === true) {
      ship.classList.remove("flex-row");
      ship.classList.add("flex-col");
      ship.dataset.orientation = "vertical";
    } else {
      ship.classList.remove("flex-col");
      ship.classList.add("flex-row");
      ship.dataset.orientation = "horizontal";
    }
    occupyCells(ship, true);
  };

  const placeShipsRandomly = function placeShipsRandomly() {
    // Get all ship elements
    const ships = document.querySelectorAll(".ship");
    const boardNode = document.querySelector(".gameboard");
    boardNode.classList.remove;
    ships.forEach((ship) => {
      if (ship.parentNode.classList.contains("gameboard-col")) {
        occupyCells(ship, false);
      }
      const length = parseInt(ship.dataset.length);
      // Set a random orientation
      const random01 = Math.floor(Math.random() * 2);
      if (random01 === 0) {
        ship.classList.remove("flex-row");
        ship.classList.add("flex-col");
        ship.dataset.orientation = "vertical";
      } else {
        ship.classList.remove("flex-col");
        ship.classList.add("flex-row");
        ship.dataset.orientation = "horizontal";
      }
      const orientation = ship.dataset.orientation;
      const isHorizontal = orientation === "horizontal";

      let i = 0;
      while (true) {
        if (i >= 100) throw "Something went wrong positioning the ships";

        const { row, col } = Gameboard.getValidRandomCoordinate(
          length,
          isHorizontal,
        );
        const isDomValid = isValidDomPlacement(
          row,
          col,
          length,
          isHorizontal,
          boardNode,
          ship.id,
        );

        if (isDomValid == true) {
          console.log("Dom valid?");
          const shipNode = document.getElementById(ship.id);
          const gridCell = boardNode.children[row].children[col];
          shipNode.classList.add("positioned");
          shipNode.classList.remove("dragging");
          gridCell.appendChild(shipNode);
          occupyCells(shipNode, true);

          break;
        } else {
          i++;
          console.log("invalid");
        }
      }
    });
  };

  // Display ships container
  const displayShips = function displayShipContainer(doneFn, turn) {
    const rivalTurn = turn === 1 ? 2 : 1;
    const placeShipsNode = document.createElement("div");
    placeShipsNode.classList.add("place-ships-wrapper");
    const ships = createShips();
    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.classList.add("done-btn");
    doneBtn.addEventListener("click", doneFn);
    const randomBtn = document.createElement("button");
    randomBtn.textContent = "Random";
    randomBtn.classList.add("random-btn");
    randomBtn.addEventListener("click", placeShipsRandomly);

    const btnWrapper = document.createElement("div");
    btnWrapper.classList.add("ships-btns");
    btnWrapper.appendChild(randomBtn);
    btnWrapper.appendChild(doneBtn);
    placeShipsNode.appendChild(ships);
    placeShipsNode.appendChild(btnWrapper);
    domHandler.render.ships(placeShipsNode, rivalTurn);
  };

  // Display gameboards
  const displayBoard = function displayBoard(playerNo, pass=false, isMock=null) {
    let board = null;
    if (isMock !== null) {
      const emptyGameboard = new Gameboard();
      board = GameboardNode.boardNode(playerNo, pass, emptyGameboard);
    } else {
      board = GameboardNode.boardNode(playerNo);
    }
    domHandler.render.board[playerNo](board);
  };

  // Display gameboards
  const displayPassScreen = function passScreen() {
    const pass = true;
    displayBoard(1, pass);
    displayBoard(2, pass);
  };

  const displayBoards = function displayBoards(isMock=null, pass=false) {
    displayBoard(1, pass, isMock);
    displayBoard(2, pass, isMock);
  };

  const displayWinner = function displayWinner(winner, isPvp) {
    console.log("display winner fn");
    const dialog = document.createElement("dialog");

    const dialHeader = document.createElement("h2");
    if (!isPvp && winner === 2) {
      dialHeader.textContent = "Computer wins! :(";
    } else if (!isPvp && winner === 1) {
      dialHeader.textContent = "You won!";
    } else {
      dialHeader.textContent = `Player ${winner} wins!`;
    }

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Ok";
    closeBtn.autofocus = true;
    closeBtn.addEventListener("click", (e) => {
      dialog.close();
      dialog.parentNode.removeChild(dialog);
    });

    dialog.appendChild(dialHeader);
    dialog.appendChild(closeBtn);
    domHandler.render.dialog(dialog);
  };

  const testPlaceShips = function (player) {
    player.gameboard.placeShip("00", 1, true);
    player.gameboard.placeShip("01", 2, true);
    player.gameboard.placeShip("10", 2, false);
  };
  const displayHeader = function displayHeader(
    turn,
    isPvP,
    winner = null,
    placingShips = false,
  ) {
    let headerText = null;

    if (placingShips && !isPvP) {
      headerText = `Deploy your fleet`;
    } else if (placingShips) {
      headerText = `Player ${turn} place your navy`;
    } else if (winner == 2 && !isPvP) {
      headerText = "Computer wins! :/";
    } else if (winner == 1 && !isPvP) {
      headerText = "You won! :D";
    } else if (winner) {
      headerText = `Player ${winner} emerges victorious!`;
    } else if (turn === 1) {
      headerText = `Player ${turn} launch your attack`;
    } else {
      headerText = `Player ${turn} time to attack back`;
    }
    const header = document.createElement("h2");
    header.textContent = headerText;
    domHandler.render.boardsHeader(header);
  };

  const initGame = function initGame(pvp) {
    // Creeate new game instance
    const game = gameInstance();
    game.init(pvp);

    // Initialize the gameboard DOM handlers to current game instance
    GameboardNode.initGameboard(game);
    GameboardNode.enableDragDrop(dragover, drop, dragleave);

    // Display gameboard only for player 1. As the other will hold the ships elements
    const turn = game.getTurn(); // 1
    displayHeader(turn, game.isPvPGamemode(), null, true);
    displayBoard(turn);
    displayShips(GameboardNode.doneFn, turn);
    hideGamemodes();
  };

  const hideGamemodes = function hideGamemodes() {
    const footer = createMainPage.footer(false);
    domHandler.render.footer(footer);
    domHandler.initHandlers.goBack(mainPage);
  };

  const initDomHandlers = function initDom() {
    domHandler.initHandlers.gamemodes(initGame);
    // domHandler.initHandlers.gamemodes(pvcHandler, pvpHandler);
  };

  const mainPage = function mainPage() {
    const homeNode = createMainPage.main();
    domHandler.render.mainPage(homeNode);
    domHandler.referenceDom();
    initDomHandlers();
    const isMock = true;
    displayBoards(isMock);
  };

  return {
    initGame,
    displayBoard,
    displayBoards,
    displayPassScreen,
    displayShips,
    displayWinner,
    dragstart,
    dragend,
    drop,
    dragover,
    dragleave,
    rotateShip,
    testPlaceShips,
    initDomHandlers,
    displayHeader,
    mainPage,
  };
})();

export default handlers;
