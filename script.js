const gameBoard = (function () {
  let playBoardPositions = ["", "", "", "", "", "", "", "", ""];

  const updateCell = (marker, position) => {
    if (playBoardPositions[position] !== "") {
      return false;
    }
    playBoardPositions[position] = marker;
    console.log(playBoardPositions);
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
  let isGameOver;

  const changeActivePlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
    console.log(activePlayer);
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

  const playRound = (position) => {
    if (isGameOver) {
      console.log("Game is over. Start a new game instead");
      return;
    }

    if (gameBoard.updateCell(activePlayer.marker, position)) {
      displayController.updateBoardDisplay();
      if (checkWin()) {
        winningPlayer = activePlayer;
        console.log(winningPlayer.name + " wins!");
        isGameOver = true;
        return;
      }
      changeActivePlayer();
    }
  };

  const startNewGame = () => {
    console.log("Starting New Game...");
    gameBoard.clearBoard();
    displayController.updateBoardDisplay();
    isGameOver = false;
    winningPlayer = undefined;
    activePlayer = player1;
  };

  return { playRound, startNewGame };
})();

const displayController = (function () {
  const boardTiles = document.querySelectorAll(".board-tile");

  const makeTilesClickable = () => {
    document
      .getElementById("game-board-container")
      .addEventListener("click", (e) => {
        const clickedTile = e.target.closest(".board-tile");
        if (clickedTile) {
          console.log(clickedTile.id);
          const clickedPosition = parseInt(clickedTile.id.slice(-1));
          console.log(clickedPosition);
          gameController.playRound(clickedPosition);
        }
      });
  };

  const makeResetButtonFunction = () => {
    document
      .getElementById("start-new-game")
      .addEventListener("click", gameController.startNewGame);
  };

  const updateBoardDisplay = () => {
    const playBoardPositions = gameBoard.getPlayBoard();
    console.log(playBoardPositions);
    console.log(boardTiles);
    for (let i = 0; i < playBoardPositions.length; i++) {
      const marker = playBoardPositions[i];
      const boardTile = boardTiles[i];
      console.log(marker);
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

  return { updateBoardDisplay, makeTilesClickable, makeResetButtonFunction };
})();

console.log(gameBoard);
displayController.makeTilesClickable();
displayController.makeResetButtonFunction();
