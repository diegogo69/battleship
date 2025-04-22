const domHandler = (function () {
  const nodes = {
    main: document.querySelector("main"),
    gameContainer: null,
    boardsContainer: null,
    btnWrapper: null,
    newPvPBtn: null,
    newPvCBtn: null,
    goBackBtn: null,
    footer: null,
    footerText: null,
    player: {
      1: null,
      2: null,
    },
  };

  const referenceDom = function () {
    nodes.gameContainer = nodes.main.querySelector(".game-container");
    nodes.boardsContainer = nodes.gameContainer.querySelector(".boards-container");
    nodes.player[1] = nodes.boardsContainer.querySelector(".player1-container");
    nodes.player[2] = nodes.boardsContainer.querySelector(".player2-container");
    nodes.footer = nodes.main.querySelector("footer");
    nodes.footerText = nodes.footer.querySelector("p");
    nodes.btnWrapper = nodes.footer.querySelector(".boards-btns");
    nodes.newPvPBtn = nodes.btnWrapper.querySelector(".new-pvp-btn");
    nodes.newPvCBtn = nodes.btnWrapper.querySelector(".new-pvc-btn");
  };

  const initHandlers = {
    gamemodes(pvcFn, pvpFn) {
      nodes.newPvCBtn.addEventListener("click", () => {
        pvcFn(false)
      });
      nodes.newPvPBtn.addEventListener("click", () => {
        pvcFn(true)
      });
    },
    goBack(goBackFn) {
      nodes.goBackBtn = nodes.footer.querySelector(".go-back-btn");
      nodes.goBackBtn.addEventListener("click", goBackFn);
    },
  };

  const removeEventListener = {
    node(node, type, fn) {
      node.removeEventListener(type, fn);
    },
    1: function (type, fn) {
      this.node(player1Container.firstChild, type, fn);
    },
    2: function (type, fn) {
      this.node(player2Container.firstChild, type, fn);
    },
  };

  const clear = {
    node(node) {
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    },
    player: {
      1: function () {
        clear.node(nodes.player[1]);
      },

      2: function () {
        clear.node(nodes.player[2]);
      },
    },
  };

  const render = {
    mainPage(node) {
      clear.node(nodes.main);
      nodes.main.appendChild(node);
    },

    footer(node) {
      nodes.gameContainer.removeChild(nodes.footer);
      nodes.gameContainer.appendChild(node);
      nodes.footer = node;
    },

    board: {
      1: function (boardNode) {
        clear.player[1]();
        nodes.player[1].appendChild(boardNode);
      },

      2: function (boardNode) {
        clear.player[2]();
        nodes.player[2].appendChild(boardNode);
      },
    },

    ships(placeShipsNode, rivalTurn) {
      clear.player[rivalTurn]();
      const shipsContainer = nodes.player[rivalTurn];
      shipsContainer.appendChild(placeShipsNode);
    },

    dialog(dial) {
      document.body.appendChild(dial);
      dial.showModal();
    },
  };

  return {
    clear,
    render,
    removeEventListener,
    initHandlers,
    referenceDom,
  };
})();

export default domHandler;
