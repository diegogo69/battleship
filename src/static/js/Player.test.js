/* eslint-disable no-undef */
import { Player, AIPlayer } from "./Player";
import Gameboard from "./Gameboard";

describe("Player object contains basic properties", () => {
  const realPlayer = new Player();
  test("Real player has a type of real", () => {
    expect(realPlayer.type).toBe('real');
  });

  test("Real player has a gameboard", () => {
    const testGameboard = new Gameboard();
    expect(realPlayer.gameboard).toEqual(testGameboard);
  });

  const computerPlayer = new AIPlayer();
  test("Computer player has a type of computer", () => {
    expect(computerPlayer.type).toBe('computer');
  });

  test("Computer player has a gameboard", () => {
    const testGameboard = new Gameboard();
    expect(computerPlayer.gameboard).toEqual(testGameboard);
  });
});
