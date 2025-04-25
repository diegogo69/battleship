class Ship {
  constructor(row, col, length, isHorizontal) {
    if (typeof length !== "number") throw "Invalid length argument";
    if (length <= 0) throw "Invalid length argument";
    if (typeof isHorizontal !== "boolean") throw "Invalid orientation argument";

    this.row = row;
    this.col = col;
    this.length = length;
    this.isHorizontal = isHorizontal;
    this.hits = 0;
    this.sunk = false;
  }

  static SHIPS = [
    { name: "patrol boat", length: 1 },
    { name: "submarine", length: 2 },
    { name: "destroyer", length: 3 },
    { name: "battleship", length: 4 },
    { name: "carrier", length: 5 },
  ];
  
  static shipFleets = {
    1: [
      { units: 1, ...Ship.SHIPS[0] },
      { units: 1, ...Ship.SHIPS[1] },
      { units: 1, ...Ship.SHIPS[2] },
      { units: 1, ...Ship.SHIPS[3] },
      { units: 1, ...Ship.SHIPS[4] },
    ],
    2: [
      { units: 1, ...Ship.SHIPS[1] },
      { units: 2, ...Ship.SHIPS[2] },
      { units: 1, ...Ship.SHIPS[3] },
      { units: 1, ...Ship.SHIPS[4] },
    ],
    3: [
      { units: 1, ...Ship.SHIPS[0] },
      { units: 3, ...Ship.SHIPS[1] },
      { units: 2, ...Ship.SHIPS[2] },
      { units: 1, ...Ship.SHIPS[3] },
      { units: 1, ...Ship.SHIPS[4] },
    ],

    4: [
      { units: 4, ...Ship.SHIPS[1] },
      { units: 2, ...Ship.SHIPS[2] },
      { units: 2, ...Ship.SHIPS[3] },
      { units: 1, ...Ship.SHIPS[0] },
    ],
  };

  static createShips(fleet=1) {
    const shipsArr = [];

    Ship.shipFleets[fleet].forEach((shipType) => {
      for (let i = 0; i < shipType.units; i++) {
        const ship = {
          name: shipType.name,
          length: shipType.length,
          horizontal: Math.floor(Math.random() * 2) === 0,
        };
        shipsArr.push(ship);
      }
    });

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
