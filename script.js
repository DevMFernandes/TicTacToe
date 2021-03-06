/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable max-len */
const factoryPlayer = (name = '', symbol = '') => ({ name, symbol });

const Manager = (() => {
  const player1 = factoryPlayer();
  const player2 = factoryPlayer();

  let toggle = 0;
  let currentPlayer = player1;

  const start = () => {
    document.querySelector('#name-form').addEventListener('submit', (e) => {
      e.preventDefault();

      player1.name = document.querySelector('#name-form #p1name').value;
      player1.symbol = document.querySelector('#name-form #p1symbol').value;

      player2.name = document.querySelector('#name-form #p2name').value;
      player2.symbol = player1.symbol == 'X' ? 'O' : 'X';


      Ui.setup(player1, player2);
      Gameboard.setup();
      Ui.displayTurn();
    });
  };

  const toggler = () => {
    toggle === 0 ? toggle = 1 : toggle = 0;
    currentPlayer = toggle === 0 ? player1 : player2;
  };

  const curPlayer = () => currentPlayer;

  return { start, toggler, curPlayer };
})();

const Ui = (() => {
  const setup = (p1, p2) => {
    document.querySelector('#name-form').classList.toggle('hidden');
    document.querySelector('table').classList.toggle('hidden');
    document.querySelector('#intro').innerHTML = `${p1.name}(${p1.symbol}) vs ${p2.name}(${p2.symbol})`;
    document.querySelector('#restart').addEventListener('click', () => {
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    });
  };
  const clearMsg = () => {
    document.querySelector('#message').innerHTML = '';
  };
  const gameOver = (msg) => {
    document.querySelector('#message').innerHTML = msg;
    document.querySelector('#turn').innerHTML = '';
    document.querySelector('table').style.pointerEvents = 'none';
    document.querySelector('#restart').classList.toggle('hidden');
  };

  const positionTaken = () => {
    document.querySelector('#message').innerHTML = 'Position taken, try a different move.';
  };

  const displayTurn = () => {
    document.querySelector('#turn').innerHTML = `${Manager.curPlayer().name}'s turn`;
  };

  return {
    setup, clearMsg, gameOver, positionTaken, displayTurn,
  };
})();

const Gameboard = (() => {
  const board = [[], [], []];

  const gameOn = () => {
    const winCombos = [];
    // row wins
    winCombos.push(board[0].join(''));
    winCombos.push(board[1].join(''));
    winCombos.push(board[2].join(''));
    // col wins
    winCombos.push([board[0][0], board[1][0], board[2][0]].join(''));
    winCombos.push([board[0][1], board[1][1], board[2][1]].join(''));
    winCombos.push([board[0][2], board[1][2], board[2][2]].join(''));
    // diag wins
    winCombos.push([board[0][0], board[1][1], board[2][2]].join(''));
    winCombos.push([board[0][2], board[1][1], board[2][0]].join(''));

    for (let i = 0; i < winCombos.length; i++) {
      if (winCombos[i] === 'XXX' || winCombos[i] === 'OOO') {
        Ui.gameOver(`${Manager.curPlayer().name} is the winner!`);
        return false;
      }
    }
    if (board.flat().length >= 9) {
      Ui.gameOver('Game is draw!');
      return false;
    }
    return true;
  };

  const updateBoard = (row, col) => {
    board[row][col] = Manager.curPlayer().symbol;
  };

  const checkBoard = (row, col) => {
    if (board[row][col]) {
      Ui.positionTaken();
      return false;
    }
    return true;
  };

  const setup = () => {
    for (let i = 1; i <= 3; i++) {
      for (let j = 1; j <= 3; j++) {
        const ele = document.querySelector(`tr:nth-child(${i}) td:nth-child(${j})`);
        ele.addEventListener('click', () => {
          if (checkBoard(i - 1, j - 1)) {
            Ui.clearMsg();
            updateBoard(i - 1, j - 1);
            ele.innerHTML = board[i - 1][j - 1];
            if (gameOn()) {
              Manager.toggler();
              Ui.displayTurn();
            }
          }
        });
      }
    }
  };

  return { board, setup };
})();

Manager.start();
