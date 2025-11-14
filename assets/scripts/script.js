let gridDisplay = document.querySelector("#gridDisplay")
let rulesDisplay = document.querySelector("#rules")
let settings = document.querySelector("form")
let gridWidth = document.querySelector("#gridWidth")
let isolation = document.querySelector("#isolation")
let overdose = document.querySelector("#overdose")
let birth = document.querySelector("#birth")
let occurrence = document.querySelector("#occurrence")
let delay = document.querySelector("#delay")
let stepDisplay = document.querySelector("#stepDisplay")
let footer = document.querySelector("footer")

let gridSize = 0
let blackSquareArray = []
let whiteSquareArray = []
let blackCounter = 0
let square = 0
let counter = 0

function gridCreation() {
    gridDisplay.replaceChildren()
    let gridHeight = Math.floor(parseInt(gridWidth.value) / 2)
    gridSize = gridWidth.value * gridHeight
    gridDisplay.style.gridTemplateColumns = `repeat(${gridWidth.value}, 1fr)`
    gridDisplay.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`
    for (let i = 0; i < gridSize; i++) {
        square = document.createElement("div")
        gridDisplay.appendChild(square)
        square.setAttribute("id", `square${i}`)
        square.style.backgroundColor = "white"
        square.addEventListener("click", function () {
            if (this.style.backgroundColor == "white") {
                this.style.backgroundColor = "black"
            } else {
                this.style.backgroundColor = "white"
            }
        })
    }
}

settings.addEventListener("submit", (e) => {
    e.preventDefault()
    rulesDisplay.style.display = "none"
    settings.style.display = "none"
    gridDisplay.style.display = "grid"
    footer.style.display = "block"
    gridCreation()
})

document.querySelector("#start").addEventListener("click", step)

document.querySelector("#random").addEventListener("click", randomize)

document.querySelector("#reset").addEventListener("click", () => {
    location.reload()
})

function randomize() {
    let random = 0
    for (let i = 0; i < gridSize; i++) {
        random = Math.floor(Math.random() * 2)
        if (random == 1) {
            document.getElementById(`square${i}`).style.backgroundColor = "black"
        }
    }
}

function step() {

    squareColorCheck()
    blackSquarePerimeterCheck()
    whiteSquarePerimeterCheck()
    changeCells()
}

function squareColorCheck() {
    for (let i = 0; i < gridSize; i++) {
        if (document.getElementById(`square${i}`).style.backgroundColor == "black") {
            blackSquareArray.push(i)
        } else if (document.getElementById(`square${i}`).style.backgroundColor == "white") {
            whiteSquareArray.push(i)
        }
    }
}

function blackSquarePerimeterCheck() {
    for (let i = 0; i < blackSquareArray.length; i++) {
        for (let j = (parseInt(gridWidth.value) - 1); j <= (parseInt(gridWidth.value) + 1); j++) {
            if (document.getElementById(`square${blackSquareArray[i] - j}`) != null) {
                if (document.getElementById(`square${blackSquareArray[i] - j}`).style.backgroundColor == "black") {
                    blackCounter++
                }
            }
            if (document.getElementById(`square${blackSquareArray[i] + j}`) != null) {
                if (document.getElementById(`square${blackSquareArray[i] + j}`).style.backgroundColor == "black") {
                    blackCounter++
                }
            }
        }
        if (document.getElementById(`square${blackSquareArray[i] - 1}`) != null) {
            if (document.getElementById(`square${blackSquareArray[i] - 1}`).style.backgroundColor == "black") {
                blackCounter++
            }
        }
        if (document.getElementById(`square${blackSquareArray[i] + 1}`) != null) {
            if (document.getElementById(`square${blackSquareArray[i] + 1}`).style.backgroundColor == "black") {
                blackCounter++
            }
        }
        createDeath(document.getElementById(`square${blackSquareArray[i]}`), blackCounter)
        blackCounter = 0
    }
}

function whiteSquarePerimeterCheck() {
    for (let i = 0; i < whiteSquareArray.length; i++) {
        for (let j = (parseInt(gridWidth.value) - 1); j <= (parseInt(gridWidth.value) + 1); j++) {
            if (document.getElementById(`square${whiteSquareArray[i] - j}`) != null) {
                if (document.getElementById(`square${whiteSquareArray[i] - j}`).style.backgroundColor == "black") {
                    blackCounter++
                }
            }
            if (document.getElementById(`square${whiteSquareArray[i] + j}`) != null) {
                if (document.getElementById(`square${whiteSquareArray[i] + j}`).style.backgroundColor == "black") {
                    blackCounter++
                }
            }
        }
        if (document.getElementById(`square${whiteSquareArray[i] - 1}`) != null) {
            if (document.getElementById(`square${whiteSquareArray[i] - 1}`).style.backgroundColor == "black") {
                blackCounter++
            }
        }
        if (document.getElementById(`square${whiteSquareArray[i] + 1}`) != null) {
            if (document.getElementById(`square${whiteSquareArray[i] + 1}`).style.backgroundColor == "black") {
                blackCounter++
            }
        }
        createLife(document.getElementById(`square${whiteSquareArray[i]}`), blackCounter)
        blackCounter = 0
    }
}

function createLife(square, counter) {
    if (counter == parseInt(birth.value)) {
        square.classList.add("toLive")
    }
}

function createDeath(square, counter) {
    if (counter < parseInt(isolation.value) || counter > parseInt(overdose.value)) {
        square.classList.add("toDie")
    }
}

function changeCells() {
    counter++
    if (counter <= parseInt(occurrence.value)) {
        let dyingCells = document.querySelectorAll(".toDie")
        let livingCells = document.querySelectorAll(".toLive")
        dyingCells.forEach(element => {
            element.style.backgroundColor = "white"
        });
        livingCells.forEach(element => {
            element.style.backgroundColor = "black"
        })
        stepDisplay.textContent = counter
        reset()
    }
}

function reset() {
    blackSquareArray = []
    whiteSquareArray = []
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