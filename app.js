// basic parameters
const SIZE = 12;

let grid = document.getElementById("grid");

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
      cell.setAttribute("class", "cell col-1");
      cell.setAttribute("id", idCount);
      cell.setAttribute("style", `background-color: white;`);
      cell.innerText = " ";
      // hightlight current cell
      cell.addEventListener("mouseenter", () => {
        cell.setAttribute("class", "cell col-1 hover");
      });
      // un-hightlight current cell
      cell.addEventListener("mouseleave", () => {
        cell.setAttribute("class", "cell col-1");
      });
      // redraw whole grid on mouse movement into new cell
      cell.addEventListener("click", (event) => {
        toggleCell(event.target.id);
        // draw next gen
        draw(calcNewState(currentState));
      });
      newRow.append(cell);
      idCount++;
    }
  }
  draw(state);
}

// toggle cell the mouse pointer enters
function toggleCell(id) {
  let idCount = 0;
  for (let row = 1; row <= SIZE; row++) {
    for (column = 1; column <= SIZE; column++) {
      if (idCount == id) {
        if (currentState[row][column] == 0) {
          currentState[row][column] = 1;
          return;
        } else {
          currentState[row][column] = 0;
          return;
        }
      } else {
        idCount++;
      }
    }
  }
}

// generate a new state based on the current one and Conway's rules
function calcNewState(state) {
  // create new temporary state
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
  // update working state with the temp
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
          `background-color: #${newColor}; aspect-ratio: 1/ 1;`
        );
      }
      // draw a dead cell
      if (state[row][column] == 0) {
        let cell = document.getElementById(idCount);
        cell.setAttribute(
          "style",
          `background-color: white; aspect-ratio: 1/ 1;`
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
  let r = 32;
  let g = 128;
  let b = randomInt(128) + 127;
  // make a string of hex values
  return [r, g, b].map((value) => value.toString(16).padStart(2, 0)).join("");
}

function randomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}
