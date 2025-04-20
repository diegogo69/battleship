import domHandler from "./domHandler";
import createShips from "./createShips";
import GameboardNode from "./GameboardNode";
import gameInstance from "./gameInstance";
import Gameboard from "./Gameboard";
import createMainPage from "./createMainPage";

const handlers = (function () {

  const isValidDomPlacement = function isValidDomPlacement(
    row,
    col,
    length,
    horizontal,
    boardNode,
    shipID,
  ) {
    // Ship element overlaps other ship elements
    for (let i = 0; i < length; i++) {
      let cell = null;

      if (i === 0) {
        cell = boardNode.children[row].children[col];
      } else if (horizontal) {
        const next = col + i;
        if (next >= Gameboard.SIZE) return false;
        cell = boardNode.children[row].children[next];
      } else {
        const next = row + i;
        if (next >= Gameboard.SIZE) return false;
        cell = boardNode.children[next].children[col];
      }

      if (cell != null && cell.classList.contains(`occupied`)) {
        // does not gets execute because the class is remove at dragstart
        // But it does on random placement
        if (cell.classList.contains(`by-ship-${shipID}`)) {
          console.log("Ship overlaps itself. So it is a realocation");
        } else {
          console.log("Ship element overlaps another ship element");
          return false;
        }
      }
    }
    return true;
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

    e.dataTransfer.setData("ship-id", ship.id);
    e.dataTransfer.setData("ship-class", ship.classList.contains("ship"));
    e.dataTransfer.setData("length", ship.dataset.length);
    e.dataTransfer.setData("orientation", ship.dataset.orientation);

    e.dataTransfer.setDragImage(e.currentTarget, 10, 15); // 10, 10 -> drag image xOffset, yOffset

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

    e.currentTarget.classList.add("hovered");
    e.dataTransfer.dropEffect = "move";
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
    const orientation = e.dataTransfer.getData("orientation") === "horizontal";
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
    ship.classList.add("positioned");
    ship.classList.remove("dragging");
    cell.appendChild(ship);

    // If all ships have been placed
    if (validPlacement === null) {
      // Remove ships container

      GameboardNode.disableDragDrop();
      GameboardNode.enableTurnHandler();
    }
    // displayBoard(boardNo, gameboard);
    // displayBoards();
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

    placeShipsNode.appendChild(ships);
    placeShipsNode.appendChild(doneBtn);
    domHandler.render.ships(placeShipsNode, rivalTurn);
  };

  // Display gameboards
  const displayBoard = function displayBoard(playerNo, pass) {
    const board = GameboardNode.boardNode(playerNo, pass);
    domHandler.render.board[playerNo](board);
  };

  // Display gameboards
  const displayPassScreen = function passScreen() {
    const pass = true;
    displayBoard(1, pass);
    displayBoard(2, pass);

    // Display pass header and button
  };

  const displayBoards = function displayBoards() {
    displayBoard(1);
    displayBoard(2);
  };

  const displayWinner = function displayWinner(winner) {
    console.log("display winner fn");
    const dialog = document.createElement("dialog");
    const dialHeader = document.createElement("h2");
    const closeBtn = document.createElement("button");

    dialHeader.textContent = `Player ${winner} wins!`;
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

  const initGame = function initGame(pvp) {
    // Creeate new game instance
    const game = gameInstance();
    game.init(pvp);

    // Initialize the gameboard DOM handlers to current game instance
    GameboardNode.initGameboard(game);
    GameboardNode.enableDragDrop(dragover, drop, dragleave);

    // Display gameboard only for player 1. As the other will hold the ships elements
    const turn = game.getTurn(); // 1
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
    const pvpHandler = () => initGame(true);
    const pvcHandler = () => initGame(false);

    domHandler.initHandlers.gamemodes(pvcHandler, pvpHandler);
  };

  const mainPage = function mainPage() {
    const homeNode = createMainPage.main();
    domHandler.render.mainPage(homeNode);
    domHandler.referenceDom();
    initDomHandlers();
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
    mainPage,
  };
})();

export default handlers;
