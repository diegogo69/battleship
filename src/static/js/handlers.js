import domHandler from "./domHandler";
import createShips from "./createShips";
import GameboardNode from "./GameboardNode";
import gameInstance from "./gameInstance";
import Gameboard from "./Gameboard";
import createMainPage from "./createMainPage";
import Ship from "./Ship";

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

    const checkOverlapping = (row, col) => {
      const rowNode = boardNode.children[row];
      if (rowNode == null) return false;
      const cell = rowNode.children[col];
      if (cell == null) return false;

      const sameShip = cell.classList.contains(`by-ship-${shipID}`);
      const occupied = cell.classList.contains(`occupied`);

      if (occupied && !sameShip) {
        console.log("Invalid ship overlapping");
        return false;
      }
    };

    return Gameboard.iterateSorroundings(
      rowStart,
      rowEnd,
      colStart,
      colEnd,
      checkOverlapping,
    );
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
    e.dataTransfer.setData("is-placed", isPlaced);
    e.dataTransfer.setDragImage(e.currentTarget, 10, 25); // 10, 10 -> drag image xOffset, yOffset

    ship.classList.add("dragging");
  };

  const dragend = function dragendHandler(e) {
    const ship = e.currentTarget;
    ship.classList.remove("dragging");
  };

  const dragover = function dragoverHandler(e) {
    e.preventDefault(); // Necessary to allow dropping

    const shipClass = e.dataTransfer.getData("ship-class");
    if (shipClass !== "true") return;
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
    const shipIsPlaced = e.dataTransfer.getData("is-placed") === "true";
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
    if (ship.parentNode.classList.contains('ships-container')) return

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
    // Get all ship elements in the dom and reference gameboard node
    const ships = document.querySelectorAll(".ship");
    const boardNode = document.querySelector(".gameboard");

    // Array with available cells to place
    const availableCells = Gameboard.getValidCoordinates();

    // Callback to remove spot after being occupied by a ship
    const removeOccupiedSpot = (row, col) => {
      const sorroundCell = `${row}${col}`;
      const availablesIndex = availableCells.indexOf(sorroundCell);

      if (availablesIndex !== -1) {
        availableCells.splice(availablesIndex, 1);
      }
    };

    // Set orientation helper function
    // References a node list of all the ship elements
    const setShipOrientarion = (horizontal, index) => {
      console.log("Set ship orientation functionnnnnn");
      if (horizontal) {
        ships[index].classList.remove("flex-col");
        ships[index].classList.add("flex-row");
        ships[index].dataset.orientation = "horizontal";
      } else {
        ships[index].classList.remove("flex-row");
        ships[index].classList.add("flex-col");
        ships[index].dataset.orientation = "vertical";
      }
    };

    ships.forEach((ship, shipIndex) => {
      if (ship.parentNode.classList.contains("gameboard-col")) {
        occupyCells(ship, false);
      }
      // Set a random orientation
      let isHorizontal = Math.floor(Math.random() * 2) === 0;
      setShipOrientarion(isHorizontal, shipIndex);
      const length = parseInt(ship.dataset.length);

      let isDomValid = false;
      while (!isDomValid) {
        // Get a random coordinate from the available coordinates arr
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const rowcol = availableCells[randomIndex];
        const row = parseInt(rowcol[0]);
        const col = parseInt(rowcol[1]);

        // Check if ship can be placed in the given coordinates
        isDomValid = isValidDomPlacement(
          row,
          col,
          length,
          isHorizontal,
          boardNode,
          ship.id,
        );

        // If not, change ship's orientation and check again
        if (!isDomValid) {
          isHorizontal = !isHorizontal;
          setShipOrientarion(isHorizontal, shipIndex);

          isDomValid = isValidDomPlacement(
            row,
            col,
            length,
            isHorizontal,
            boardNode,
            ship.id,
          );
        }

        // If it can be placed, add the ship node to the respective grid cell node
        // And remove ship's adjacent coordinates from the available cells array
        if (isDomValid == true) {
          console.log("Dom valid?");
          const shipNode = document.getElementById(ship.id);
          const gridCell = boardNode.children[row].children[col];
          shipNode.classList.add("positioned");
          shipNode.classList.remove("dragging");
          gridCell.appendChild(shipNode);
          occupyCells(shipNode, true);

          const { rowStart, rowEnd, colStart, colEnd } =
            Gameboard.getSorroundings(row, col, isHorizontal, length);

          Gameboard.iterateSorroundings(
            rowStart,
            rowEnd,
            colStart,
            colEnd,
            removeOccupiedSpot,
          );
        }
      }
    });
  };

  // Display ships container
  const displayShips = function displayShipContainer(
    doneFn,
    turn,
    fleet = null,  
    isPvP = false,
  ) {
    const rivalTurn = turn === 1 ? 2 : 1;
    const placeShipsNode = document.createElement("div");
    placeShipsNode.classList.add("place-ships-wrapper");
    const btnWrapper = document.createElement("div");
    btnWrapper.classList.add("ships-btns");

    if (fleet && turn === 1) {
      const fleetSelect = document.createElement("select");
      fleetSelect.classList.add("fleet-select");
      const fleetTypes = Object.keys(Ship.fleets);
      fleetTypes.forEach((fleetType, fleetIndex) => {
        const fleetOpt = document.createElement("option");
        if (fleet == fleetType) fleetOpt.setAttribute('selected', true)
        fleetOpt.value = fleetType;
        fleetOpt.textContent = `Fleet ${fleetIndex + 1}`;
        fleetSelect.appendChild(fleetOpt);
      });
    
      fleetSelect.addEventListener('change', GameboardNode.changeFleet)
      placeShipsNode.appendChild(fleetSelect);
    }

    if (!isPvP) {
      const levelSelect = document.createElement("select");
      levelSelect.classList.add("lvl-select");

      const lvls = ["easy", "normal", "hard"];
      lvls.forEach((lvl) => {
        const lvlOpt = document.createElement("option");
        lvlOpt.value = lvl;
        lvlOpt.textContent = lvl[0].toUpperCase() + lvl.slice(1);
        levelSelect.appendChild(lvlOpt);
      });

      btnWrapper.appendChild(levelSelect);
    }

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.classList.add("done-btn");
    doneBtn.addEventListener("click", doneFn);
    btnWrapper.appendChild(doneBtn);

    const randomBtn = document.createElement("button");
    randomBtn.textContent = "Random";
    randomBtn.classList.add("random-btn");
    randomBtn.addEventListener("click", placeShipsRandomly);
    btnWrapper.appendChild(randomBtn);

    const shipsArr = Ship.createShips(fleet);
    const shipsNode = createShips(shipsArr);

    placeShipsNode.appendChild(shipsNode);
    placeShipsNode.appendChild(btnWrapper);
    domHandler.render.ships(placeShipsNode, rivalTurn);
  };

  // Display gameboards
  const displayBoard = function displayBoard(
    playerNo,
    pass = false,
    isMock = null,
  ) {
    let board = null;
    if (isMock !== null) {
      const emptyGameboard = new Gameboard();
      board = GameboardNode.boardNode(playerNo, pass, emptyGameboard);
    } else {
      board = GameboardNode.boardNode(playerNo, pass);
    }
    domHandler.render.board[playerNo](board);
  };

  // Display gameboards
  const displayPassScreen = function passScreen() {
    const pass = true;
    displayBoard(1, pass);
    displayBoard(2, pass);
  };

  const displayBoards = function displayBoards(isMock = null, pass = false) {
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

  const initGame = function initGame(isPvP) {
    // Creeate new game instance
    const game = gameInstance();
    game.init(isPvP);

    // Initialize the gameboard DOM handlers to current game instance
    GameboardNode.initGameboard(game);
    GameboardNode.enableDragDrop(dragover, drop, dragleave);

    // Display gameboard only for player 1. As the other will hold the ships elements
    const turn = game.getTurn(); // 1
    const fleet = game.getFleet()
    displayHeader(turn, isPvP, null, true);
    displayBoard(turn);
    displayShips(GameboardNode.doneFn, turn, fleet, isPvP);
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
    occupyCells,
    testPlaceShips,
    initDomHandlers,
    displayHeader,
    mainPage,
  };
})();

export default handlers;
