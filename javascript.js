const gameBoard = (function() {
    'use strict';

    let _gameState = [" ", " ", " ",
                        " ", " ", " ",
                        " ", " ", " "];

    function getGameState(){
        return _gameState;
    }

    let placed;

    // Useful for making sure the board matches the array on file
    function displayBoard(){
        console.log("Game state:")
        for(let i = 0; i < 9; i++){
            console.log(_gameState[i]);
        }; 
    }

    function placeSymbol(space, symbol) {
        let index = space - 1;
        if(_gameState[index] === " "){
            _gameState[space - 1] = symbol;
            displayBoard();
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
            document.querySelector(".status-display").textContent = "X wins!";
            _gameOver = true;
        } else if (winningConditions.includes('OOO')){
            console.log("O wins!");
            document.querySelector(".status-display").textContent = "O wins!";
            _gameOver = true;
        }
        return(_gameOver);
    }


    function checkForTie() {
        let tie = false;
        if(!_gameState.includes(" ") && !checkForWin()){
            document.querySelector(".status-display").textContent = "Tie!";
            tie = true;
        }
        return tie;
    }

    function resetBoard() {
        _gameState = [" ", " ", " ",
                      " ", " ", " ",
                      " ", " ", " "];
        const gameCells = document.querySelectorAll(".game-cell");

        gameCells.forEach((cell) =>{
            cell.textContent = "";
        });
        displayBoard();
    }

    return {displayBoard, getGameState, placeSymbol, placed, checkForWin, checkForTie, resetBoard}

})();

const playerFactory = (symbol) => {

    const turn = false;


    const place = (space) => {
        return gameBoard.placeSymbol(space, symbol); 
    };
    return {place, symbol, turn};
}




function newGame(playerChoice){

    

        document.querySelector(".status-display").textContent = "";

        gameBoard.resetBoard();

        gameBoard.displayBoard();
        
       
        let gameOver = false;
        let tie = false;

        const player = playerFactory(playerChoice);

        let npcChoice = (playerChoice === "X")? "O": "X";

        const npc = playerFactory(npcChoice);

        console.log("Player symbol:" + player.symbol);
        console.log("NPC symbol:" + npc.symbol);

        // Begin rough draft of miniMax algo

    let origBoard = gameBoard.getGameState();

    let huPlayer = player.symbol;

    let aiPlayer = npc.symbol;

    let functionCalls = 0;

    let bestSpot = miniMax(origBoard, aiPlayer);

    // log results

    console.log("index: " + bestSpot.index);
    console.log("function calls: " + functionCalls);

    function findEmptySpaces(board){
        return board.filter(s => s != "O" && s != "X");
    }

    function findWinner(player) {
        let tl = gameBoard.getGameState()[0];
        let tm = gameBoard.getGameState()[1];
        let tr = gameBoard.getGameState()[2];
        let ml = gameBoard.getGameState()[3];
        let mm = gameBoard.getGameState()[4];
        let mr = gameBoard.getGameState()[5];
        let bl = gameBoard.getGameState()[6];
        let bm = gameBoard.getGameState()[7];
        let br = gameBoard.getGameState()[8];

        const winningConditions = [tl+tm+tr, ml+mm+mr, bl+bm+br, tl+ml+bl, tm+mm+bm, tr+mr+br, tl+mm+br, bl+mm+tr];

        if (winningConditions.includes(player.symbol + player.symbol + player.symbol)){
            return true;
        } else {return false;}
    }

    function miniMax(newBoard, player){

        functionCalls++;

        let availSpots = findEmptySpaces(newBoard);

        if(findWinner(newBoard, huPlayer)){
            return {score: -10};
        } else if (findWinner(newBoard, aiPlayer)){
            return {score: 10};
        } else if (availSpots.length === 0){
            return {score: 0};
        }
        
        // array to collect the score objects

        let moves = [];

        // loop through available spots
        for(let i = 0; i < availSpots.length; i++){
            // create an object for each and store that spot's index
            let move = {};
            move.index = newBoard[availSpots[i]];

            // set empty spot to current player
            newBoard[availSpots[i]] = player;

            if (player == aiPlayer){
                let result = miniMax(newBoard, huPlayer);
                move.score = result.score;
            }
            else{
                let result = miniMax(newBoard, aiPlayer);
                move.score = result.score;
            }
            // reset the selected spot to empty
            newBoard[availSpots[i]] = move.index;

            // push the object to the array of moves
            moves.push(move);

            let bestMove;
            if(player === aiPlayer){
                let bestScore = -10000;
                for(let i = 0; i < moves.length; i++){
                    if(moves[i].score > bestScore){
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            } else{
                let bestScore = 10000;
                for(let i = 0; i < moves.length; i++){
                    if(moves[i].score < bestScore){
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }

            return moves[bestMove];
        }
    }
    
    // End rough draft of miniMax

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

                if(!gameOver && !tie){

                    // Check if the player successfully made a move
                    let actionTaken = gameBoard.placeSymbol(parseInt(item.id), player.symbol);
                    item.textContent = player.symbol;

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
            npcSpace = miniMax(origBoard, aiPlayer);
            actionTaken = npc.place(npcSpace);
        }

        document.getElementById(`${npcSpace}`).textContent = npc.symbol;

        gameOver = gameBoard.checkForWin();
        tie = gameBoard.checkForTie();

        if(!gameOver && !tie){
            player.turn = true;  
        }
    }

    
    
  
    

}

let player1 = playerFactory("X");

console.log(player1.symbol + player1.symbol + player1.symbol);
