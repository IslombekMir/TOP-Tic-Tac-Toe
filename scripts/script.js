function makePlayer(name) {
    let score = 0;
    const getScore = function () {return score;}
    const win = function () {
        score++;
        console.log(`${name} wins!`);
    }
    return {name, getScore, win}
}

const p1 = makePlayer("Mike");
const p2 = makePlayer("Noah");

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
        if (gameboard[row - 1][col - 1] != e) {
            console.log("This cell is taken.")
            return;
        }
        gameboard[row - 1][col - 1] = firstPlayerTurn ? "X" : "O";
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
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
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
                firstPlayerTurn ? pl2.win() : pl1.win();
                firstPlayerTurn = true;
                gameboard = [[e, e, e], [e, e, e], [e, e, e]];
                gameEnded = true;
                console.log("Let tjere be another game:")
            }
        }
    }

    return {gameboard, play, getFirstPlayerTurn, getGameEnded, start};
})(p1, p2)


const playBtn = document.querySelector("button");
playBtn.addEventListener("click", (e) => {
    function play() {
        let userMove = prompt(Game.getFirstPlayerTurn() ? "X: " : "O: ");
        [num1, num2] = userMove.split(", ");
        Game.play(parseInt(num1), parseInt(num2));
    }

    while (!Game.getGameEnded()) {
        play();
    }
})