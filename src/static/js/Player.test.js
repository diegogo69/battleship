/* eslint-disable no-undef */
import Player from "./Player";
import Gameboard from "./Gameboard";

describe("Player constructor throws on invalid non boolean arguments", () => {
  test("Throw error when no argument is given", () => {
    expect(() => {
      const realPlayer = new Player();
    }).toThrow("Invalid argument given. A boolean type is expected");
  });

  test("Throw error on any non-boolean argument", () => {
    expect(() => {
      const realPlayer = new Player('true');
    }).toThrow("Invalid argument given. A boolean type is expected");
    
    expect(() => {
      const realPlayer = new Player('false');
    }).toThrow("Invalid argument given. A boolean type is expected");
    
    expect(() => {
      const realPlayer = new Player(0);
    }).toThrow("Invalid argument given. A boolean type is expected");
    
    expect(() => {
      const realPlayer = new Player(1);
    }).toThrow("Invalid argument given. A boolean type is expected");

    expect(() => {
      const realPlayer = new Player('real');
    }).toThrow("Invalid argument given. A boolean type is expected");
  });

});


describe("Player object contains basic properties", () => {
  const realPlayer = new Player(true);
  test("Real player has a type of real", () => {
    expect(realPlayer.type).toBe('real');
  });

  test("Real player has a gameboard", () => {
    const testGameboard = new Gameboard();
    expect(realPlayer.gameboard).toEqual(testGameboard);
  });

  const computerPlayer = new Player(false);
  test("Computer player has a type of computer", () => {
    expect(computerPlayer.type).toBe('computer');
  });

  test("Computer player has a gameboard", () => {
    const testGameboard = new Gameboard();
    expect(computerPlayer.gameboard).toEqual(testGameboard);
  });
});
