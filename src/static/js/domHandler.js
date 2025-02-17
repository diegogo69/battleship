const domHandler = (function () {
  const player1Container = document.querySelector(".player1-container");
  const player2Container = document.querySelector(".player2-container");

  const clear = {
    node(node) {
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    },
    player1() {
      this.node(player1Container);
    },

    player2() {
      this.node(player2Container);
    },
  };

  const render = {
    board: {
      player1(boardNode) {
        player1Container.appendChild(boardNode);
      },

      player2(boardNode) {
        player2Container.appendChild(boardNode);
      },
    },
  };

  return { clear, render };
})();

export default domHandler;
