let gridDisplay = document.querySelector("#gridDisplay")
let rulesDisplay = document.querySelector("#rules")
let settings = document.querySelector("form")
let gridWidth = document.querySelector("#gridWidth")
let isolation = document.querySelector("#isolation")
let overdose = document.querySelector("#overdose")
let birth = document.querySelector("#birth")
let occurrence = document.querySelector("#occurrence")
let color = document.querySelector("#cellColor")
let bGroundColor = document.querySelector("#bgColor")
let delay = document.querySelector("#delay")
let stepDisplay = document.querySelector("#stepDisplay")
let footer = document.querySelector("footer")

let gridSize = 0
let activeCellArray = []
let inactiveCellArray = []
let colorCounter = 0
let square = 0
let counter = 0
let cellColor
let bgColor

function gridCreation() {
    cellColor = hexToRGB(color.value)
    bgColor = hexToRGB(bGroundColor.value)
    gridDisplay.replaceChildren()
    let gridHeight = Math.floor(parseInt(gridWidth.value) / 2)
    gridSize = gridWidth.value * gridHeight
    gridDisplay.style.gridTemplateColumns = `repeat(${gridWidth.value}, 1fr)`
    gridDisplay.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`
    for (let i = 0; i < gridSize; i++) {
        square = document.createElement("div")
        gridDisplay.appendChild(square)
        square.setAttribute("id", `square${i}`)
        square.style.backgroundColor = bgColor
        square.addEventListener("click", function () {
            if (this.style.backgroundColor == bgColor) {
                this.style.backgroundColor = cellColor
            } else {
                this.style.backgroundColor = bgColor
            }
        })
    }
}

const hexToRGB = (hex) => {
    let alpha = false,
        h = hex.slice(hex.startsWith("#") ? 1 : 0);
    if (h.length === 3) h = [...h].map((x) => x + x).join("");
    else if (h.length === 8) alpha = true;
    h = parseInt(h, 16);
    return (
        "rgb" +
        (alpha ? "a" : "") +
        "(" +
        (h >>> (alpha ? 24 : 16)) +
        ", " +
        ((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
        ", " +
        ((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)) +
        (alpha ? `, ${h & 0x000000ff}` : "") +
        ")"
    );
};

settings.addEventListener("submit", (e) => {
    e.preventDefault()
    rulesDisplay.style.display = "none"
    settings.style.display = "none"
    gridDisplay.style.display = "grid"
    footer.style.display = "flex"
    gridCreation()
})

document.querySelector("#start").addEventListener("click", () => {
    counter = 0
    stepDisplay.textContent = `Etapes : ${counter}`
    step()
})

document.querySelector("#random").addEventListener("click", randomize)

document.querySelector("#reset").addEventListener("click", () => {
    location.reload()
})

function randomize() {
    let random = 0
    for (let i = 0; i < gridSize; i++) {
        random = Math.floor(Math.random() * 2)
        if (random == 1) {
            document.getElementById(`square${i}`).style.backgroundColor = cellColor
        }
    }
}

function step() {
    squareColorCheck()
    activeSquarePerimeterCheck()
    inactiveSquarePerimeterCheck()
    changeCells()
}

function squareColorCheck() {
    for (let i = 0; i < gridSize; i++) {
        if (document.getElementById(`square${i}`).style.backgroundColor == cellColor) {
            activeCellArray.push(i)
        } else if (document.getElementById(`square${i}`).style.backgroundColor == bgColor) {
            inactiveCellArray.push(i)
        }
    }
}

function activeSquarePerimeterCheck() {
    for (let i = 0; i < activeCellArray.length; i++) {
        for (let j = (parseInt(gridWidth.value) - 1); j <= (parseInt(gridWidth.value) + 1); j++) {
            if (document.getElementById(`square${activeCellArray[i] - j}`) != null) {
                if (document.getElementById(`square${activeCellArray[i] - j}`).style.backgroundColor == cellColor) {
                    colorCounter++
                }
            }
            if (document.getElementById(`square${activeCellArray[i] + j}`) != null) {
                if (document.getElementById(`square${activeCellArray[i] + j}`).style.backgroundColor == cellColor) {
                    colorCounter++
                }
            }
        }
        if (document.getElementById(`square${activeCellArray[i] - 1}`) != null) {
            if (document.getElementById(`square${activeCellArray[i] - 1}`).style.backgroundColor == cellColor) {
                colorCounter++
            }
        }
        if (document.getElementById(`square${activeCellArray[i] + 1}`) != null) {
            if (document.getElementById(`square${activeCellArray[i] + 1}`).style.backgroundColor == cellColor) {
                colorCounter++
            }
        }
        createDeath(document.getElementById(`square${activeCellArray[i]}`))
        colorCounter = 0
    }
}

function inactiveSquarePerimeterCheck() {
    for (let i = 0; i < inactiveCellArray.length; i++) {
        for (let j = (parseInt(gridWidth.value) - 1); j <= (parseInt(gridWidth.value) + 1); j++) {
            if (document.getElementById(`square${inactiveCellArray[i] - j}`) != null) {
                if (document.getElementById(`square${inactiveCellArray[i] - j}`).style.backgroundColor == cellColor) {
                    colorCounter++
                }
            }
            if (document.getElementById(`square${inactiveCellArray[i] + j}`) != null) {
                if (document.getElementById(`square${inactiveCellArray[i] + j}`).style.backgroundColor == cellColor) {
                    colorCounter++
                }
            }
        }
        if (document.getElementById(`square${inactiveCellArray[i] - 1}`) != null) {
            if (document.getElementById(`square${inactiveCellArray[i] - 1}`).style.backgroundColor == cellColor) {
                colorCounter++
            }
        }
        if (document.getElementById(`square${inactiveCellArray[i] + 1}`) != null) {
            if (document.getElementById(`square${inactiveCellArray[i] + 1}`).style.backgroundColor == cellColor) {
                colorCounter++
            }
        }
        createLife(document.getElementById(`square${inactiveCellArray[i]}`))
        colorCounter = 0
    }
}

function createLife(square) {
    if (colorCounter == parseInt(birth.value)) {
        square.classList.add("toLive")
    }
}

function createDeath(square) {
    if (colorCounter < parseInt(isolation.value) || colorCounter > parseInt(overdose.value)) {
        square.classList.add("toDie")
    }
}

function changeCells() {
    counter++
    if (counter <= parseInt(occurrence.value)) {
        let dyingCells = document.querySelectorAll(".toDie")
        let livingCells = document.querySelectorAll(".toLive")
        dyingCells.forEach(element => {
            element.style.backgroundColor = bgColor
        });
        livingCells.forEach(element => {
            element.style.backgroundColor = cellColor
        })
        stepDisplay.textContent = `Etapes : ${counter}`
        reset()
    }
}

function reset() {
    activeCellArray = []
    inactiveCellArray = []
    let deadCells = document.querySelectorAll(".toDie")
    let newCells = document.querySelectorAll(".toLive")
    deadCells.forEach(element => {
        element.classList.remove("toDie")
    })
    newCells.forEach(element => {
        element.classList.remove("toLive")
    })
    setTimeout(step, (parseInt(delay.value)))
}