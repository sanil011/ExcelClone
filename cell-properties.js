// Storage

let sheetDB = [];

for (let i = 0; i < rows; i++){
    let sheetRow = [];
    for (let j = 0; j < cols; j++){
        let cellProp = {
            bold: false,
            italic: false,
            underline: false,
            alignment: "left",
            fontFamily: "monospace",
            fontSize: "14",
            fontColor: "#000000",
            BGcolor:"#000000"//just for indication purpose
        }
        sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
}

// Selectors for cell properties
let bold  = document.querySelector('.bold')
let italic  = document.querySelector('.italic')
let underline  = document.querySelector('.underline')
let fontSize  = document.querySelector('.font-size-prop')
let fontFamily = document.querySelector('.font-family-prop')
let fontColor = document.querySelector('.font-color-prop')
let BGcolor = document.querySelector('.BGcolor-prop');
let alignment = document.querySelectorAll('.alignment');
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

// let address = document.querySelector('.address-bar');
let activeColor = "#d1d8e0";
let inactiveColor = "#ecf0f1";
// Application for two-way binding
// Attach property listeners

bold.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);
    
    // Modification
    cellProp.bold = !cellProp.bold;
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    bold.style.backgroundColor = cellProp.bold ? activeColor : inactiveColor;
})
italic.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);
    
    // Modification
    cellProp.italic = !cellProp.italic;
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    italic.style.backgroundColor = cellProp.italic ? activeColor : inactiveColor;
})
underline.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);
    
    // Modification
    cellProp.underline = !cellProp.underline;
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    underline.style.backgroundColor = cellProp.underline ? activeColor : inactiveColor;
})

fontSize.addEventListener('change', (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

     // Modification
    cellProp.fontSize = fontSize.value;//Data change
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;
})
fontFamily.addEventListener('change', (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

     // Modification
    cellProp.fontFamily = fontFamily.value;//Data change
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;
})

fontColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    cellProp.fontColor = fontColor.value; // Data change
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
})
BGcolor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    cellProp.BGcolor = BGcolor.value; // Data change
    cell.style.backgroundColor = cellProp.BGcolor;
    BGcolor.value = cellProp.BGcolor;
})

alignment.forEach((align) => {
    align.addEventListener('click', (e) => {
        let address = addressBar.value;
        let [cell, cellProp] = decodeRIDCIDFromAddress(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue;
        cell.style.textAlign = cellProp.alignment;

        switch (alignValue) {
            case 'left':
                leftAlign.style.backgroundColor = activeColor;
                centerAlign.style.backgroundColor = inactiveColor;
                rightAlign.style.backgroundColor = inactiveColor;
                break;
            case 'right':
                leftAlign.style.backgroundColor = inactiveColor;
                centerAlign.style.backgroundColor = inactiveColor;
                rightAlign.style.backgroundColor = activeColor;
                break;
            case 'center':
                leftAlign.style.backgroundColor = inactiveColor;
                centerAlign.style.backgroundColor = activeColor;
                rightAlign.style.backgroundColor = inactiveColor;
                break;
        }
    })
})

let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
    addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell) {
    // Work
    cell.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [rid, cid] = decodeRIDCIDFromAddress(address);
        let cellProp = sheetDB[rid][cid];

        // Apply cell Properties
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor === "#000000" ? "transparent" : cellProp.BGcolor;
        cell.style.textAlign = cellProp.alignment;


        // Apply properties UI Props container
        bold.style.backgroundColor = cellProp.bold ? activeColor : inactiveColor;
        italic.style.backgroundColor = cellProp.italic ? activeColor : inactiveColor;
        underline.style.backgroundColor = cellProp.underline ? activeColor : inactiveColor;
        fontColor.value = cellProp.fontColor;
        BGcolor.value = cellProp.BGcolor;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        switch (cellProp.alignment) { // UI change (2)
            case "left":
                leftAlign.style.backgroundColor = activeColor;
                centerAlign.style.backgroundColor = inactiveColor;
                rightAlign.style.backgroundColor = inactiveColor;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColor;
                centerAlign.style.backgroundColor = activeColor;
                rightAlign.style.backgroundColor = inactiveColor;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColor;
                centerAlign.style.backgroundColor = inactiveColor;
                rightAlign.style.backgroundColor = activeColor;
                break;
        }

        // let formulaBar = document.querySelector(".formula-bar");
        // formulaBar.value = cellProp.formula;
        // cell.innerText = cellProp.value;
    })
}

function activeCell(address) {
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    // Access cell & storage
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp = sheetDB[rid][cid];
    return [cell, cellProp];
}

function decodeRIDCIDFromAddress(address) {
    // Address -> A1
    let rid = Number(address.slice(1) - 1);//"1" -> 0
    let cid = Number(address.charCodeAt(0)) - 65; //"A" -> 65

    return [rid,cid]
}