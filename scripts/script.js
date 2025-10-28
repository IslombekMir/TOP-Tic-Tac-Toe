const domElements = (function() {
    const oldPlayBtn = document.querySelector(".old-play-btn");
    const playground = document.querySelector(".playground");
    const board = document.querySelector('.board');
    const cells = Array.from(board.children);
    const boardWrapper = document.querySelector(".board-wrapper");
    const winnerBoard = document.querySelector(".winner-board");
    const playBtn = document.querySelector('.play-btn');
    const player1 = document.querySelector('#player-1');
    const player2 = document.querySelector('#player-2');
    const player1Box = document.querySelector(".first");
    const player2Box = document.querySelector(".second");
    const playerScore1 = document.querySelector("#player-score-1");
    const playerScore2 = document.querySelector("#player-score-2");

    return {playBtn, playground, board, cells, boardWrapper, winnerBoard, oldPlayBtn, player1, player2, player1Box, player2Box, playerScore1, playerScore2};
})();



const makePlayer = function(name) {
    let score = 0;
    const getScore = () => score;
    const win = () => {
        score++
        console.log(`${name} wins!`);
    };
    return {
        name,
        getScore,
        win
    }
}



const Game = (function () {
    let pl1, pl2, firstPlayerTurn, gameEnded, gameboard;
    //Getters
    const getFirstPlayerTurn = () => firstPlayerTurn;
    const getGameEnded = () => gameEnded;

    const start = function() {
        pl1 = player1;
        pl2 = player2;
        firstPlayerTurn = true;
        gameEnded = false;
        e = " "; //empty cells
        gameboard = [[e, e, e], [e, e, e], [e, e, e]];

    }

    const displayGameboard = function() {
        console.log(!firstPlayerTurn ? `${pl1.name}'s move` : `${pl2.name}` + "'s move:")
        for (let i in gameboard) {
            console.log(gameboard[i]);
        }
    }

    const showTurn = function() {
        if(firstPlayerTurn) {
            domElements.player1Box.style.fontSize = "25px";
            domElements.player2Box.style.fontSize = "1rem";
            domElements.player1Box.style.border = "2px outset green";
            domElements.player2Box.style.border = "none";
            domElements.winnerBoard.textContent = `${pl1.name}'s turn`;
        } else {
            domElements.player1Box.style.fontSize = "1rem";
            domElements.player2Box.style.fontSize = "25px";
            domElements.player1Box.style.border = "none";
            domElements.player2Box.style.border = "2px outset green";
            domElements.winnerBoard.textContent = `${pl2.name}'s turn`;
        }
    }

    const play = function(row, col) {
        if (gameboard[row][col] != e) {
            console.log("This cell is taken.")
            domElements.winnerBoard.textContent = "This cell is taken!";
            domElements.winnerBoard.style.color = "red";
            return;
        }
        gameboard[row][col] = firstPlayerTurn ? "X" : "O";

        firstPlayerTurn = !firstPlayerTurn;
        showTurn();
        displayGameboard();
        checkForWin();
    }

    const afterWin = function() {
        //gameboard = [[e, e, e], [e, e, e], [e, e, e]];
        gameEnded = true;
        //domElements.cells.forEach(cell => cell.textContent = "");
        domElements.cells.forEach(cell => cell.style.background = "skyblue");
        winner = !firstPlayerTurn ? pl1 : pl2;
        firstPlayerTurn = true;
        

        domElements.board.removeEventListener('click', eventForCells);
        showTurn();
        updateScores();
        domElements.winnerBoard.textContent = `One point to ${winner.name}!`;
    }

    function checkForWin() {
        check = firstPlayerTurn ? "O" : "X";
        let str = ""
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                str += gameboard[i][j] == check ? "1" : "0";
            }
        }
    
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
                
                let [a, b, c, type] = winCondtions[i];
                domElements.cells[a].textContent = type;
                domElements.cells[b].textContent = type;
                domElements.cells[c].textContent = type;
                
                afterWin();
                console.log("Let there be another game:");
            }
        }
    }

    return {gameboard, play, getFirstPlayerTurn, getGameEnded, start, showTurn};
})();


function updateScores() {
    domElements.playerScore1.textContent = player1.getScore();
    domElements.playerScore2.textContent = player2.getScore();
}


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

function enableGame() {
    domElements.board.addEventListener('click', (e) => {
        const cell = e.target;

        [dontNeed, sequence] = cell.id.split("-");
        let quotient = Math.floor(sequence / 3)
        let remainder = sequence % 3;
    
        if (remainder == 0) {
            remainder = 3;
            quotient --;
        }
        cell.textContent = Game.getFirstPlayerTurn() ? 'X' : 'O';
        Game.play(quotient, remainder - 1);
    })
}

function eventForCells(e) {
    console.log("Play clicked!");

    if(domElements.player1.value.trim() == "" | domElements.player2.value.trim() == "") {
        domElements.winnerBoard.textContent = "Enter both names";
        domElements.winnerBoard.style.color = "red";
    } else {
        domElements.boardWrapper.style.background = "var(--main-color)";
        player1 = makePlayer(domElements.player1.value);
        player2 = makePlayer(domElements.player2.value);

        domElements.winnerBoard.textContent = "Good Luck!";
        domElements.winnerBoard.style.color = "white";

        Game.start(player1, player2);
        Game.showTurn();
        enableGame();
        updateScores();

        e.target.textContent = "New Game";
    }
}

domElements.playBtn.addEventListener('click', eventForCells);

