class Ship {
  constructor(length) {
    if (typeof length !== 'number') throw 'Invalid length argument'
    if (length <= 0) throw 'Invalid length argument'
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
