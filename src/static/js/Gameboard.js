import Ship from "./Ship";

class Gameboard {
  constructor() {
    // Shots board
    this.shotsBoard = [...Array(10)].map(() => [...Array(10)].map(() => null));
    // Ships board
    this.shipsBoard = [...Array(10)].map(() => [...Array(10)].map(() => null));
    // sunks
    this.sunks = 0;
    // shipsarr
    this.ships = [];
    // areSunk
    
    // receiveAttack

    // Ships fleet
    // 1 of 4
    // 2 of 3
    // 3 of 2
    // 4 of 1
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
  #addShip(length) {
    const arrLength = this.ships.push(new Ship(length));
    return arrLength - 1;
  }

  // placeShip(s)
  placeShip(rowcol, length, horizontal) {
    let { row, col } = this.#validateCoordinates(rowcol);
    if (!this.#canBePlaced(row, col, length, horizontal)) return false;

    const shipIndex = this.#addShip();

    for (let i = 0; i < length; i++) {
      this.shipsBoard[row][col] = shipIndex;

      if (horizontal) col += 1;
      else row += 1;
    }

    return true;
  }

  receiveAttack(rowcol) {
    const { row, col } = this.#validateCoordinates(rowcol);

    return this.shipsBoard[row][col] !== null;
  }
}

export default Gameboard;
