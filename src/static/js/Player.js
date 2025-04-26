import Gameboard from "./Gameboard";

class Player {
  constructor(fleet) {
    this.type = "real";
    this.gameboard = new Gameboard(fleet);
  }
}

class AIPlayer extends Player {
  constructor(shipsNo) {
    super(shipsNo);
    this.type = "computer";
    this.availableCoordinates = Gameboard.getValidCoordinates();
    this.lastHit = {
      rowcol: null,
      isHit: false,
      isSunk: false,
    };
    this.adjacents = [];
    this.lastShots = [];
  }

  getLastShots() {
    return this.lastShots;
  }

  emptyLastShots() {
    this.lastShots = [];
  }

  addLastShots(shot) {
    this.lastShots.push(shot);
  }

  setLastHit({ isHit, rowcol }) {
    this.lastHit.isHit = isHit;
    this.lastHit.rowcol = rowcol;
  }

  getAdjacents() {
    const prevRowcol = this.lastHit.rowcol;
    const prevRow = parseInt(prevRowcol[0]);
    const prevCol = parseInt(prevRowcol[1]);
    const possibleAdjacents = [];

    let nextTop = null;
    let nextBottom = null;
    let nextLeft = null;
    let nextRight = null;

    // 1 - 9: has a top grid cell
    if (prevRow > 0) {
      nextTop = prevRow - 1;
      possibleAdjacents.push(`${nextTop}${prevCol}`);
    }
    // 1 - 8: has a bottom grid cell
    if (prevRow < Gameboard.SIZE - 1) {
      nextBottom = prevRow + 1;
      possibleAdjacents.push(`${nextBottom}${prevCol}`);
    }
    // 1 - 9: has a left grid cell
    if (prevCol > 0) {
      nextLeft = prevCol - 1;
      possibleAdjacents.push(`${prevRow}${nextLeft}`);
    }
    // 1 - 8: has a right grid cell
    if (prevCol < Gameboard.SIZE - 1) {
      nextRight = prevCol + 1;
      possibleAdjacents.push(`${prevRow}${nextRight}`);
    }

    return {
      nextTop,
      nextBottom,
      nextLeft,
      nextRight,
      possibleAdjacents,
    };
  }

  addAdjacents() {
    const { possibleAdjacents } = this.getAdjacents();

    possibleAdjacents.forEach((adj) => {
      const isAvailable = this.availableCoordinates.indexOf(adj);
      if (isAvailable !== -1) {
        this.adjacents.push(adj);
        this.availableCoordinates.splice(isAvailable, 1);
      }
    });
  }



  removeAdjacents() {
    if (this.adjacents[0] == null) return;
    // Get the data of the sunk ship: coordinates, length and orientation
    // Remove its sorroundings from the available adjacent coordinates
    const { row, col, length, isHorizontal } = this.lastHit.isHit;
    const { rowStart, rowEnd, colStart, colEnd } = Gameboard.getSorroundings(
      row,
      col,
      isHorizontal,
      length,
    );

    const removeAdjacentMove = (rowIndex, colIndex) => {
      const sorroundCell = `${rowIndex}${colIndex}`;
  
      const availablesIndex = this.availableCoordinates.indexOf(sorroundCell);
      if (availablesIndex !== -1) {
        this.availableCoordinates.splice(availablesIndex, 1);
      }
  
      if (this.adjacents[0]) {
        const adjacentIndex = this.adjacents.indexOf(sorroundCell);
        if (adjacentIndex !== -1) {
          this.adjacents.splice(adjacentIndex, 1);
        }
      }
    }

    Gameboard.iterateSorroundings(
      rowStart,
      rowEnd,
      colStart,
      colEnd,
      removeAdjacentMove,
    );
  }

  getAdjacent() {
    return this.adjacents.shift();
  }

  getRandomAdjacent() {
    const randomIndex = Math.floor(Math.random() * this.adjacents.length);
    const rowcol = this.adjacents[randomIndex];
    this.adjacents.splice(randomIndex, 1);
    return rowcol;
  }

  getRandomRowcol() {
    // Choose a random rowcol
    const randomIndex = Math.floor(
      Math.random() * this.availableCoordinates.length,
    );
    const rowcol = this.availableCoordinates[randomIndex];

    // Remove the chosen rowcol from the available moves
    this.availableCoordinates.splice(randomIndex, 1);
    return rowcol;
  }

  generateRandomMove(aiLevel) {
    if (this.availableCoordinates[0] == null) {
      throw new Error("No more available moves");
    }

    // Add adjacents cells from the last cell hit
    if (this.lastHit.isHit && aiLevel !== "easy") {
      this.addAdjacents();
    }

    if (this.adjacents[0] && aiLevel !== "easy") {
      // Remove sorrounding cells of a sunk ship from available coordinates
      if (typeof this.lastHit.isHit === "object") {
        this.removeAdjacents(true);
      }

      // Hit random adjacent coordinate
      if (aiLevel === "normal") {
        // Ensure there are available adjacents after removal
        if (this.adjacents[0]) {
          return this.getRandomAdjacent();
        }
      }

      // Hit succesive adjacent coordinate
      if (aiLevel === "hard") {
        // Ensure there are stil adjacents after removal
        if (this.adjacents[0]) {
          return this.getAdjacent();
        }
      }
    }

    // If easy mode or no adjacent coordinates registered
    return this.getRandomRowcol();
  }
}

export { Player, AIPlayer };
