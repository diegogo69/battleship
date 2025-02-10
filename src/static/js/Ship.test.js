import Ship from "./Ship";

describe('Ship class contains respective properties', () => {
  const ship = new Ship();

  test('Ship contains length prop', () => {
    expect(ship).toHaveProperty('length');
  });

  test('Ship contains hits prop', () => {
    expect(ship).toHaveProperty('hits');
  });

  test('Ship contains sunk prop', () => {
    expect(ship).toHaveProperty('sunk');
  });

  test('Ship contains hit prop', () => {
    expect(ship).toHaveProperty('hit');
  });

  test('Ship contains isSunk prop', () => {
    expect(ship).toHaveProperty('isSunk');
  });

});