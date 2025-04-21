const createMainPage = ( function () {
  const header = function header() {
    const boardsHeader = document.createElement("header");
    boardsHeader.classList.add("boards-header");
    const headerText = document.createElement("h2");
    headerText.textContent = "Are you ready for the battle?";
    boardsHeader.appendChild(headerText)

    return boardsHeader;
  };

  const boards = function boards() {
    const boardsContainer = document.createElement("div");
    boardsContainer.classList.add("boards-container");

    const p1Container = document.createElement("div");
    p1Container.classList.add("player1-container");

    const p2Container = document.createElement("div");
    p2Container.classList.add("player2-container");

    boardsContainer.appendChild(p1Container);
    boardsContainer.appendChild(p2Container);

    return boardsContainer;
  };

  const footer = function footer(gamemodes=true) {
    const boardsFooter = document.createElement("footer");
    boardsFooter.classList.add("boards-footer");
    const footerText = document.createElement("p");
    footerText.classList.add('footer-text');
    const btnWrapper = document.createElement("div");
    btnWrapper.classList.add("boards-btns");

    if (gamemodes === true) {
      footerText.textContent = "Select a game mode:";

      const newPvCBtn = document.createElement("button");
      newPvCBtn.classList.add("new-pvc-btn");
      newPvCBtn.textContent = "1 player";

      const newPvPBtn = document.createElement("button");
      newPvPBtn.classList.add("new-pvp-btn");
      newPvPBtn.textContent = "2 player";

      btnWrapper.appendChild(newPvCBtn);
      btnWrapper.appendChild(newPvPBtn);
    } else {
      const goBackBtn = document.createElement("button");
      goBackBtn.classList.add("go-back-btn");
      goBackBtn.textContent = "Back to menu";

      btnWrapper.appendChild(goBackBtn);
    }

    boardsFooter.appendChild(footerText);
    boardsFooter.appendChild(btnWrapper);

    return boardsFooter;
  };

  const main = function main() {
    const gameWrapper = document.createElement("div");
    gameWrapper.classList.add("game-container");
  
    const boardsHeader = header();
    const boardsContainer = boards();
    const boardsFooter = footer();

    gameWrapper.appendChild(boardsHeader);
    gameWrapper.appendChild(boardsContainer);
    gameWrapper.appendChild(boardsFooter);
    
    return gameWrapper;
  }

  return { main, footer }
}) ();

export default createMainPage;
