const domHandler = (function () {
  const nodes = {
    main: document.querySelector("main"),
    boardsContainer: null,
    btnWrapper: null,
    newPvPBtn: null,
    newPvCBtn: null,
    player: {
      1: null,
      2: null,
    },
  };

  const referenceDom = function () {
    nodes.boardsContainer = nodes.main.querySelector(".boards-container");
    nodes.player[1] = nodes.boardsContainer.querySelector(".player1-container");
    nodes.player[2] = nodes.boardsContainer.querySelector(".player2-container");
    nodes.btnWrapper = nodes.main.querySelector(".boards-btns");
    nodes.newPvPBtn = nodes.btnWrapper.querySelector(".new-pvp-btn");
    nodes.newPvCBtn = nodes.btnWrapper.querySelector(".new-pvc-btn");
  };

  const initDomHandlers = function initDom(pvcFn, pvpFn) {
    nodes.newPvCBtn.addEventListener("click", pvcFn);
    nodes.newPvPBtn.addEventListener("click", pvpFn);
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
    initDomHandlers,
    referenceDom,
  };
})();

export default domHandler;
