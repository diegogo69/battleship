/* eslint-disable no-undef */
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

    gameboard.placeShip("00", 1, true);

    expect(gameboard.shipsBoard[0][0]).toBe(0);
    expect(gameboard.shipsBoard[1][0]).toBe(null);
    expect(gameboard.shipsBoard[0][1]).toBe(null);

    expect(gameboard.ships.length).toBe(1);
  });

  test("Place horizontal 2 square ship at 00", () => {
    const gameboard = new Gameboard();

    gameboard.placeShip("00", 2, true);

    expect(gameboard.shipsBoard[0][0]).toBe(0);
    expect(gameboard.shipsBoard[0][1]).toBe(0);
    expect(gameboard.shipsBoard[0][2]).toBe(null);
    expect(gameboard.shipsBoard[1][0]).toBe(null);

    expect(gameboard.ships.length).toBe(1);
  });

  test("Place vertical 2 square ship at 00", () => {
    const gameboard = new Gameboard();

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

// Gameboards should have a receiveAttack function that takes a pair of coordinates,
// determines whether or not the attack hit a ship and then
// sends the ‘hit’ function to the correct ship,
// or records the coordinates of the missed shot.

describe("receiveAttack determines whether or not the attack hit a ship", () => {
  // Miss = null
  // Hit = false
  // Hit and all ships sunk = true
  test("Valid attack hits ship on 00", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip("00", 1, true);

    expect(gameboard.receiveAttack("00")).toBe(false);
  });

  test("Valid attack hits ship on 99", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip("99", 1, true);

    expect(gameboard.receiveAttack("99")).toBe(false);
  });
  
  test("Invalid attack does not hits any ship at 00", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip("01", 1, true);

    expect(gameboard.receiveAttack("00")).toBe(null);
  });

  test("Invalid attack does not hits any ship at 99", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip("98", 1, true);

    expect(gameboard.receiveAttack("99")).toBe(null);
  });

  test("Reject invalid attack at 999", () => {
    const gameboard = new Gameboard();

    expect(() => {
      gameboard.receiveAttack("999");
    }).toThrow("Invalid out of bounds coordinates");
  });
  
});

describe("Keep track of missed attacks", () => {
  test("Trck missed attack at 00, as false in shotsBoard", () => {
    const gameboard = new Gameboard();
    gameboard.receiveAttack("00");

    expect(gameboard.shotsBoard[0][0]).toBe(false);
    expect(gameboard.shotsBoard[0][1]).toBe(null);
    expect(gameboard.shotsBoard[1][0]).toBe(null);
  });
 
});

// report whether or not all of their ships have been sunk
describe("Report whether or not all of their ships have been sunk", () => {
  test("Gameboard of three ships, place three single sqr ships and hit all of them", () => {
    const shipsNo = 3;
    const gameboard = new Gameboard(shipsNo);

    gameboard.placeShip('00', 1, true);
    gameboard.placeShip('10', 1, true);
    gameboard.placeShip('20', 1, true);

    expect(gameboard.receiveAttack("00")).toBe(false);
    expect(gameboard.receiveAttack("10")).toBe(false);
    expect(gameboard.receiveAttack("20")).toBe(true);
  });

  test("Gameboard of three ships, place three multi sqr ships and hit all of them", () => {
    const shipsNo = 3;
    const gameboard = new Gameboard(shipsNo);

    gameboard.placeShip('00', 1, true);
    gameboard.placeShip('10', 2, true);
    gameboard.placeShip('20', 3, true);

    expect(gameboard.receiveAttack("00")).toBe(false);
    expect(gameboard.receiveAttack("10")).toBe(false);
    expect(gameboard.receiveAttack("11")).toBe(false);
    expect(gameboard.receiveAttack("20")).toBe(false);
    expect(gameboard.receiveAttack("21")).toBe(false);
    expect(gameboard.receiveAttack("22")).toBe(true);
  });

  test("Gameboard of three ships, place three multi sqr ships. Do not hit all of them", () => {
    const shipsNo = 3;
    const gameboard = new Gameboard(shipsNo);

    gameboard.placeShip('00', 1, true);
    gameboard.placeShip('10', 2, true);
    gameboard.placeShip('20', 3, true);

    expect(gameboard.receiveAttack("00")).toBe(false);
    expect(gameboard.receiveAttack("10")).toBe(false);
    expect(gameboard.receiveAttack("11")).toBe(false);
    expect(gameboard.receiveAttack("20")).toBe(false);
    expect(gameboard.receiveAttack("21")).toBe(false);
    expect(gameboard.receiveAttack("23")).toBe(null);
  });
});
