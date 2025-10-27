const domElements = (function() {
    const oldPlayBtn = document.querySelector(".old-play-btn");
    const board = document.querySelector('.board');
    const winnerBoard = document.querySelector(".winner-board");
    const playBtn = document.querySelector('.play-btn');
    const player1 = document.querySelector('#player-1');
    const player2 = document.querySelector('#player-2');
    const playerScore1 = document.querySelector("#player-score-1");
    const playerScore2 = document.querySelector("#player-score-2");

    return {playBtn, board, winnerBoard, oldPlayBtn, player1, player2, playerScore1, playerScore2};
})();



const Players = (function () {
    let pl1, pl2;

    //getters
    const getPl1 = () => pl1;
    const getPl2 = () => pl2;

    const addPlayers = function(name1 = "Player 1", name2 = "Player 2") {
        pl1 = makePlayer(name1);
        pl2 = makePlayer(name2);
    }
    return {getPl1, getPl2, addPlayers}
})();

function makePlayer(name = "someone") {
    let score = 0;
    const getScore = function () {return score;}
    const win = function () {
        score++;
        console.log(`${name} wins!`);
        return `${name} wins!`;
    }
    return {name, getScore, win}
}



const Game = (function (player1, player2) {
    let pl1 = player1;
    let pl2 = player2;
    let firstPlayerTurn = true;
    let gameEnded = false;

    //Getters
    const getFirstPlayerTurn = function() {
        return firstPlayerTurn;
    }

    const getGameEnded = function() {
        return gameEnded;
    }

    const start = function() {
        gameEnded = false;
    }

    //Gameboard
    e = " "; //empty cells
    gameboard = [[e, e, e], [e, e, e], [e, e, e]];

    const displayGameboard = function() {
        console.log(!firstPlayerTurn ? `${pl1.name}'s move` : `${pl2.name}` + "'s move:")
        for (let i in gameboard) {
            console.log(gameboard[i]);
        }
    }

    const play = function(row, col) {
        if (gameboard[row][col] != e) {
            console.log("This cell is taken.")
            return;
        }
        gameboard[row][col] = firstPlayerTurn ? "X" : "O";

        firstPlayerTurn = !firstPlayerTurn;
        displayGameboard();
        checkForWin();
    }

    function checkForWin() {
        check = firstPlayerTurn ? "O" : "X";
        let str = ""
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                str += gameboard[i][j] == check ? "1" : "0";
            }
        }
        console.log(check, str);
        const winCondtions = 
        [
            [0, 1, 2, '--'], [3, 4, 5, '--'], [6, 7, 8, '--'], 
            [0, 3, 6, '|'], [1, 4, 7, '|'], [2, 5, 8, '|'],
            [0, 4, 8, '\\'], [2, 4, 6, '\\']
        ]
    
    
        for(let i = 0; i < 8; i++) {
            let matchCount = 0;

            for(let j = 0; j < 3; j++) {
                let idx = winCondtions[i][j];
                
                if(str[idx] == "1") {
                    matchCount++;
                }
            }

            if(matchCount == 3) {
                if(firstPlayerTurn) {
                    domElements.winnerBoard.textContent = pl2.win();
                } else {
                    domElements.winnerBoard.textContent = pl1.win();
                }
                firstPlayerTurn = true;
                gameboard = [[e, e, e], [e, e, e], [e, e, e]];
                gameEnded = true;
                console.log("Let there be another game:")
            }
        }
    }

    return {gameboard, play, getFirstPlayerTurn, getGameEnded, start};
})(Players.pl1, Players.pl2);





domElements.oldPlayBtn.addEventListener("click", (e) => {
    function play() {
        let userMove = prompt(Game.getFirstPlayerTurn() ? "X: " : "O: ");
        if (userMove != null) {
            [num1, num2] = userMove.split(", ");
            Game.play(parseInt(num1 - 1), parseInt(num2 - 1));
        }
    }

    while (!Game.getGameEnded()) {
        play();
    }

    play()
})

domElements.board.addEventListener('click', (e) => {
    const cell = e.target;

    [dontNeed, sequence] = cell.id.split("-");
    let quotient = Math.floor(sequence / 3)
    let remainder = sequence % 3;
    
    if (remainder == 0) {
        remainder = 3;
        quotient --;
    }

    Game.play(quotient, remainder - 1)

    cell.setAttribute('style', "display: flex; justify-content: center; align-items: center");
    cell.textContent = Game.getFirstPlayerTurn() ? 'O' : 'X';

})

domElements.playBtn.addEventListener('click', (e) => {
    Players.addPlayers(domElements.player1.value, domElements.player2.value);

    // domElements.playerScore1.textContent = Players.pl1.getScore();
    // domElements.playerScore2.textContent = Players.pl2.getScore();
    console.log('play pressed');
})

