import domHandler from "./domHandler";
import createBoard from "./createBoard";

const gameLogic = function gameLogic(p1, p2) {
  let turn = 1;
  const players = {
    p1,
    p2,
  };

  const handleClick = function (e) {
    const rowcol = e.target.dataset.rowcol;
    if (!rowcol) return;

    // If turn === 1 but click on board 2
    if (turn === 1) {
      if (e.currentTarget.dataset.boardNo === "1") {
        console.log('Ignore turn === 1 but click on board 1');
        return;
      };

      const gameover = players.p2.gameboard.receiveAttack(rowcol);
      domHandler.clear.player2();
      const board2 = createBoard(players.p2.gameboard, 2, handleClick);
      domHandler.render.board.player2(board2);

      if (gameover === true) {
        // Finish game
       endGame();
      } else {
        turn = 2;
      }
    }

    // If turn === 2 but click on board 1
    if (turn === 2) {
      if (e.currentTarget.dataset.boardNo === "2") {
        console.log('Ignore turn === 2 but click on board 2');
        return;
      };

      // Get yx coordinates of click on board

      const gameover = players.p1.gameboard.receiveAttack(
        rowcol,
      );
      domHandler.clear.player1();
      const board1 = createBoard(players.p1.gameboard, 1, handleClick);

      domHandler.render.board.player1(board1);
      if (gameover === true) {
        // Finish game
        endGame();
      } else {
        turn = 1;
      }
    }
  };

  const endGame = function () {
    alert("Game over");
  };

  return { handleClick };
};

export default gameLogic;
