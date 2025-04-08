import Gameboard from "./Gameboard";

class Player {
  constructor(realPlayer, shipsNo) {
    if (typeof realPlayer !== "boolean") throw Error("Invalid argument given. A boolean type is expected");
    
    this.type = realPlayer ? "real" : "computer";
    this.gameboard = new Gameboard(shipsNo);
    
    this.availableMoves = [];  
    if (!realPlayer) {
      // Populate all possible moves
      for (let row = 0; row < this.gameboard.boardSize; row++) {
        for (let col = 0; col < this.gameboard.boardSize; col++) {
            // this.availableMoves.push([row, col]);
            this.availableMoves.push(`${row}${col}`);

        }
      }
    }
  }


  generateRandomMove() {
    if (this.availableMoves.length === 0) {
        throw new Error("No more available moves");
    }
    
    // Choose a random rowcol
    const randomIndex = Math.floor(Math.random() * this.availableMoves.length);
    const rowcol = this.availableMoves[randomIndex];

    // Remove the chosen rowcol from the available moves
    this.availableMoves.splice(randomIndex, 1);

    return rowcol;
  }

}

export default Player;
