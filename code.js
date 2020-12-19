let rows = 30                       // init ligne
let cols = 30                       // init colonne

let autoPlaying = false                 // etat de jouer

const grid = new Array(rows)        // init grid
const nextGrid = new Array(rows)    // init grid clone

let generationNumber = 0            // generation numero

let timer                           // init le timer
const reproductionTime = 200        // durre entre 2 generations 200ms

// init le tableau de Grid
const initializeGrids = () => {
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

// reset grid valeur
const resetGrids =  () => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0
            nextGrid[i][j] = 0
        }
    }
}

// lire .txt file et prendre valeurs
const fileToText = (file, callback) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        callback(reader.result);
    };
}

// passer les valeurs de fichier dans le grid
const gridsByImport = (data) => {
    resetGrids()

    for (let i = 0; i < data.length; i++) {
        grid[data[i][0]][data[i][1]] = 1
    }
}

// passer noveau generation
const copyAndResetGrid = () => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j]
            nextGrid[i][j] = 0;
        }
    }
}

// generater file .txt pour exporter
function save(content, fileName, mime) {
    const blob = new Blob([content], {
        tipe: mime
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
}

// prendre valeurs et exporter
function exportGrids(size, grids) {
    let content = size.toString() + "\n"
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++) {
            if (grids[i][j] == 1) {
                content += `${i},${j};`
            }
        }
    }
    save(content.slice(0, -1), "data.txt", "text/plain")
}

// Dessiner grid sous forme de tableau
const createTable = () => {
    let gridContainer = document.getElementById('gridContainer')

    let table = document.createElement("table")
    table.setAttribute("id", "tableGrid");

    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr")
        for (let j = 0; j < cols; j++) {//
            let cell = document.createElement("td")
            cell.setAttribute("id", `${i}_${j}`)
            cell.setAttribute("class", "dead")
            cell.onclick = cellClickHandler
            tr.appendChild(cell)
        }
        table.appendChild(tr)
    }
    gridContainer.appendChild(table)
}

// Permettre clicker sur les cells pour activer ou deactiver
function cellClickHandler() {
    let rowcol = this.id.split("_");
    let row = rowcol[0];
    let col = rowcol[1];
    
    var classes = this.getAttribute("class");
    if(classes.indexOf("live") > -1) {
        this.setAttribute("class", "dead");
        grid[row][col] = 0;
    } else {
        this.setAttribute("class", "live");
        grid[row][col] = 1;
    }
    
}

// mettre a jour les classes
function updateView() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "_" + j);
            if (grid[i][j] == 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}

// installer les boutons
const setupControlButtons = () => {
    // bouton Auto Play
    const startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;
    
    // bouton Clear
    const clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;
    
    // bouton Prochaine Generation
    const nextButton = document.getElementById("nextGen")
    nextButton.onclick = computeNextGen

    // bouton Exporter
    const exportButton = document.getElementById("export")
    exportButton.onclick = exportHandler
}

// Auto Play/pauser/continuee le jeu
function startButtonHandler() {
    if (autoPlaying) {
        console.log("Pauser le jeu");
        autoPlaying = false;
        this.innerHTML = "Continuer";
        clearTimeout(timer);
    } else {
        console.log("Continuer le jeu");
        autoPlaying = true;
        this.innerHTML = "Pauser";
        autoPlay();
    }
}

// Auto Play
const autoPlay = () => {
    computeNextGen();
    
    if (autoPlaying) {
        timer = setTimeout(autoPlay, reproductionTime);
    }
}

// Export fichier
const exportHandler = () => {
    if(autoPlaying) {
        return alert("Pauser le jeu avant d'Exporter!!!!")
    } else {
        exportGrids(rows, grid)
    }
}

// clear tableau de grid
const clearButtonHandler = () => {
    autoPlaying = false;
    const startButton = document.getElementById('start');
    startButton.innerHTML = "Auto Play";    
    clearTimeout(timer);
    
    let cellsList = document.getElementsByClassName("live");
    // convert to array first, otherwise, you're working on a live node list
    // and the update doesn't work!
    let cells = [];
    for (let i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }
    
    for (let i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    resetGrids();
    generationNumber = 0
    document.getElementById("generation").innerHTML = generationNumber
}

// Prochaine Generation
const computeNextGen = () => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    
    // copy NextGrid grid et init nextGrid
    copyAndResetGrid();
    
    updateView();
    generationNumber++
    document.getElementById("generation").innerHTML = generationNumber
}

// REGLES
// Une cellule morte possédant exactement trois voisines vivantes devient vivante.
// Une cellule vivante possédant deux ou trois voisines vivantes reste vivante, sinon elle meurt.

const applyRules = (row, col) => {
    let numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2 || numNeighbors > 3) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
            if (numNeighbors == 3) {
                nextGrid[row][col] = 1;
            }
        }
    }

// calcule nombre de voisines
const countNeighbors = (row, col) => {
    let count = 0;
    if (row-1 >= 0) {
        if (grid[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < cols) {
        if (grid[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (grid[row][col-1] == 1) count++;
    }
    if (col+1 < cols) {
        if (grid[row][col+1] == 1) count++;
    }
    if (row+1 < rows) {
        if (grid[row+1][col] == 1) count++;
    }
    if (row+1 < rows && col-1 >= 0) {
        if (grid[row+1][col-1] == 1) count++;
    }
    if (row+1 < rows && col+1 < cols) {
        if (grid[row+1][col+1] == 1) count++;
    }
    return count;
}

// Initialiser
const initialize = () => {
    createTable()
    initializeGrids()
    resetGrids()
    setupControlButtons()
    document.getElementById("generation").innerHTML = generationNumber
    return console.log('Init')
}

// Reinitialiser apres importer
const initByImport = (data) => {
    createTable()
    initializeGrids()
    gridsByImport(data)
    setupControlButtons()
    updateView()
    document.getElementById("generation").innerHTML = generationNumber
    return console.log('Init')
}

// Init
window.onload = initialize()

// select input
const input = document.querySelector("#inputfile");

// Quand importer fichier
input.addEventListener("change", () => {
    const file = input.files.item(0);
    fileToText(file, (text) => {
        rows = cols = text.split("\n")[0]
        let data = text.split("\n")[1].split(";").map(e => e.split(","))
        
        var gridContainer = document.getElementById('gridContainer')
        var table = document.getElementById("tableGrid")
        gridContainer.removeChild(table)
        initByImport(data)
    });
    input.value = ''
});



