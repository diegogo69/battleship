const createMainPage = function () {
  const gameWrapper = document.createElement("div");
  gameWrapper.classList.add("game-container");

  const boardsHeader = document.createElement("header");
  boardsHeader.classList.add("boards-header");
  const headerText = document.createElement("h2");
  headerText.textContent = "Are you ready for the battle?";

  boardsHeader.appendChild(headerText);

  const boardsContainer = document.createElement("div");
  boardsContainer.classList.add("boards-container");

  const p1Container = document.createElement("div");
  p1Container.classList.add("player1-container");

  const p2Container = document.createElement("div");
  p2Container.classList.add("player2-container");

  boardsContainer.appendChild(p1Container);
  boardsContainer.appendChild(p2Container);

  const boardsFooter = document.createElement("footer");
  boardsFooter.classList.add("boardsFooter");
  const footerText = document.createElement("p");
  footerText.textContent = "Select a game mode:";

  const btnWrapper = document.createElement("div");
  btnWrapper.classList.add("boards-btns");

  const newPvCBtn = document.createElement("button");
  newPvCBtn.classList.add("new-pvc-btn");
  newPvCBtn.textContent = "1 player";

  const newPvPBtn = document.createElement("button");
  newPvPBtn.classList.add("new-pvp-btn");
  newPvPBtn.textContent = "2 player";

  btnWrapper.appendChild(newPvCBtn);
  btnWrapper.appendChild(newPvPBtn);

  boardsFooter.appendChild(footerText);
  boardsFooter.appendChild(btnWrapper);

  gameWrapper.appendChild(boardsHeader);
  gameWrapper.appendChild(boardsContainer);
  gameWrapper.appendChild(boardsFooter);

  return gameWrapper;
};

export default createMainPage;