import Gameboard from "./Gameboard";

describe("Gameboard class contains respective properties", () => {
  const gameboard = new Gameboard();
  const arrFilledWithNull = [...Array(10)].map(() =>
    [...Array(10)].map(() => null),
  );

  test("Default shots board array is filled with null", () => {
    expect(gameboard.shotsBoard).toEqual(arrFilledWithNull);
  });

  test("Default ships board array is filled with null", () => {
    expect(gameboard.shipsBoard).toEqual(arrFilledWithNull);
  });

  test("Sunks prop is initialize to 0", () => {
    expect(gameboard.sunks).toBe(0);
  });

  test("Ships array is initialize as empty", () => {
    expect(gameboard.ships).toEqual([]);
  });
});

describe("Place a single ship correctly", () => {
  test("Place one square ship in coordinate 00", () => {
    const gameboard = new Gameboard();

    const testShipBoard = [...Array(10)].map(() =>
      [...Array(10)].map(() => null),
    );
    testShipBoard[0][0] = true;

    gameboard.placeShip("00", 1, true);

    expect(gameboard.shipsBoard[0][0]).toBe(0);
    expect(gameboard.shipsBoard[1][0]).toBe(null);
    expect(gameboard.shipsBoard[0][1]).toBe(null);

    expect(gameboard.ships.length).toBe(1);
  });

  test("Place horizontal 2 square ship at 00", () => {
    const gameboard = new Gameboard();

    const testShipBoard = [...Array(10)].map(() =>
      [...Array(10)].map(() => null),
    );
    testShipBoard[0][0] = true;
    testShipBoard[0][1] = true;

    gameboard.placeShip("00", 2, true);

    expect(gameboard.shipsBoard[0][0]).toBe(0);
    expect(gameboard.shipsBoard[0][1]).toBe(0);
    expect(gameboard.shipsBoard[0][2]).toBe(null);
    expect(gameboard.shipsBoard[1][0]).toBe(null);

    expect(gameboard.ships.length).toBe(1);
  });

  test("Place vertical 2 square ship at 00", () => {
    const gameboard = new Gameboard();

    const testShipBoard = [...Array(10)].map(() =>
      [...Array(10)].map(() => null),
    );
    testShipBoard[0][0] = true;
    testShipBoard[1][0] = true;

    gameboard.placeShip("00", 2, false);

    expect(gameboard.shipsBoard[0][0]).toBe(0);
    expect(gameboard.shipsBoard[1][0]).toBe(0);
    expect(gameboard.shipsBoard[2][0]).toBe(null);
    expect(gameboard.shipsBoard[0][1]).toBe(null);

    expect(gameboard.ships.length).toBe(1);
  });
});

describe("Place two ships correctly", () => {
  test("Place two one square ship in coordinates 00 and 11", () => {
    const gameboard = new Gameboard();

    gameboard.placeShip("00", 1, true);
    gameboard.placeShip("11", 1, true);

    expect(gameboard.shipsBoard[0][0]).toBe(0);
    expect(gameboard.shipsBoard[1][1]).toBe(1);
    expect(gameboard.shipsBoard[1][0]).toBe(null);
    expect(gameboard.shipsBoard[0][1]).toBe(null);

    expect(gameboard.ships.length).toBe(2);
  });

  test("Place two horizontal 2 square ship at 00 and 10", () => {
    const gameboard = new Gameboard();

    gameboard.placeShip("00", 2, true);
    gameboard.placeShip("10", 2, true);

    expect(gameboard.shipsBoard[0][0]).toBe(0);
    expect(gameboard.shipsBoard[0][1]).toBe(0);
    expect(gameboard.shipsBoard[1][0]).toBe(1);
    expect(gameboard.shipsBoard[1][1]).toBe(1);
    expect(gameboard.shipsBoard[0][2]).toBe(null);
    expect(gameboard.shipsBoard[2][0]).toBe(null);

    expect(gameboard.ships.length).toBe(2);
  });

  test("Place vertical 2 square ship at 00 and 01", () => {
    const gameboard = new Gameboard();

    gameboard.placeShip("00", 2, false);
    gameboard.placeShip("01", 2, false);

    expect(gameboard.shipsBoard[0][0]).toBe(0);
    expect(gameboard.shipsBoard[1][0]).toBe(0);
    expect(gameboard.shipsBoard[0][1]).toBe(1);
    expect(gameboard.shipsBoard[1][1]).toBe(1);
    expect(gameboard.shipsBoard[2][0]).toBe(null);
    expect(gameboard.shipsBoard[0][2]).toBe(null);

    expect(gameboard.ships.length).toBe(2);
  });
});

describe("Check coordinates to be a valid format", () => {
  const gameboard = new Gameboard();

  test("Only numeric string args", () => {
    expect(() => {
      gameboard.placeShip(true, 1, true);
    }).toThrow("Invalid non string coordinates");

    expect(() => {
      gameboard.placeShip(10, 1, true);
    }).toThrow("Invalid non string coordinates");

    expect(() => {
      gameboard.placeShip(["00"], 1, true);
    }).toThrow("Invalid non string coordinates");
  });

  test("Only positive integer coordinates", () => {
    expect(() => {
      gameboard.placeShip("-1-1", 1, true);
    }).toThrow("Invalid out of bounds coordinates");

    expect(() => {
      gameboard.placeShip("100", 1, true);
    }).toThrow("Invalid out of bounds coordinates");

    expect(() => {
      gameboard.placeShip("catdog", 1, true);
    }).toThrow("Invalid out of bounds coordinates");

    expect(() => {
      gameboard.placeShip("", 1, true);
    }).toThrow("Invalid out of bounds coordinates");
  });
});

describe("Reject when ship's length exceeds board bounds", () => {
  const gameboard = new Gameboard();

  test("Invalid horizontal ship of length 2 in row: 0, col: 9", () => {
    expect(gameboard.placeShip("09", 2, true)).toBe(false);
  });

  test("Invalid vertical ship of length 2 in row: 9, col: 9", () => {
    expect(gameboard.placeShip("90", 2, false)).toBe(false);
  });

  test("Valid horizontal ship of length 10 in row: 0, col: 0", () => {
    expect(gameboard.placeShip("00", 10, true)).toBe(true);
  });

  test("Valid vertical ship of length 10 in row: 0, col: 0", () => {
    expect(gameboard.placeShip("00", 10, true)).toBe(true);
  });

  test("Invalid horizontal ship of length 11 in row: 0, col: 0", () => {
    expect(gameboard.placeShip("00", 11, true)).toBe(false);
  });

  test("Invalid vertical ship of length 11 in row: 0, col: 0", () => {
    expect(gameboard.placeShip("00", 11, true)).toBe(false);
  });

  test("Invalid horizontal ship of length 3 in row: 9, col: 8", () => {
    expect(gameboard.placeShip("98", 3, true)).toBe(false);
  });

  test("Invalid vertical ship of length 3 in row: 9, col: 9", () => {
    expect(gameboard.placeShip("89", 3, false)).toBe(false);
  });
});
