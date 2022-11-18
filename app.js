const SIZE = 16;
let grid = document.getElementById("grid");
const GRIDWIDTH = 800;
grid.setAttribute("width", `${GRIDWIDTH}px`);
let padding = 0;

let initialState = new Array(SIZE).fill(0);
for (let i = 0; i < SIZE; i++) {
  initialState[i] = new Array(SIZE).fill(0);
}
let currentState = initialState;

let body = document.querySelector("body");
body.addEventListener("load", buildStructure(initialState));

function buildStructure(state) {
  let size = state.length;
  let idCount = 0;
  for (let row = 0; row < size; row++) {
    let newRow = document.createElement("div");
    newRow.setAttribute("class", "row");
    grid.append(newRow);
    for (let column = 0; column < size; column++) {
      let cell = document.createElement("div");
      cell.setAttribute("class", "cell");
      cell.setAttribute("id", idCount); // ?
      idCount++;
      padding = (GRIDWIDTH - 2 * size) / (2 * size); // border = 1px * 2
      cell.setAttribute("style", `padding:${padding}px`);
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
  let NewState = state;
  // calc
  // ...
  return NewState;
}

function draw(state) {
  let idCount = 0;
  for (let row = 0; row < state.length; row++) {
    for (column = 0; column < state.length; column++) {
      // draw a live cell
      if (state[row][column] == 0) {
        let newColor = randomColor();
        let cell = document.getElementById(idCount); // ?
        cell.setAttribute(
          "style",
          `padding:0;
          background-color: #${newColor};
          width:${2 * padding}px;
          min-height: ${2 * padding}px;`
        );
      }
      idCount++;
    }
  }
}

// button to reset
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
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
