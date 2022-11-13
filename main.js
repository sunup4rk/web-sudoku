let answerSheet = new Array(81);
let initialDisplaySheet = new Array(81);
let inputSheet = new Array(81);
let checkSheet = new Array(81);
const storageKeys = {
    answerSheet: "answerSheet",
    initialDisplaySheet: "initialDisplaySheet",
    inputSheet: "inputSheet",
    checkSheet: "checkSheet"
}

////////////////////////////// 페이지 로드 //////////////////////////////
function loadPage(){
    if(localStorage.getItem(storageKeys.answerSheet)){
        makeDragTable();
        makeMainTable();
        answerSheet = JSON.parse(localStorage.getItem(storageKeys.answerSheet));
        initialDisplaySheet = JSON.parse(localStorage.getItem(storageKeys.initialDisplaySheet));
        inputSheet = JSON.parse(localStorage.getItem(storageKeys.inputSheet));
        checkSheet = JSON.parse(localStorage.getItem(storageKeys.checkSheet));
        insertNumber(initialDisplaySheet);
        insertDragNumber(inputSheet);
    }
    else{
        initialize();
    }
}

////////////////////////////// 게임 초기화 ////////////////////////////// 
function initialize(){
    localStorage.clear();
    makeDragTable();    
    makeMainTable();
    makePuzzle();
}

////////////////////////////// 숫자 입력 버튼 //////////////////////////////
function makeDragTable(){
    let dragTable = "<div class='num_container' ondragover='dragover(event)'>";
    for(let i = 0; i < 9; i++){
        dragTable += "<div class='num' draggable='true' ondragstart='dragstart(event)' id='num_" + (i + 1) + "'>" + (i + 1) + "</div>";
    }
    dragTable += "</div>";
    document.getElementById("table_drag").innerHTML = dragTable;
}

////////////////////////////// 테이블 그리기 //////////////////////////////
function makeMainTable(){
    let mainTable = "<div>";
    
    // 행
    for(let i = 0; i < 9; i++){
        mainTable += "<div class='row' id='row_" + i + "'>";
        
        // 열
        for(let j = 0; j < 9; j++){
            if((j < 3 || j > 5) && (i < 3 || i > 5)){
                mainTable += "<div class='block_odd target' ondragover='dragover(event)' ondrop='dodrop(event)' id='col_" + (i * 9 + j) + "'></div>";
            }
            else if((j >= 3 && j <= 5) && (i >= 3 && i <= 5)){
                mainTable += "<div class='block_odd target' ondragover='dragover(event)' ondrop='dodrop(event)' id='col_" + (i * 9 + j) + "'></div>";
            }
            else{
                mainTable += "<div class='block_even target' ondragover='dragover(event)' ondrop='dodrop(event)' id='col_" + (i * 9 + j) + "'></div>";
            }
        }
        mainTable += "</div>";
    }
    mainTable += "</div>";

    document.getElementById("table_main").innerHTML = mainTable;
}


////////////////////////////// 스도쿠 숫자 생성 //////////////////////////////
function makePuzzle(){    
    let rawValue = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

    answerSheet = [
        rawValue[0], rawValue[2], rawValue[1], rawValue[5], rawValue[4], rawValue[3], rawValue[6], rawValue[7], rawValue[8],
        rawValue[6], rawValue[8], rawValue[7], rawValue[2], rawValue[1], rawValue[0], rawValue[3], rawValue[4], rawValue[5],
        rawValue[3], rawValue[5], rawValue[4], rawValue[8], rawValue[7], rawValue[6], rawValue[0], rawValue[1], rawValue[2],
        rawValue[2], rawValue[4], rawValue[3], rawValue[7], rawValue[6], rawValue[5], rawValue[8], rawValue[0], rawValue[1],
        rawValue[5], rawValue[7], rawValue[6], rawValue[1], rawValue[0], rawValue[8], rawValue[2], rawValue[3], rawValue[4],
        rawValue[8], rawValue[1], rawValue[0], rawValue[4], rawValue[3], rawValue[2], rawValue[5], rawValue[6], rawValue[7],
        rawValue[7], rawValue[0], rawValue[8], rawValue[3], rawValue[2], rawValue[1], rawValue[4], rawValue[5], rawValue[6],
        rawValue[4], rawValue[6], rawValue[5], rawValue[0], rawValue[8], rawValue[7], rawValue[1], rawValue[2], rawValue[3],
        rawValue[1], rawValue[3], rawValue[2], rawValue[6], rawValue[5], rawValue[4], rawValue[7], rawValue[8], rawValue[0]
    ];

    initialDisplaySheet = JSON.parse(JSON.stringify(answerSheet));

    // arrayB 에 구멍 뚫기
    let zeroCount = 0
    while(zeroCount < 10){
        let idx = Math.floor(Math.random() * 81);
        if(initialDisplaySheet[idx]){
            initialDisplaySheet[idx] = 0;
            zeroCount++;
        }
    }

    // 초기 inputSheet 만들기
    for(let i = 0; i < 81; i++){
        inputSheet[i] = 0;
    }

    makeCheckSheet();

    localStorage.setItem(storageKeys.answerSheet, JSON.stringify(answerSheet));
    localStorage.setItem(storageKeys.initialDisplaySheet, JSON.stringify(initialDisplaySheet));
    localStorage.setItem(storageKeys.inputSheet, JSON.stringify(inputSheet));
    localStorage.setItem(storageKeys.checkSheet, JSON.stringify(checkSheet));

    insertNumber(initialDisplaySheet);
}

function insertNumber(arr){
    for(let i = 0; i < 81; i++){
        if(arr[i] === Number(0)){
            document.getElementById("col_" + i).innerHTML = "";    
        }
        else{
            document.getElementById("col_" + i).innerHTML = arr[i];
        }            
    }
}

function insertDragNumber(arr){
    for(let i = 0; i < 81; i++){
        if(arr[i] != 0){
            document.getElementById("col_" + i).innerHTML = "<div class='num' draggable='true' ondragstart='dragstart(event)' id='num_" + arr[i] + "'>" + arr[i] + "</div>";    
        }   
    }
}

function makeCheckSheet(){
    for(var i = 0; i < 81; i ++){
        if(initialDisplaySheet[i] !== 0){
            checkSheet[i] = initialDisplaySheet[i];
        }
        else if(initialDisplaySheet[i] === 0){
            checkSheet[i] = inputSheet[i];
        }
    }
    localStorage.setItem(storageKeys.checkSheet, JSON.stringify(checkSheet));
}

function checkSuccess(){
    if(JSON.stringify(answerSheet) === JSON.stringify(checkSheet)){
        alert("클리어!");
        console.log("clear");
    }
}

////////////////////////////// 이벤트 핸들러 //////////////////////////////
function dragstart(evt){
    evt.dataTransfer.setData("number", evt.target.id);
    console.log(evt.target.id);
}

function dragover(evt){
    evt.preventDefault();
}

function dodrop(evt){   
    var targetid = evt.target.getAttribute("id");
    var numberid = evt.dataTransfer.getData("number");
    var numberidx = document.getElementById(numberid).innerHTML;

    if(document.getElementById(targetid).innerHTML == ""){
        evt.target.appendChild(document.getElementById(numberid));
        inputSheet[Number((evt.target.getAttribute("id")).split('_')[1])] = Number(numberidx);
        localStorage.setItem(storageKeys.inputSheet, JSON.stringify(inputSheet));
    }
    else if(document.getElementById(targetid).className == 'num'){        
        evt.target.setAttribute("id", "num_" + numberidx);
        evt.target.innerHTML = numberidx;
        inputSheet[Number((evt.target.parentElement.getAttribute("id")).split('_')[1])] = Number(numberidx);
        localStorage.setItem(storageKeys.inputSheet, JSON.stringify(inputSheet));
    }

    makeCheckSheet();
    checkSuccess();
    makeDragTable();
}