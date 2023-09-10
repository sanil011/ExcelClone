let ctrlKey;

document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey || e.metaKey;
    console.log(ctrlKey)
})
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey || e.metaKey;
    console.log(ctrlKey)
})

for (let i = 0; i < rows; i++){
    for (let j = 0; j < cols; j++){
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectCell(cell);
    }
}

let copyBtn = document.querySelector('.copy');
let cutBtn = document.querySelector('.cut');
let pasteBtn = document.querySelector('.paste');

let rangeStorage = [];
function handleSelectCell(cell) {
    cell.addEventListener("click", (e) => {
        // Select range work
        if (!ctrlKey || !e.metaKey) return;
        if (rangeStorage.length >= 2) {
            defaultSelectedCellsUI();
            rangeStorage = [];
        }

        // UI
        cell.style.border = '3px solid #218c74';

        let rid = Number(cell.getAttribute('rid'));
        let cid = Number(cell.getAttribute('cid'));
        rangeStorage.push([rid, cid]);
    })
}

function defaultSelectedCellsUI() {
    for (let i = 0; i < rangeStorage.length; i++){
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][i]}"]`);
        cell.style.border = "1px solid lightgrey";
    }
}

let copyData = [];
copyBtn.addEventListener("click", (e) => {
    if (rangeStorage.length < 2) return;
    copyData = [];

    let [strow, stcol, endrow, endcol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];
    for (let i = strow; i <= endrow; i++){
        let copyRow = [];
        for (let j = stcol; j <= endcol; j++){
            console.log(i, j);
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    defaultSelectedCellsUI();
})


cutBtn.addEventListener('click', (e) => {
    console.log(sheetDB[0][0])
    if (rangeStorage.length < 2) return;
    copyData = [];
    let [strow, stcol, endrow, endcol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];

    for (let i = strow; i <= endrow; i++) {
        let copyRow = [];
        for (let j = stcol; j <= endcol; j++) {
            console.log(i,j);
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            // DB
            let cellProp = sheetDB[i][j];
            let cellProp2 = JSON.parse(JSON.stringify(sheetDB[i][j]));
            console.log(cellProp2)
            copyRow.push(cellProp2);
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = "14";
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "#000000";
            cellProp.alignment = "left";

            // UI
            cell.click();
        }
        copyData.push(copyRow);
    }
    console.log(copyData);
    defaultSelectedCellsUI();
})

pasteBtn.addEventListener('click', (e) => {
    // paste cell data
console.log(copyData);
    if (rangeStorage.length < 2) return;

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);
    // Target
    let addressBar = document.querySelector(".address-bar");
    let address = addressBar.value;
    let [stRwo, stCol] = decodeRIDCIDFromAddress(address);

    // r -> refers copydata row
    // c -> refers copydata col
    for (let i = stRwo,r=0; i <= stRwo + rowDiff; i++,r++){
        for (let j = stCol,c=0; j <= stCol + colDiff; j++,c++){
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            if (!cell) continue;
            // Db
            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];
            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.alignment = data.alignment;
            // UI
            cell.click();


        }
    }
})