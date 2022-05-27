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


