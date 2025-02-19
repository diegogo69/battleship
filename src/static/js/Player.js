import Gameboard from "./Gameboard";

class Player {
  constructor(realPlayer, shipsNo) {
    if (typeof realPlayer !== "boolean") throw Error("Invalid argument given. A boolean type is expected");
    
    this.type = realPlayer ? "real" : "computer";
    this.gameboard = new Gameboard(shipsNo);
  }
}

export default Player;
