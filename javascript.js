const gameBoard = (function() {
    'use strict';

    let _gameState = [0, 1, 2,
                      3, 4, 5,
                      6, 7, 8];

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
        if(typeof(_gameState[index]) === 'number'){
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
            console.log("Index of win:" + winningConditions.indexOf('XXX'));
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
        let emptySpaces = _findEmptySpaces();
        console.log(emptySpaces);
        if(emptySpaces.length === 0  && !checkForWin()){
            document.querySelector(".status-display").textContent = "Tie!";
            tie = true;
        }
        return tie;
    }

    function _findEmptySpaces(){
        return _gameState.filter(s => s != "O" && s != "X");
    }

    function resetBoard() {
        _gameState = [0, 1, 2,
                      3, 4, 5,
                      6, 7, 8];
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
        
       
        let gameOver = false;
        let tie = false;

        const player1 = playerFactory(playerChoice);

        let npcChoice = (playerChoice === "X")? "O": "X";

        const npc = playerFactory(npcChoice);

        console.log("Player symbol:" + player1.symbol);
        console.log("NPC symbol:" + npc.symbol);



// begin miniMax
var huPlayer = player1.symbol;
// ai
var aiPlayer = npc.symbol;

// this is the board flattened and filled with some values to easier asses the Artificial Inteligence.
var origBoard = gameBoard.getGameState();

//keeps count of function calls
var fc = 0;

// finding the ultimate play on the game that favors the computer
var bestSpot = minimax(origBoard, aiPlayer);

//logging the results
console.log("index: " + bestSpot.index);
console.log("function calls: " + fc);

// the main minimax function
function minimax(newBoard, player){
  //add one to function calls
  fc++;
  
  //available spots
  var availSpots = emptyIndexes(newBoard);

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
  var moves = [];

  // loop through available spots
  for (var i = 0; i < availSpots.length; i++){
    //create an object for each and store the index of that spot that was stored as a number in the object's index key
    var move = {};
  	move.index = newBoard[availSpots[i]];

    // set the empty spot to the current player
    newBoard[availSpots[i]] = player;

    //if collect the score resulted from calling minimax on the opponent of the current player
    if (player == aiPlayer){
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    }
    else{
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    //reset the spot to empty
    newBoard[availSpots[i]] = move.index;

    // push the object to the array
    moves.push(move);
  }

// if it is the computer's turn loop over the moves and choose the move with the highest score
  var bestMove;
  if(player === aiPlayer){
    var bestScore = -10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }else{

// else loop over the moves and choose the move with the lowest score
    var bestScore = 10000;
    for(var i = 0; i < moves.length; i++){
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

// winning combinations using the board indexies for instace the first win could be 3 xes in a row
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

                    // Check if the player successfully made a move
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
            // npcSpace = Math.floor(Math.random() * 10);
            npcSpace = minimax(origBoard, aiPlayer);
            console.log("npc space" + npcSpace.index);
            npcIndex = npcSpace.index + 1;
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


function findWinningConditions(){
    let tl = gameBoard.getGameState()[0];
    let tm = gameBoard.getGameState()[1];
    let tr = gameBoard.getGameState()[2];
    let ml = gameBoard.getGameState()[3];
    let mm = gameBoard.getGameState()[4];
    let mr = gameBoard.getGameState()[5];
    let bl = gameBoard.getGameState()[6];
    let bm = gameBoard.getGameState()[7];
    let br = gameBoard.getGameState()[8];

    const winningConditions = [tl+tm+tr, ml+mm+mr, bl+bm+br, 
        tl+ml+bl, tm+mm+bm, tr+mr+br, tl+mm+br, bl+mm+tr];

    return winningConditions;
}