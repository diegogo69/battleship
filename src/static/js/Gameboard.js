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
    this.shotsBoard = [...Array(10)].map(() => [...Array(10)].map(() => null));
    this.shipsBoard = [...Array(10)].map(() => [...Array(10)].map(() => null));
  }

  boardSize = 10;

  static validateCoordinates(rowcol) {
    if (typeof rowcol !== "string")
      throw new Error("Invalid non string coordinates");

    const validCoordinates = /^[0-9][0-9]$/.test(rowcol);
    if (!validCoordinates)
      throw new Error("Invalid format/out of bound coordinates");

    const row = parseInt(rowcol[0], 10);
    const col = parseInt(rowcol[1], 10);

    return { row, col };
  }

  // Check if a ship has already been placed in the given coordinates
  // Check if a ship's lenght and orientation does not exceed board limits
  #canBePlaced(row, col, length, horizontal) {
    // Validate bounds
    if (horizontal) {
      if (col + length > this.boardSize) {
        console.log("Invalid drop: Ship exceeds grid boundaries horizontally.");
        return false;
      }
    } else {
      if (row + length > this.boardSize) {
        console.log("Invalid drop: Ship exceeds grid boundaries vertically.");
        return false;
      }
    }
    // Validate overlapping
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

  // Place a ship in the board
  placeShip(rowcol, length, horizontal) {
    if (this.shipsNo === this.ships.length)
      throw new Error("Cannot place more ships, limit has been reached");

    let { row, col } = Gameboard.validateCoordinates(rowcol);
    if (!this.#canBePlaced(row, col, length, horizontal)) return false;

    const shipIndex = this.#addShip(length);

    for (let i = 0; i < length; i++) {
      this.shipsBoard[row][col] = shipIndex;

      if (horizontal) col += 1;
      else row += 1;
    }

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
