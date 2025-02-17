import Gameboard from "./Gameboard";

class Player {
  constructor(realPlayer) {
    if (typeof realPlayer !== "boolean") throw Error("Invalid argument given. A boolean type is expected");
    
    this.type = realPlayer ? "real" : "computer";
    this.gameboard = new Gameboard();
  }
}

export default Player;
