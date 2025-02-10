class Ship {
  constructor(length = 0) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    return this.length === this.hits;
  }
}

export default Ship;
