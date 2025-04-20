import Gameboard from "./Gameboard";

class Player {
  constructor(shipsNo) {
    this.type = "real";
    this.gameboard = new Gameboard(shipsNo);
  }
}

class AIPlayer extends Player {
  constructor(shipsNo) {
    super(shipsNo);
    this.type = "computer";
    this.availableCoordinates = Gameboard.getValidCoordinates();
  }

  generateRandomMove() {
    if (this.availableCoordinates.length === 0) {
      throw new Error("No more available moves");
    }

    // Choose a random rowcol
    const randomIndex = Math.floor(
      Math.random() * this.availableCoordinates.length,
    );
    const rowcol = this.availableCoordinates[randomIndex];

    // Remove the chosen rowcol from the available moves
    this.availableCoordinates.splice(randomIndex, 1);

    return rowcol;
  }
}

export { Player, AIPlayer };
