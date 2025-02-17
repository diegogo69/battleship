import Ship from "./static/js/Ship";
import Gameboard from "./static/js/Gameboard";
import Player from "./static/js/Player";

const initGame = function initGame() {
  // Create players
  // One real player
  const realPlayer = new Player(true);
  // One computer player
  const computerPlayer = new Player(false);
  // Make random plays. Valid non duplicate coordinates.

  // Populate each player's gameboard with predetermined coordinates
  // Place three ships. Of len 1, 2, 2. For each
  realPlayer.gameboard.placeShip("00", 1, true);
  realPlayer.gameboard.placeShip("01", 2, true);
  realPlayer.gameboard.placeShip("10", 2, false);

  computerPlayer.gameboard.placeShip("00", 1, true);
  computerPlayer.gameboard.placeShip("01", 2, true);
  computerPlayer.gameboard.placeShip("10", 2, false);
};

// Display / render both gameboards

// Event listeners use only class methods

// Allow attacks
// Click on a board coordinate
// Send input to appropiate methods
// Update object state and re-render gameboard

// Gamelogic
// Handle game turns
// End game when a player's ships have all been sunk
