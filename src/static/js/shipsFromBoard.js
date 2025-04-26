const shipsFromBoard = function (boardNode) {
  const ships = []

  for (const row of boardNode.children) {
    for (const col of row.children) {
      if ((col.firstChild) && (col.firstChild.classList.contains("ship"))) {
        const ship = col.firstChild;
        ships.push({
          rowcol: col.dataset.rowcol,
          length: parseInt(ship.dataset.length),
          orientation: ship.dataset.orientation === "horizontal",
        })
      }
    }
  }

  return ships;
};

export default shipsFromBoard;