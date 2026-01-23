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
    isGameOver = false;
    winningPlayer = undefined;
    activePlayer = player1;
  };

  return { playRound, startNewGame };
})();

console.log(gameBoard);
