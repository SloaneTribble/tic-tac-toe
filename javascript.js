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


const newGame = (playerChoice) => {

    let gameOver = false;

    const player = playerFactory(playerChoice);

    let npcChoice = (playerChoice === "X")? 'O': 'X';

    const npc = playerFactory(npcChoice);

    if(player.symbol === "X"){
        player.turn = true;
    } else {player.turn = false;}

    // while(!gameOver){
    //     while(player.turn === true){
    //         console.log("Your turn");
    //     }

    // }

    return;
}

const gridCells = document.querySelectorAll(".game-cell");

gridCells.forEach(item => {
    item.addEventListener('click', () => {
        gameBoard.placeSymbol(parseInt(item.id), 'X');
    })
})


