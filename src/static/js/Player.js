import Gameboard from "./Gameboard";

class Player {
  constructor(shipsNo) {
    this.type = "real";
    this.gameboard = new Gameboard(shipsNo);
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

  removeAdjacents(removeCorners = false) {
    // Get the data of the sunk ship: coordinates, length and orientation
    // Remove its sorroundings from the available adjacent coordinates
    // {row, col, length, isHorizontal}
    const { row, col, length, isHorizontal } = this.lastHit.isHit;
    const { rowStart, rowEnd, colStart, colEnd } = Gameboard.getSorroundings(
      row,
      col,
      isHorizontal,
      length,
    );

    for (let curRow = rowStart; curRow <= rowEnd; curRow++) {
      for (let curCol = colStart; curCol <= colEnd; curCol++) {
        const sorroundCell = `${curRow}${curCol}`;
        const adjacentIndex = this.adjacents.indexOf(sorroundCell);
        const availablesIndex = this.availableCoordinates.indexOf(sorroundCell);

        if (adjacentIndex !== -1) {
          this.adjacents.splice(adjacentIndex, 1);
        }
        if (availablesIndex !== -1) {
          this.adjacents.splice(availablesIndex, 1);
        }
      }
    }

    // Remove adjacent of the ship
    if (removeCorners) {
      const { nextTop, nextBottom, nextLeft, nextRight } = this.getAdjacents();

      const leftTop = nextLeft && nextTop;
      const leftBottom = nextLeft && nextBottom;
      const rightTop = nextRight && nextTop;
      const rightBottom = nextRight && nextBottom;

      const corners = []; // bad written
      if (leftTop) corners.push(`${nextTop}${nextLeft}`);
      if (leftBottom) corners.push(`${nextBottom}${nextLeft}`);
      if (rightTop) corners.push(`${nextTop}${nextRight}`);
      if (rightBottom) corners.push(`${nextBottom}${nextRight}`);

      corners.forEach((corner) => {
        const isAvailable = this.availableCoordinates.indexOf(corner);
        if (isAvailable !== -1) {
          this.availableCoordinates.splice(isAvailable, 1);
        }
      });
    }
  }

  getRandomAdjacent() {
    const randomIndex = Math.floor(Math.random() * this.adjacents.length);
    console.log(this.adjacents);
    const rowcol = this.adjacents[randomIndex];

    // Remove the chosen rowcol from the available moves
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

  generateRandomMove(difficulty) {
    if (this.availableCoordinates.length === 0) {
      throw new Error("No more available moves");
    }

    if (difficulty !== "easy" && this.lastHit.isHit) {
      // Add adjacents cells from the last cell hit
      this.addAdjacents();
    }

    // If previous turn was a hit. try adjacent coordinates
    // Ensure there are available adjacents
    if (difficulty === "normal" && this.lastHit.isHit && this.adjacents[0]) {
      const rowcol = this.getRandomAdjacent();
      return rowcol;
    }

    if (difficulty === "hard" && this.adjacents[0]) {
      // Remove adjacents within the sorroundings of a sunk ship
      if (typeof this.lastHit.isHit === "object") {
        this.removeAdjacents(true);
      }

      // Ensure there are stil adjacents after removal
      if (this.adjacents[0]) {
        const rowcol = this.getRandomAdjacent();
        return rowcol;
      }
    }

    // Always executed in easy mode, and when there are no adjacent cells
    // Choose a random adjacent rowcol
    const rowcol = this.getRandomRowcol();
    return rowcol;
  }
}

export { Player, AIPlayer };
