import Ship from "./Ship";

// Ships fleet
// 1 of 4
// 2 of 3
// 3 of 2
// 4 of 1

class Gameboard {
  constructor(shipsNo = 5) {
    this.shipsNo = shipsNo;
    // sunks
    this.sunks = 0;
    // shipsarr32
    this.ships = [];
    // Shots board
    this.shotsBoard = [...Array(10)].map(() => [...Array(10)].map(() => null));
    // Ships board
    this.shipsBoard = [...Array(10)].map(() => [...Array(10)].map(() => null));
  }

  #boardSize = 10;

  #validateCoordinates(rowcol) {
    if (typeof rowcol !== "string") throw "Invalid non string coordinates";

    const validCoordinates = /^[0-9][0-9]$/.test(rowcol);
    if (!validCoordinates) throw "Invalid out of bounds coordinates";

    const row = parseInt(rowcol[0], 10);
    const col = parseInt(rowcol[1], 10);

    return { row, col };
  }

  #canBePlaced(row, col, length, horizontal) {
    if (horizontal) {
      if (col + length > this.#boardSize) return false;
      return true;
    } else {
      if (row + length > this.#boardSize) return false;
      return true;
    }
  }

  // Return index of added ship
  // As it was added with push, it is the last item (e.i. length - 1)
  #addShip(shipLength) {
    const shipsArrLength = this.ships.push(new Ship(shipLength));
    return shipsArrLength - 1;
  }

  areSunk() {
    return this.sunks === this.shipsNo;
  }

  // placeShip(s)
  placeShip(rowcol, length, horizontal) {
    if (this.shipsNo === this.ships.length)
      throw "Cannot place more ships, limit has been reached";

    let { row, col } = this.#validateCoordinates(rowcol);
    if (!this.#canBePlaced(row, col, length, horizontal)) return false;

    const shipIndex = this.#addShip(length);

    for (let i = 0; i < length; i++) {
      this.shipsBoard[row][col] = shipIndex;

      if (horizontal) col += 1;
      else row += 1;
    }

    return true;
  }

  // Gameboards should keep track of missed attacks so they can display them properly
  receiveAttack(rowcol) {
    const { row, col } = this.#validateCoordinates(rowcol);

    // Check if attack is hit or miss. Register and return:
    // Miss = null
    // Hit = false
    // Hit and all ships sunk = true
    if (this.shipsBoard[row][col] !== null) {
      const shipIndex = this.shipsBoard[row][col];
      const ship = this.ships[shipIndex];
      ship.hit();

      if (ship.isSunk()) {
        this.sunks += 1;
        if (this.areSunk()) return true;
      }

      this.shotsBoard[row][col] = true;
      return false;
    }

    this.shotsBoard[row][col] = false;
    return null;
  }
}

export default Gameboard;
