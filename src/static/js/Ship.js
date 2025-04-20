class Ship {
  constructor(length) {
    if (typeof length !== "number") throw "Invalid length argument";
    if (length <= 0) throw "Invalid length argument";
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  static createShips(shipsNo) {
    const shipsArr = [];
    for (let i = 1; i <= shipsNo; i++) {
      const ship = {
        length: i,
        horizontal: Math.floor(Math.random() * 2) === 0,
      };

      shipsArr.push(ship);
    }
    return shipsArr;
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    return this.length === this.hits;
  }
}

export default Ship;
