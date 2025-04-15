const shipsFromBoard = function (boardNode) {
  const ships = []

  // for (let i = 0; i < boardNode.length; i++) {
  for (const row of boardNode.children) {

    // for (let j = 0; j < row.length; j++) {
    for (const col of row.children) {
      // const col = boardNode[i][j];
      
      if ((col.firstChild) && (col.firstChild.classList.contains("ship"))) {
        console.log(col)
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