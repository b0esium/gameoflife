// basic parameters
const SIZE = 8;
const GRIDWIDTH = 800;

let grid = document.getElementById("grid");
grid.setAttribute("width", `${GRIDWIDTH}px`);
let padding = (GRIDWIDTH - 2 * SIZE) / (2 * SIZE); // border = 1px * 2

let currentState = new Array();

let body = document.querySelector("body");
body.addEventListener("load", buildStructure(initializeState()));

// create a new state with a random number of live cells
function initializeState() {
  // virtual grid with 1 row or column of dead cells around each side
  let initialState = new Array(SIZE + 2).fill(0);
  for (let i = 0; i < SIZE + 2; i++) {
    initialState[i] = new Array(SIZE + 2).fill(0);
  }

  // create random seed
  const liveCells = SIZE * randomInt(2) + 8;
  for (let i = 0; i <= liveCells; i++) {
    // inside real grid
    let row = randomInt(SIZE - 2) + 1;
    let column = randomInt(SIZE - 2) + 1;
    initialState[row][column] = 1;
  }

  // deep clone initial state array into working array
  currentState = initialState.map((row) => [...row]);

  return initialState;
}

// build DOM
function buildStructure(state) {
  let idCount = 0;
  for (let row = 1; row <= SIZE; row++) {
    let newRow = document.createElement("div");
    newRow.setAttribute("class", "row");
    grid.append(newRow);
    for (let column = 1; column <= SIZE; column++) {
      let cell = document.createElement("div");
      cell.setAttribute("class", "cell");
      cell.setAttribute("id", idCount);
      idCount++;
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
  draw(state);
}

// generate a new state based on the current one and Conway's rules
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
    }
  }
  // update state
  currentState = newState.map((row) => [...row]);
  return newState;
}

// update cell colours according to liveness
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
  draw(initializeState());
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
