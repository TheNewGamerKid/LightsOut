const shapes9 = [
  `111111111011100100000000000001000100001000100000010000010000010001111100000000000`,
  `111111111011100100000000000001000100001000100000000000001111100010000010000000000`,
  `000000000000111000001111100011000110011011110011000110001111100000111000000000000`,
  `000000000000111000001000100010000010010000010010000010001000100000111000000000000`,
  `000000000000010000000010000000111000000111000001111100001111100001111100000000000`,
  `000000000010000000011000000011100000011110000011111000011111100011111110000000000`,
  `000000000000000100000000010011000010011111100001111100001000100001000100000000000`,
  `000000000000010000000010000000111000000111000001111100001111100000010000000010000`,
];
const shapes7 = [
  `0000000001010000101000000000010001000111000000000`,
  `0000000001010000101000000000001110001000100000000`,
  `0000000001110001000100100010010001000111000000000`,
  `0000000001110001111100111110011111000111000000000`,
  `0000000000100000010000011100001110001111100000000`,
  `0000000010000001100000111000011110001111100000000`,
  `0000000001110001111100001000000100000010000001000`,
  `0000000001110001111100111110011111000010000001000`,
];
const shapes5 = [
  `0101000000100010111000000`,
  `0101000000011101000100000`,
  `0000001110011100111000000`,
  `0000001000011000111000000`,
  `0000001100111101111100000`,
  `0010001110011100111000100`,
];
let game = document.querySelector('#game');
const homeBtn = document.querySelector('#title');
let history = [];
const chance = 0.35;

window.isDev = false;

const undoHandler = (size) => {
  console.log(history);
  if (history.length > 1) {
    history.pop();

    const gameBoard = document.querySelector('.game-board');
    gameBoard.innerHTML = '';
    const prevState = history[history.length - 1].split('');
    let numLoops = 0;
    for (let i = 0; i < size; i++) {
      gameBoard.innerHTML += `
        <div id="row${i + 1}">
        </div>
      `;
      const row = document.querySelector(`#row${i + 1}`);
      for (let j = 0; j < size; j++) {
        row.innerHTML += `
          <button id="column${j + 1} row${
          i + 1
        }" class="game-btn size-${size} ${
          prevState[numLoops] === '1' ? 'on' : 'off'
        }">
          </button>
        `;
        numLoops++;
      }
    }

    const btns = document.querySelectorAll('.game-btn');
    for (let btn of btns) {
      btn.addEventListener('click', updateGame);
    }
  }
};

const resetHandler = (size) => {
  const gameBoard = document.querySelector('.game-board');
  gameBoard.innerHTML = '';
  const prevState = history[0].split('');
  let numLoops = 0;
  for (let i = 0; i < size; i++) {
    gameBoard.innerHTML += `
      <div id="row${i + 1}">
      </div>
    `;
    const row = document.querySelector(`#row${i + 1}`);
    for (let j = 0; j < size; j++) {
      row.innerHTML += `
        <button id="column${j + 1} row${i + 1}" class="game-btn size-${size} ${
        prevState[numLoops] === '1' ? 'on' : 'off'
      }">
        </button>
      `;
      numLoops++;
    }
  }
  const btns = document.querySelectorAll('.game-btn');
  let curGameState = '';
  history = [];
  for (let btn of btns) {
    curGameState += btn.classList[2] === 'on' ? '1' : '0';
    btn.addEventListener('click', updateGame);
  }

  history.push(curGameState);
};

const renderGame = (size, gameMode) => {
  let state = gameMode === 'match' ? 'off' : '';

  game.innerHTML = `
    <div class="game-board" id="game-board">

    </div>
    <div class="btn-container s-${size}">
      <button class="undo btn" id="undo">
        Undo
      </button>
      ${
        gameMode === 'match'
          ? `
        <div id="match-container">
        </div>
      `
          : ''
      }
      <button class="undo btn" id="reset">
        Reset
      </button>
    </div>
  `;

  const gameBoard = document.querySelector('.game-board');
  for (let i = 0; i < size; i++) {
    gameBoard.innerHTML += `
      <div id="row${i + 1}">
      </div>
    `;
    const row = document.querySelector(`#row${i + 1}`);
    for (let j = 0; j < size; j++) {
      state =
        gameMode === 'classic'
          ? Math.random() < chance
            ? 'on'
            : 'off'
          : 'off';
      row.innerHTML += `
        <button id="column${j + 1} row${
        i + 1
      }" class="game-btn size-${size} ${state}">
        </button>
      `;
    }
  }

  const undo = document.querySelector('#undo');
  undo.addEventListener('click', () => {
    undoHandler(size);
  });

  const reset = document.querySelector('#reset');
  reset.addEventListener('click', () => {
    resetHandler(size);
  });
};

const gameButtonHandler = (e) => {
  let size = e.target.value;

  game.style.flexDirection = 'column';
  renderGame(size, 'classic');

  const btns = document.querySelectorAll('.game-btn');
  let curGameState = '';
  history = [];
  for (let btn of btns) {
    curGameState += btn.classList[2] === 'on' ? '1' : '0';
    btn.addEventListener('click', updateGame);
  }

  history.push(curGameState);
};

const toggleState = (col, row) => {
  const btn = document.getElementById(`column${col} row${row}`);
  if (btn !== null) {
    const btnState = btn.classList[2];
    btn.classList.remove(btnState);
    btn.classList.add(btnState === 'on' ? 'off' : 'on');
  }
};

const updateGame = (e) => {
  let id = e.target.id;
  const row = parseInt(id.slice(id.indexOf(' ') + 4, id.length));
  const column = parseInt(id.slice(6, id.indexOf(' ')));

  toggleState(column + 1, row);
  toggleState(column, row + 1);
  toggleState(column - 1, row);
  toggleState(column, row - 1);
  toggleState(column, row);

  const gameBtns = document.querySelectorAll('.game-btn');
  let curGameState = '';
  for (let btn of gameBtns) {
    curGameState += btn.classList[2] === 'on' ? '1' : '0';
  }

  history.push(curGameState);

  const matchContainer = document.querySelector('#match-container');
  if (matchContainer === null) {
    classicWinCheck();
  } else {
    matchWinCheck();
  }
};

const modeBtnHandler = (e) => {
  game.style.flexDirection = 'row';
  game.innerHTML = `
    <button class="difficulty btn" value="5">
      5 x 5
    </button>
    <button class="difficulty btn" value="7">
      7 x 7
    </button>
    <button class="difficulty btn" value="9">
      9 x 9
    </button>
  `;

  if (e.target.value === 'classic') {
    const buttons = document.querySelectorAll('.difficulty');
    for (let btn of buttons) {
      btn.addEventListener('click', gameButtonHandler);
    }
  } else {
    const buttons = document.querySelectorAll('.difficulty');
    for (let btn of buttons) {
      btn.addEventListener('click', matchBtnHandler);
    }
  }
};

const modeRender = () => {
  game.innerHTML = `
    <div class="mode-container">
      <button class="mode btn" value="classic">
        Classic
      </button>
      <button class="mode btn" value="match">
        Match
      </button>
    </div>
  `;

  const modeBtns = document.querySelectorAll('.mode');
  for (let btn of modeBtns) {
    btn.addEventListener('click', modeBtnHandler);
  }
};

const matchWinCheck = () => {
  const gameBtns = document.querySelectorAll('.game-btn');
  const matchBtns = document.querySelectorAll('.match-btn');
  let winStatus = true;

  for (let i = 0; i < gameBtns.length; i++) {
    let matchClass = matchBtns[i].classList[2];
    let gameClass = gameBtns[i].classList[2];
    if (matchClass === gameClass) {
    } else {
      winStatus = false;
      break;
    }
  }

  if (winStatus === true) {
    const body = document.querySelector('body');
    body.innerHTML = `
      <div id="title">
        You Win!
      </div>
      <button class="undo btn" id="restart">
        Restart
      </button>
      <script src="lights-out.js"></script>
    `;

    const restartBtn = document.querySelector('#restart');
    restartBtn.addEventListener('click', () => {
      body.innerHTML = `
        <button id="title">
          Lights Out
        </button>
        <div id="game">

        </div>
        <script src="lights-out.js"></script>
      `;

      history = [];
      console.log(history);
      game = document.querySelector('#game');

      modeRender();
    });
  }
};

const classicWinCheck = () => {
  const gameBtns = document.querySelectorAll('.game-btn');
  let winStatus = true;
  for (let btn of gameBtns) {
    let state = btn.classList[2];
    if (state === 'on') {
      winStatus = false;
      break;
    }
  }

  if (winStatus === true) {
    const body = document.querySelector('body');
    body.innerHTML = `
      <div id="title">
        You Win!
      </div>
      <button class="undo btn" id="restart">
        Restart
      </button>
      <script src="lights-out.js"></script>
    `;

    const restartBtn = document.querySelector('#restart');
    restartBtn.addEventListener('click', () => {
      body.innerHTML = `
        <button id="title">
          Lights Out
        </button>
        <div id="game">

        </div>
        <script src="lights-out.js"></script>
      `;

      game = document.querySelector('#game');

      modeRender();
    });
  }
};

homeBtn.addEventListener('click', modeRender);

modeRender();

const matchBtnHandler = (e) => {
  let numLoops = 0;
  let size = e.target.value;
  const shape =
    e.target.value == 5
      ? shapes5[Math.floor(Math.random() * shapes5.length)]
      : e.target.value == 7
      ? shapes7[Math.floor(Math.random() * shapes7.length)]
      : shapes9[Math.floor(Math.random() * shapes9.length)];

  game.style.flexDirection = 'column';
  renderGame(size, 'match');
  const matchCntr = document.querySelector('#match-container');
  matchCntr.innerHTML = `
    <div class="game-board" id="match-board">
    </div>
  `;
  const shapeArr = shape.split('');
  const matchBoard = document.querySelector('#match-board');
  for (let i = 0; i < size; i++) {
    matchBoard.innerHTML += `
      <div id="match-row${i + 1}" style="display: flex">
      </div>
    `;
    const row = document.querySelector(`#match-row${i + 1}`);
    for (let j = 0; j < size; j++) {
      row.innerHTML += `
        <div id="match column${j + 1} row${
        i + 1
      }" class="match-btn match-size-${size} ${
        shapeArr[numLoops] === '1' ? 'on' : 'off'
      }">
        </div>
      `;
      numLoops++;
    }
  }
  const btns = document.querySelectorAll('.game-btn');
  let curGameState = '';
  history = [];
  for (let btn of btns) {
    curGameState += btn.classList[2] === 'on' ? '1' : '0';
    btn.addEventListener('click', updateGame);
  }

  history.push(curGameState);
};
