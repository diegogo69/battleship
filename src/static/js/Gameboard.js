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

  // Return index of added ship
  // As it was added with push, it is the last item (e.i. length - 1)
  addShip(length) {
    const arrLength = this.ships.push(new Ship(length));
    return arrLength - 1;
  }
  // placeShip(s)
  placeShip(rowcol, length, horizontal) {
    let row = parseInt(rowcol[0]);
    let col = parseInt(rowcol[1]);

    const shipIndex = this.addShip()

    for (let i = 0; i < length; i++) {
      this.shipsBoard[row][col] = shipIndex;

      if (horizontal) col += 1;
      else row += 1;
    }
  }
}

export default Gameboard;
