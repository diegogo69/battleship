const domHandler = (function () {
  const player1Container = document.querySelector(".player1-container");
  const player2Container = document.querySelector(".player2-container");
  const shipsContainer = document.querySelector('.ships-container')

  const initHandlers = function(e, fn) {
    player1Container.addEventListener(e, fn)
    player2Container.addEventListener(e, fn)
  }

  const removeEventListener = {
    node(node, type, fn) {
      node.removeEventListener(type, fn)
    },
    1: function(type, fn) {
      this.node(player1Container.firstChild, type, fn)
    },
    2: function(type, fn) {
      this.node(player2Container.firstChild, type, fn)
    },
  }
  const clear = {
    node(node) {
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    },
    player: {
      1: function() {
        clear.node(player1Container);
      },
  
      2: function() {
        clear.node(player2Container);
      },
    },

    ships() {
      clear.node(shipsContainer)
    }
  };

  const render = {
    board: {
      1: function(boardNode) {
        clear.player[1]()
        player1Container.appendChild(boardNode);
      },

      2: function(boardNode) {
        clear.player[2]()
        player2Container.appendChild(boardNode);
      },
    },

    ships(ships) {
      clear.ships()
      shipsContainer.appendChild(ships)
    }
  };

  return { clear, render, removeEventListener, initHandlers };
})();

export default domHandler;
