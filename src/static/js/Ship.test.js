import Ship from "./Ship";

describe('Ship class contains respective properties', () => {
  const ship = new Ship(0, 0, 1 , true);

  test('Ship contains length prop', () => {
    expect(ship).toHaveProperty('length', 1);
  });

  test('Ship contains hits prop, initialized to zero', () => {
    expect(ship).toHaveProperty('hits', 0);
  });

  test('Ship contains sunk prop, initialized to false', () => {
    expect(ship).toHaveProperty('sunk', false);
  });

  test('Ship contains hit prop', () => {
    expect(ship).toHaveProperty('hit');
  });

  test('Ship contains isSunk prop', () => {
    expect(ship).toHaveProperty('isSunk');
  });
});