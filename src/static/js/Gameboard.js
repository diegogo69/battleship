import Ship from "./Ship";
/* eslint-disable no-plusplus */

// Ships fleet
// 1 of 4
// 2 of 3
// 3 of 2
// 4 of 1

class Gameboard {
  constructor(shipsNo = Gameboard.SHIPS_NO) {
    this.shipsNo = shipsNo;
    this.sunks = 0;
    this.ships = [];
    const SIZE = Gameboard.SIZE;
    this.shotsBoard = [...Array(SIZE)].map(() =>
      [...Array(SIZE)].map(() => null),
    );
    this.shipsBoard = [...Array(SIZE)].map(() =>
      [...Array(SIZE)].map(() => null),
    );
  }

  static get SIZE() {
    return 10;
  }

  static get SHIPS_NO() {
    return 5;
  }

  randomShips(fleet) {
    // Create an array of available coordinates
    const availables = Gameboard.getValidCoordinates();

    // Declare a callback function to be used within an iterator
    // that refences the current availables arr
    const removeCell = (curRow, curCol) => {
      const sorroundCell = `${curRow}${curCol}`;

      const availablesIndex = availables.indexOf(sorroundCell);
      if (availablesIndex !== -1) {
        availables.splice(availablesIndex, 1);
      }
    };

    const shipsArr = Ship.createShips(fleet);
    shipsArr.forEach((shipData) => {
      let shipIsPlaced = false;

      while (shipIsPlaced === false) {
        // Get a random coordinate from the available coordinates arr
        const randomIndex = Math.floor(Math.random() * availables.length);
        const rowcol = availables[randomIndex];
        const row = parseInt(rowcol[0]);
        const col = parseInt(rowcol[1]);

        // Try to place the ship instance
        shipIsPlaced = this.placeShip(
          `${row}${col}`,
          shipData.length,
          shipData.horizontal,
        );

        // If cannot be placed, change orientation and try again
        if (shipIsPlaced === false) {
          shipData.horizontal = !shipData.horizontal;
          shipIsPlaced = this.placeShip(
            `${row}${col}`,
            shipData.length,
            shipData.horizontal,
          );
        }

        // If it was placed remove its sorroundings from available coordinates arr
        if (shipIsPlaced === true) {
          const length = shipData.length;
          const isHorizontal = shipData.horizontal;

          const { rowStart, rowEnd, colStart, colEnd } =
            Gameboard.getSorroundings(row, col, isHorizontal, length);

          Gameboard.iterateSorroundings(
            rowStart,
            rowEnd,
            colStart,
            colEnd,
            removeCell,
          );
        }
      }
    });
  }

  static getValidRandomCoordinate(length, isHorizontal) {
    const size = Gameboard.SIZE;
    // Return a random coordinate based on ship's length and orientation
    let limitRow = null;
    let limitCol = null;
    if (isHorizontal) {
      limitRow = size - length;
      limitCol = size - 1;
    } else {
      limitRow = size - 1;
      limitCol = size - length;
    }

    const row = Math.floor(Math.random() * (limitRow + 1));
    const col = Math.floor(Math.random() * (limitCol + 1));

    console.log("GIVEN COORDINATES: " + row + col);
    return { row, col };
  }

  static getValidCoordinates = () => {
    const coordinates = [];
    for (let row = 0; row < Gameboard.SIZE; row++) {
      for (let col = 0; col < Gameboard.SIZE; col++) {
        // this.availableCoordinates.push([row, col]);
        coordinates.push(`${row}${col}`);
      }
    }
    return coordinates;
  };

  static getSorroundings(row, col, isHorizontal, length) {
    let rowStart = null;
    let rowEnd = null;
    let colStart = null;
    let colEnd = null;

    const nextRow = row + 1;
    const nextCol = col + 1;
    const prevCol = col - 1;
    const prevRow = row - 1;
    const isFirstCol = col === 0;
    const isFirstRow = row === 0;

    if (isFirstCol) {
      colStart = col;
    } else {
      colStart = prevCol;
    }
    if (isFirstRow) {
      rowStart = row;
    } else {
      rowStart = prevRow;
    }

    if (isHorizontal) {
      const colLimit = col + length;
      const colLimitValid = colLimit < Gameboard.SIZE;

      if (colLimitValid) {
        colEnd = colLimit;
      } else {
        //if (colLimit >= Gameboard.SIZE) {
        // colEnd = col;#######
        colEnd = Gameboard.SIZE - 1;
      }
      if (nextRow < Gameboard.SIZE) {
        rowEnd = nextRow;
      } else {
        rowEnd = row; // ########
      }
    } else {
      const rowLimit = row + length;
      const rowLimitValid = rowLimit < Gameboard.SIZE;

      // if (rowLimitValid) {
      if (rowLimitValid) {
        rowEnd = rowLimit;
      } else {
        //if ((rowLimit) > Gameboard.SIZE) {
        // rowEnd = row;
        rowEnd = Gameboard.SIZE - 1;
      }
      if (nextCol < Gameboard.SIZE) {
        colEnd = nextCol;
      } else {
        colEnd = col;
      }
    }

    return { rowStart, rowEnd, colStart, colEnd };
  }

  static iterateSorroundings(rowStart, rowEnd, colStart, colEnd, fn) {
    for (let curRow = rowStart; curRow <= rowEnd; curRow++) {
      for (let curCol = colStart; curCol <= colEnd; curCol++) {
        const returnVal = fn(curRow, curCol);
        if (returnVal === false) return false
      }
    }
    return true
  }

  // UNUSED FUNCTIONF
  static getRandomCoordinate() {
    // Choose a random rowcol
    const randomIndex = Math.floor(
      Math.random() * Gameboard.validCoordinates.length,
    );
    const rowcol = Gameboard.validCoordinates[randomIndex];

    return rowcol;
  }

  static validateCoordinates(rowcol) {
    if (typeof rowcol !== "string")
      throw new Error("Invalid non string coordinates");

    const valid = /^[0-9][0-9]$/.test(rowcol);
    if (!valid) throw new Error("Invalid format/out of bound coordinates");

    const row = parseInt(rowcol[0], 10);
    const col = parseInt(rowcol[1], 10);

    return { row, col };
  }

  // Currently unnused function
  static validateOverlapping(col, row, horizontal, length) {
    for (let i = 0; i < length; i++) {
      const targetCol = horizontal === true ? col + i : col;
      const targetRow = horizontal !== true ? row + i : row;

      if (this.shipsBoard[targetRow][targetCol] !== null) {
        console.log("Invalid overlapping ship placement");
        return false;
      }
    }
    return true;
  }
  static validCoordinates = Gameboard.getValidCoordinates();

  static validateBounds(row, col, length, horizontal) {
    if (horizontal) {
      if (col + length > Gameboard.SIZE) {
        console.log("Invalid drop: Ship exceeds grid boundaries horizontally.");
        return false;
      }
    } else {
      if (row + length > Gameboard.SIZE) {
        console.log("Invalid drop: Ship exceeds grid boundaries vertically.");
        return false;
      }
    }
    return true;
  }
  // Check if a ship has already been placed in the given coordinates
  // Check if a ship's lenght and orientation does not exceed board limits
  canBePlaced(row, col, length, isHorizontal) {
    // Validate bounds
    const validBounds = Gameboard.validateBounds(
      row,
      col,
      length,
      isHorizontal,
    );
    if (!validBounds) return false;
    // Validate area, at least one free cell in all directions
    const { rowStart, rowEnd, colStart, colEnd } = Gameboard.getSorroundings(
      row,
      col,
      isHorizontal,
      length,
    );

    for (let curRow = rowStart; curRow <= rowEnd; curRow++) {
      for (let curCol = colStart; curCol <= colEnd; curCol++) {
        const cell = this.shipsBoard[curRow][curCol];
        const occupied = cell !== null;

        if (occupied) return false;
      }
    }

    return true;
  }

  // Return index of added ship
  // As it was added with push, it is the last item (e.i. length - 1)
  #addShip(row, col, shipLength, isHorizontal) {
    const shipsArrLength = this.ships.push(
      new Ship(row, col, shipLength, isHorizontal),
    );
    return shipsArrLength - 1;
  }

  // Check wether all ships in board have been sunk
  areSunk() {
    return this.sunks === this.shipsNo;
  }

  // Place a ship in the board.
  // Return true is placed, false if not, null if placed and limit reached
  placeShip(rowcol, length, isHorizontal) {
    if (typeof isHorizontal !== "boolean") throw "Invalid orientation argument";

    // Throw error if ship limit is met beforehand
    if (this.shipsNo === this.ships.length)
      throw new Error("Cannot place more ships, limit has been reached");

    let { row, col } = Gameboard.validateCoordinates(rowcol);
    if (!this.canBePlaced(row, col, length, isHorizontal)) return false;

    const shipIndex = this.#addShip(row, col, length, isHorizontal);

    for (let i = 0; i < length; i++) {
      this.shipsBoard[row][col] = shipIndex;

      if (isHorizontal) col += 1;
      else row += 1;
    }

    // After ship has been placed, check if gameboard limit is reached.
    if (this.shipsNo === this.ships.length) return null;

    return true;
  }

  // Take a pair of coordinates an check if attack is hit or miss
  // Register attack in shotsboard arr: hit=true, miss=false
  // Function returns True = hit, False = miss Null = spot taken
  receiveAttack(rowcol) {
    const { row, col } = Gameboard.validateCoordinates(rowcol);

    // If coordinate already attacked
    if (this.shotsBoard[row][col] !== null) {
      console.log("coordinate already attacked");
      return null;
    }

    // If ship placed at coordinate. HIT
    if (this.shipsBoard[row][col] !== null) {
      const shipIndex = this.shipsBoard[row][col];
      const ship = this.ships[shipIndex];
      ship.hit();

      this.shotsBoard[row][col] = true;

      if (ship.isSunk()) {
        this.sunks += 1;
        const row = ship.row;
        const col = ship.col;
        const length = ship.length;
        const isHorizontal = ship.isHorizontal;
        return { row, col, length, isHorizontal };
      }

      console.log("Ship hit");
      return true;
    }

    // If no ship at coordinate. MISS
    this.shotsBoard[row][col] = false;
    return false;
  }
}

export default Gameboard;
