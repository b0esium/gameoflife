const SIZE = 8;
let grid = document.getElementById("grid");
const GRIDWIDTH = 800;
grid.setAttribute("width", `${GRIDWIDTH}px`);
let padding = 0;

// virtual grid with 1 row or column of padding around each side
let initialState = new Array(SIZE + 2).fill(0);
for (let i = 0; i < SIZE + 2; i++) {
  initialState[i] = new Array(SIZE + 2).fill(0);
}

// fake seed
initialState[1][1] = 1;
initialState[1][3] = 1;
initialState[1][4] = 1;
initialState[2][1] = 1;
initialState[2][4] = 1;

// deep clone
let currentState = initialState.map((row) => [...row]);

let body = document.querySelector("body");
body.addEventListener("load", buildStructure(initialState));

function buildStructure(state) {
  let size = state.length;
  let idCount = 0;
  for (let row = 1; row < size - 1; row++) {
    let newRow = document.createElement("div");
    newRow.setAttribute("class", "row");
    grid.append(newRow);
    for (let column = 1; column < size - 1; column++) {
      let cell = document.createElement("div");
      cell.setAttribute("class", "cell");
      cell.setAttribute("id", idCount); // ?
      idCount++;
      padding = (GRIDWIDTH - 2 * size) / (2 * size); // border = 1px * 2
      cell.setAttribute(
        "style",
        `padding:${padding}px; background-color: white;`
      );
      cell.innerText = " ";
      // redraw whole grid on mouse movement into new cell
      cell.addEventListener("mouseenter", () => {
        draw(calcNewState(currentState));
      });
      newRow.append(cell);
    }
  }
}

function calcNewState(state) {
  // toggle current mouse pointer cell
  // let idCount = 0;
  // for (let row = 1; row < state.length - 1; row++) {
  //   for (column = 1; column < state.length - 1; column++) {
  //     if (idCount == id) {
  //       state[row][column] == 0
  //         ? (state[row][column] = 1)
  //         : (state[row][column] = 0);
  //     } else {
  //       idCount++;
  //     }
  //   }
  // }

  // calculate new grid
  let newState = state.map((row) => [...row]);
  // debug
  let idCount = 0;
  for (let row = 1; row < state.length - 1; row++) {
    for (column = 1; column < state.length - 1; column++) {
      // count living cells among 8 neighbours
      let livingNeighbours =
        state[row - 1][column - 1] +
        state[row - 1][column] +
        state[row - 1][column + 1] +
        state[row][column - 1] +
        state[row][column + 1] +
        state[row + 1][column - 1] +
        state[row + 1][column] +
        state[row + 1][column + 1];

      // apply Conway's rules
      if (livingNeighbours == 3) {
        newState[row][column] = 1;
      } else if (livingNeighbours == 2) {
        if (state[row][column] == 1) {
          newState[row][column] = 1;
        } else {
          newState[row][column] = 0;
        }
      } else {
        newState[row][column] = 0;
      }
      // debug
      let cell = document.getElementById(idCount);
      cell.innerText = livingNeighbours;
      idCount++;
    }
  }
  currentState = newState.map((row) => [...row]);
  return newState;
}

function draw(state) {
  let idCount = 0;
  for (let row = 1; row < state.length - 1; row++) {
    for (column = 1; column < state.length - 1; column++) {
      // draw a live cell
      if (state[row][column] == 1) {
        let newColor = randomColor();
        let cell = document.getElementById(idCount);
        cell.setAttribute(
          "style",
          `padding:0;
          background-color: #${newColor};
          width:${2 * padding}px;
          min-height: ${2 * padding}px;`
        );
      }
      // draw a dead cell
      if (state[row][column] == 0) {
        let cell = document.getElementById(idCount);
        cell.setAttribute(
          "style",
          `padding:0;
          background-color: white;
          width:${2 * padding}px;
          min-height: ${2 * padding}px;`
        );
      }
      idCount++;
    }
  }
}

// button to reset grid
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
  currentState = initialState.map((row) => [...row]);
  draw(initialState);
});

function randomColor() {
  let r = randomInt(255);
  let g = randomInt(255);
  let b = randomInt(255);
  // make a string of hex values
  return [r, g, b].map((value) => value.toString(16).padStart(2, 0)).join("");
}

function randomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}
