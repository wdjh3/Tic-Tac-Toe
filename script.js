const gameBoard = (function () {
  let playBoardPositions = ["", "", "", "", "", "", "", "", ""];

  const updateCell = (marker, position) => {
    if (playBoardPositions[position] !== "") {
      return false;
    }
    playBoardPositions[position] = marker;
    return true;
  };

  const clearBoard = () => {
    playBoardPositions = playBoardPositions.map((position) => (position = ""));
  };

  const getPlayBoard = () => {
    return [...playBoardPositions];
  };

  return { updateCell, clearBoard, getPlayBoard };
})();

const makePlayer = (name, marker) => {
  return { name, marker };
};

const gameController = (function () {
  const player1 = makePlayer("Player 1", "X");
  const player2 = makePlayer("Player 2", "O");

  let activePlayer = player1;
  let winningPlayer;
  let state = "Active";
  let isGameOver;

  const changeActivePlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const checkWin = () => {
    const playBoardPositions = gameBoard.getPlayBoard();
    const winMatches = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const winMatch of winMatches) {
      if (
        playBoardPositions[winMatch[0]] === playBoardPositions[winMatch[1]] &&
        playBoardPositions[winMatch[1]] === playBoardPositions[winMatch[2]] &&
        playBoardPositions[winMatch[0]] !== ""
      ) {
        return true;
      }
    }
    return false;
  };

  const checkDraw = () => {
    const playBoardPositions = gameBoard.getPlayBoard();
    return playBoardPositions.includes("") ? false : true;
  };

  const playRound = (position) => {
    // if (isGameOver) {
    if (state !== "Active") {
      console.log("Game is over. Start a new game instead");
      return;
    }

    if (gameBoard.updateCell(activePlayer.marker, position)) {
      displayController.updateBoardDisplay();
      if (checkWin()) {
        winningPlayer = activePlayer;
        state = "Won";
        displayController.updateTurnDisplay();
        console.log(winningPlayer.name + " wins!");
        return;
      }
      if (checkDraw()) {
        state = "Draw";
        displayController.updateTurnDisplay();
        console.log("DRAW!");
      }
      changeActivePlayer();
      displayController.updateTurnDisplay();
    }
  };

  const startNewGame = () => {
    console.log("Starting New Game...");
    gameBoard.clearBoard();
    displayController.updateBoardDisplay();
    state = "Active";
    winningPlayer = undefined;
    activePlayer = player1;
    displayController.updateTurnDisplay();
  };

  const getActivePlayer = () => {
    return activePlayer;
  };

  const getWinningPlayer = () => {
    return winningPlayer;
  };

  const getState = () => {
    return state;
  };

  return {
    playRound,
    startNewGame,
    getActivePlayer,
    getWinningPlayer,
    checkDraw,
    getState,
  };
})();

const displayController = (function () {
  const boardTiles = document.querySelectorAll(".board-tile");

  const makeTilesClickable = () => {
    document
      .getElementById("game-board-container")
      .addEventListener("click", (e) => {
        const clickedTile = e.target.closest(".board-tile");
        if (clickedTile) {
          if (gameController.getState() !== "Active") {
            displayGameOver();
          }
          const clickedPosition = parseInt(clickedTile.id.slice(-1));
          gameController.playRound(clickedPosition);
        }
      });
  };

  const makeResetButtonFunction = () => {
    document
      .getElementById("start-new-game")
      .addEventListener("click", gameController.startNewGame);
  };

  const updateTurnDisplay = () => {
    const turnDisplay = document.getElementById("turn-display");
    const activePlayer = gameController.getActivePlayer();
    const winningPlayer = gameController.getWinningPlayer();
    const gameState = gameController.getState();

    console.log(winningPlayer);

    if (gameState === "Won") {
      turnDisplay.textContent = `${winningPlayer.name} Wins!`;
      return true;
    }

    if (gameState === "Draw") {
      turnDisplay.textContent = `Draw!`;
      return true;
    }

    turnDisplay.textContent = `${activePlayer.name}'s Turn! (${activePlayer.marker})`;
    return true;
  };

  const displayGameOver = () => {
    document.getElementById("turn-display").textContent =
      "This game is over. Please start a new one.";
  };

  const updateBoardDisplay = () => {
    const playBoardPositions = gameBoard.getPlayBoard();
    for (let i = 0; i < playBoardPositions.length; i++) {
      const marker = playBoardPositions[i];
      const boardTile = boardTiles[i];
      switch (marker) {
        case "X":
          boardTile.innerHTML = `<svg height="100%" width="100%"> <use href="#small-cross"></use> </svg>`;
          break;
        case "O":
          boardTile.innerHTML = `<svg height="100%" width="100%"> <use href="#circle"></use> </svg>`;
          break;
        default:
          boardTile.innerHTML = "";
          break;
      }
    }
  };

  return {
    updateBoardDisplay,
    updateTurnDisplay,
    makeTilesClickable,
    makeResetButtonFunction,
  };
})();

displayController.makeTilesClickable();
displayController.makeResetButtonFunction();
