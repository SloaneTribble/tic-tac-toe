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

    function resetBoard() {
        _gameState = [" ", " ", " ",
                      " ", " ", " ",
                      " ", " ", " "];
        _displayBoard();
    }

    return {placeSymbol, resetBoard}

})();

const playerFactory = (symbol) => {
    const place = (space) => {gameBoard.placeSymbol(space, symbol)};
    return {place};
}


const gameFactory = (playerChoice) => {
    const playerOne = playerFactory(playerChoice);

    let playerTwoChoice = (playerChoice === "X")? 'O': 'X';

    const playerTwo = playerFactory(playerTwoChoice);

    return {playerOne, playerTwo};
}

const game1 = gameFactory('X');

game1.playerOne.place(3);

game1.playerTwo.place(3);