const gameBoard = (function() {
    'use strict';

    let _gameState = [" ", " ", " ",
                        " ", " ", " ",
                        " ", " ", " "];

    let placed;

    function _displayBoard(){
        console.log("Game state:")
        for(let i = 0; i < 9; i++){
            console.log(_gameState[i]);
        }; 
    }

    function placeSymbol(space, symbol) {
        let index = space - 1;
        if(_gameState[index] === " "){
            _gameState[space - 1] = symbol;
            _displayBoard();
            placed = true;
        } else {
            console.log("Sorry, that space is already taken.")
            placed = false;
        }
        return placed;
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
            document.querySelector(".status-display").textContent = "X wins!"
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
        const gameCells = document.querySelectorAll(".game-cell");

        gameCells.forEach((cell) =>{
            cell.textContent = "";
        });
        _displayBoard();
    }

    return {placeSymbol, resetBoard, checkForWin, placed}

})();

const playerFactory = (symbol) => {

    const turn = false;


    const place = (space) => {
        return gameBoard.placeSymbol(space, symbol); 
    };
    return {place, symbol, turn};
}




function newGame(playerChoice){

        gameBoard.resetBoard();
        
       
        let gameOver = false;

        const player = playerFactory(playerChoice);

        let npcChoice = (playerChoice === "X")? "O": "X";

        const npc = playerFactory(npcChoice);

        console.log("Player symbol:" + player.symbol);
        console.log("NPC symbol:" + npc.symbol);

        // X always goes first
        if(player.symbol === "X"){
            player.turn = true;
        } else {
            player.turn = false;
            npcTurn();}

        // Activate grid cells when game begins, customized based on user's
        // choice of symbol

        const gridCells = document.querySelectorAll(".game-cell");


        gridCells.forEach(item => {
            item.addEventListener('click', () => {

                if(!gameOver){
                    gameBoard.placeSymbol(parseInt(item.id), player.symbol);
                    item.textContent = player.symbol;

                    gameOver = gameBoard.checkForWin()

                    if(!gameOver){
                        npcTurn();
                    }}
            })
        })
        
        
    
    
    function npcTurn(){

        let actionTaken = false;
        let npcSpace;

        while(!actionTaken){
            npcSpace = Math.floor(Math.random() * 8) + 1;
            actionTaken = npc.place(npcSpace);
        }

        document.getElementById(`${npcSpace}`).textContent = npc.symbol;

        gameOver = gameBoard.checkForWin();

        if(!gameOver){
            player.turn = true;  
        }
    }

}


