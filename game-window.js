var gameRounds = 0;
var currentRound = 0;
var p1Score = 0;
var p2Score = 0;

function setRounds(rounds) {
    gameRounds = rounds;
    document.querySelector(".game-rounds").innerText = rounds;
}

function setP1Name(name) {
    document.querySelector(".p1-name").innerText = name;
}

function setP2Name(name) {
    document.querySelector(".p2-name").innerText = name;
}

function startGame() {
    const element = document.createElement("div");
    element.classList.add("game-started");
    document.querySelector(".container").appendChild(element);
    document.querySelector(".game-status").innerText = "In progress";
    document.querySelector(".start-button").disabled = true;
}

function setCurrentRound(round) {
    currentRound = round;
    document.querySelector(".current-round").innerText = round + 1;
}

function formatScore(score) {

}

function addP1Score(score) {
    p1Score += score;
    document.querySelector(".p1-score").innerText = p1Score.toLocaleString("en-US");
}

function addP2Score(score) {
    p2Score += score;
    document.querySelector(".p2-score").innerText = p2Score.toLocaleString("en-US");
}

function finishGame() {
    let winner;
    let color;
    if (p1Score > p2Score) {
        winner = "Player 1 wins!";
        color = "red";
    } else if (p2Score > p1Score) {
        winner = "Player 2 wins!";
        color = "blue";
    } else  {
        winner = "Draw!";
        color = "gray";
    }
    document.querySelector(".game-status").innerText = "Finished";
    document.querySelector(".info-winner").innerText = winner;
    document.querySelector(".info-winner").style = "color: " + color;
}

document.querySelector(".start-button").addEventListener("click", function (e) {
    startGame();
});
