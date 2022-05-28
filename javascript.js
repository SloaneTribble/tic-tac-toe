const gameBoard = (function() {
    'use strict';

    let _gameState = [" ", " ", " ",
                        " ", " ", " ",
                        " ", " ", " "];

    function _displayBoard(){
        for(let i = 0; i < 9; i++){
            console.log(_gameState[i]);
        }; 
    }

    function placeSymbol(space, symbol) {
        let index = space - 1;
        if(_gameState[index] === " "){
            _gameState[space - 1] = symbol;
        } else {
            console.log("Sorry, that space is already taken.");
        }
        checkForWin();
        _displayBoard();
    }

    function checkForWin() {
        let tl = _gameState[0];
        let tm = _gameState[1];
        let tr = _gameState[2];
        let ml = _gameState[3];
        let mm = _gameState[4];
        let mr = _gameState[5];
        let bl = _gameState[6];
        let bm = _gameState[7];
        let br = _gameState[8];

        const winningConditions = [tl+tm+tr, ml+mm+mr, bl+bm+br, tl+ml+bl, tm+mm+bm, tr+mr+br, tl+mm+br, bl+mm+tr];

        let _gameOver = false;

        if (winningConditions.includes('XXX')){
            console.log("X wins!");
            _gameOver = true;
        } else if (winningConditions.includes('OOO')){
            console.log("O wins!");
            _gameOver = true;
        }
        return(_gameOver);
    }

    function resetBoard() {
        _gameState = [" ", " ", " ",
                      " ", " ", " ",
                      " ", " ", " "];
        _displayBoard();
    }

    return {placeSymbol, resetBoard, checkForWin}

})();

const playerFactory = (symbol) => {

    let turn = false;

    const place = (space) => {
        gameBoard.placeSymbol(space, symbol);
        gameBoard.checkForWin();
        turn = false;
    };
    return {place, symbol, turn};
}


const gameZone = (function() {

    function newGame(playerChoice){

        let gameOver = gameBoard.checkForWin();

        const player = playerFactory(playerChoice);

        let npcChoice = (playerChoice === "X")? "O": "X";

        const npc = playerFactory(npcChoice);

        console.log("Player symbol:" + player.symbol);
        console.log("NPC symbol:" + npc.symbol);

        const gridCells = document.querySelectorAll(".game-cell");

        gridCells.forEach(item => {
            item.addEventListener('click', () => {
                gameBoard.placeSymbol(parseInt(item.id), player.symbol);
                item.classList.add(player.symbol);
                player.turn = false;
                npc.turn = true;
            })
        })
        

        // X always goes first
        if(player.symbol === "X"){
            player.turn = true;
        } else {player.turn = false;
            npc.turn = true;}

        while(gameOver === false){
            while(player.turn === true){
                document.querySelector(".status-display").textContent = "Your turn";  
            }
            while(npc.turn === true){
                let npcSpace = Math.floor(Math.random() * 8) + 1;
                npc.place(npcSpace);
                document.getElementById(`${npcSpace}`).classList.add(npc.symbol);
                npc.turn = false;
                player.turn = true;
            }

        
    }}

    

    

    return {newGame};
})();




