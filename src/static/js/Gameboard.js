import Ship from "./Ship";
/* eslint-disable no-plusplus */

// Ships fleet
// 1 of 4
// 2 of 3
// 3 of 2
// 4 of 1

class Gameboard {
  constructor(shipsNo = 5) {
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

  randomShips() {
    const shipsArr = Ship.createShips(this.shipsNo);
    shipsArr.forEach((shipData) => {
      let shipIsPlaced = false;

      while (shipIsPlaced === false) {
        let { row, col } = Gameboard.getValidCoordinate(
          shipData.length,
          shipData.horizontal,
        );
        shipIsPlaced = this.placeShip(
          `${row}${col}`,
          shipData.length,
          shipData.horizontal,
        );
      }
    });
  }

  static getValidCoordinate(length, isHorizontal) {
    const size = Gameboard.SIZE;
    // Based on the orientation
    // substract the length of the ship to the board size, so it is within bounds
    // else substract 1 so it's a valid index (10 - 1 = 9 -> valid index)
    const limitRow = size - (isHorizontal == true ? length : 0); // 1
    const limitCol = size - (isHorizontal == false ? length : 0); // 1

    // const row = Math.floor(Math.random() * 1);//limitRow);
    const row = Math.floor(Math.random() * limitRow);

    // const col = Math.floor(Math.random() * 4);//limitCol);
    const col = Math.floor(Math.random() * limitCol);

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

  // Check if a ship has already been placed in the given coordinates
  // Check if a ship's lenght and orientation does not exceed board limits
  canBePlaced(row, col, length, horizontal) {
    // Validate bounds
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

    // Validate area, at least one free cell in all directions
    const { rowStart, rowEnd, colStart, colEnd } = Gameboard.getSorroundings(
      row,
      col,
      horizontal,
      length,
    );

    for (let curRow = rowStart; curRow <= rowEnd; curRow++) {
      for (let curCol = colStart; curCol <= colEnd; curCol++) {
        const cell = this.shipsBoard[curRow][curCol];
        const occupied = cell !== null;

        if (occupied) return false
      }
    }
    
    return true;
  }

  // Return index of added ship
  // As it was added with push, it is the last item (e.i. length - 1)
  #addShip(shipLength) {
    const shipsArrLength = this.ships.push(new Ship(shipLength));
    return shipsArrLength - 1;
  }

  // Check wether all ships in board have been sunk
  areSunk() {
    return this.sunks === this.shipsNo;
  }

  // Place a ship in the board.
  // Return true is placed, false if not, null if placed and limit reached
  placeShip(rowcol, length, horizontal) {
    if (typeof horizontal !== "boolean") throw "Invalid orientation argument";

    // Throw error if ship limit is met beforehand
    if (this.shipsNo === this.ships.length)
      throw new Error("Cannot place more ships, limit has been reached");

    let { row, col } = Gameboard.validateCoordinates(rowcol);
    if (!this.canBePlaced(row, col, length, horizontal)) return false;

    const shipIndex = this.#addShip(length);

    for (let i = 0; i < length; i++) {
      this.shipsBoard[row][col] = shipIndex;

      if (horizontal) col += 1;
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

      if (ship.isSunk()) this.sunks += 1;

      console.log("Ship hit");
      return true;
    }

    // If no ship at coordinate. MISS
    this.shotsBoard[row][col] = false;
    console.log("No ship at coordinate. MISS");
    return false;
  }
}

export default Gameboard;
