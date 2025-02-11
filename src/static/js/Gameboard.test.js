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

  test('Sunks prop is initialize to 0', () => {
    expect(gameboard.sunks).toBe(0);
  });

  test('Ships array is initialize as empty', () => {
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


describe("Place a single ship correctly", () => {
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

  test("Place vertical 2 square ship at 00", () => {
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
