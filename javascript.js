const gameBoard = (function() {
    'use strict';

    let _gameState = [0, 1, 2,
                      3, 4, 5,
                      6, 7, 8];

    function getGameState(){
        return _gameState;
    }
    // variable for keeping track of whether a placement was successful
    let placed;

    function placeSymbol(space, symbol) {
        let index = space;
        if(typeof(_gameState[index]) === 'number'){
            _gameState[index] = symbol;
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
            console.log("Index of win:" + winningConditions.indexOf('XXX'));
            document.querySelector(".status-display").textContent = "X wins!";
            document.getElementById("submit").disabled = false;
             _gameOver = true;

        } else if (winningConditions.includes('OOO')){
            console.log("O wins!");
            document.querySelector(".status-display").textContent = "O wins!";
            _gameOver = true;
            document.getElementById("submit").disabled = false;

        }
        return(_gameOver);
    }


    function checkForTie() {
        let tie = false;
        let emptySpaces = _findEmptySpaces();
        if(emptySpaces.length === 0  && !checkForWin()){
            document.querySelector(".status-display").textContent = "Tie!";
            tie = true;
            document.getElementById("submit").disabled = false;

        }
        return tie;
    }


    function _findEmptySpaces(){
        return _gameState.filter(s => s != "O" && s != "X");
    }

    function checkIfEmpty(){
        let emptySpaces = _findEmptySpaces();
        console.log("Empty spaces:" + emptySpaces.length);
        if(emptySpaces.length < 9){return false;}
        return true;
    }

    function resetBoard() {
        _gameState = [0, 1, 2,
                      3, 4, 5,
                      6, 7, 8];
        const gameCells = document.querySelectorAll(".game-cell");

        gameCells.forEach((cell) =>{
            cell.textContent = "";
        });
    }

    return {getGameState, placeSymbol, placed, checkForWin, checkForTie, checkIfEmpty, resetBoard}

})();

const playerFactory = (symbol) => {

    const turn = false;


    const place = (space) => {
        return gameBoard.placeSymbol(space, symbol); 
    };
    return {place, symbol, turn};
}




function newGame(playerChoice, difficulty){

    
        let difficultyChoice = difficulty;
        
        document.querySelector(".status-display").textContent = "";
        
        gameBoard.resetBoard();
        
        document.querySelector(".status-display").textContent = "The game has begun";
        
        let gameOver = false;
        let tie = false;

        const player1 = playerFactory(playerChoice);

        let npcChoice;

        if(playerChoice === "X"){npcChoice = "O";}
        if(playerChoice === "O"){npcChoice = "X";}

        const npc = playerFactory(npcChoice);

        console.log("Player symbol:" + player1.symbol);
        console.log("NPC symbol:" + npc.symbol);


        // minimax algorithm credit to https://github.com/ahmadabdolsaheb/minimaxarticle/blob/master/index.js
        // begin minimax
        let huPlayer = player1.symbol;
        // ai
        let aiPlayer = npc.symbol;

        let origBoard = gameBoard.getGameState();

        //keeps count of function calls
        let fc = 0;

        // finding the ultimate play on the game that favors the computer
        let bestSpot = minimax(origBoard, aiPlayer);

        //logging the results
        console.log("index: " + bestSpot.index);
        console.log("function calls: " + fc);

        // the main minimax function
        function minimax(newBoard, player){
        //add one to function calls
        fc++;
        
        //available spots
        let availSpots = emptyIndexes(newBoard);

        // checks for the terminal states such as win, lose, and tie and returning a value accordingly
        if (winning(newBoard, huPlayer)){
            return {score:-10};
        }
            else if (winning(newBoard, aiPlayer)){
            return {score:10};
            }
        else if (availSpots.length === 0){
            return {score:0};
        }

        // an array to collect all the objects
        let moves = [];

        // loop through available spots
        for (let i = 0; i < availSpots.length; i++){
            //create an object for each and store the index of that spot that was stored as a number in the object's index key
            let move = {};
            move.index = newBoard[availSpots[i]];

            // set the empty spot to the current player
            newBoard[availSpots[i]] = player;

            //if collect the score resulted from calling minimax on the opponent of the current player
            if (player == aiPlayer){
            let result = minimax(newBoard, huPlayer);
            move.score = result.score;
            }
            else{
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
            }

            //reset the spot to empty
            newBoard[availSpots[i]] = move.index;

            // push the object to the array
            moves.push(move);
        }

        // if it is the computer's turn loop over the moves and choose the move with the highest score
        let bestMove;
        if(player === aiPlayer){
            let bestScore = -10000;
            for(let i = 0; i < moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
            }
        }else{

        // else loop over the moves and choose the move with the lowest score
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
            }
        }

        // return the chosen move (object) from the array to the higher depth
        return moves[bestMove];
        }

        // returns the available spots on the board
        function emptyIndexes(board){
        return  board.filter(s => s != "O" && s != "X");
        }

        // winning combinations using the board indexes
        function winning(board, player){
        if (
                (board[0] == player && board[1] == player && board[2] == player) ||
                (board[3] == player && board[4] == player && board[5] == player) ||
                (board[6] == player && board[7] == player && board[8] == player) ||
                (board[0] == player && board[3] == player && board[6] == player) ||
                (board[1] == player && board[4] == player && board[7] == player) ||
                (board[2] == player && board[5] == player && board[8] == player) ||
                (board[0] == player && board[4] == player && board[8] == player) ||
                (board[2] == player && board[4] == player && board[6] == player)
                ) {
                return true;
            } else {
                return false;
            }
        }

        // end miniMax

        // X always goes first
        if(player1.symbol === "X"){
            player1.turn = true;
        } else {
            player1.turn = false;
            npcTurn();}

        // Activate grid cells when game begins, customized based on user's
        // choice of symbol

        const gridCells = document.querySelectorAll(".game-cell");


        gridCells.forEach(item => {
            item.addEventListener('click', () => {

                if(!gameOver && !tie){
                    console.log("Button clicked; player symbol:" + player1.symbol);

                    // Variable is assigned true if the player successfully made a move
                    let actionTaken = gameBoard.placeSymbol(parseInt(item.id), player1.symbol);
                    item.textContent = player1.symbol;

                    gameOver = gameBoard.checkForWin();
                    tie = gameBoard.checkForTie();

                    if(actionTaken && !gameOver && !tie){
                        npcTurn();
                    }}
            })
        })
        
    
    
    
    function npcTurn(){

        if(tie){return;}

        let actionTaken = false;
        let npcSpace;

        while(!actionTaken){
            if(gameBoard.checkForTie()){return;}

            if(difficultyChoice === "easy"){
                npcIndex = Math.floor(Math.random() * 9);
                console.log(npcIndex)
            } else {
                npcSpace = minimax(origBoard, aiPlayer);
                npcIndex = npcSpace.index;
            }
            actionTaken = npc.place(npcIndex);
        }

        document.getElementById(`${npcIndex}`).textContent = npc.symbol;

        gameOver = gameBoard.checkForWin();
        tie = gameBoard.checkForTie();

        if(!gameOver && !tie){
            player1.turn = true;  
        }
    } 

}

function play(){

    // Something was getting seriously messed up if I allowed players 
    // to start a new game mid-match.  It seemed the easiest way to handle this
    // without rebuilding the program was to disable the new game button mid-game

    document.getElementById("submit").disabled = true;

    const X = document.getElementById("X");

    let symbol = (X.checked)? "X" : "O";

    const easy = document.getElementById("easy");
    let difficulty = (easy.checked)? "easy" : "hard";

    console.log(symbol, difficulty);
    newGame(symbol, difficulty);
    return false;
}

document.getElementById("play").onsubmit = play;

