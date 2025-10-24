const Game = (function (player1, player2) {
    let pl1 = player1;
    let pl2 = player2;
    let firstPlayerTurn = true;
    let gameEnded = false;

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
        switch(str) {
            case "111000000":
            case "000111000":
            case "000000111":
            case "100100100":
            case "010010010":
            case "001001001":
            case "100010001":
            case "001010100":
                !firstPlayerTurn ? pl1.win() : pl2.win();
                gameEnded = true;
        }
    }

    return {gameboard, play, firstPlayerTurn} //Bad
})(p1, p2)

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


const playBtn = document.querySelector("button");
playBtn.addEventListener("click", (e) => {
    let userMove = prompt(game1.firstPlayerTurn ? "X: " : "O: ");
    [num1, num2] = userMove.split(", ");
    game1.play(parseInt(num1), parseInt(num2));
})