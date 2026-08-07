var gameRounds = 0;

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
}

document.querySelector(".start-button").addEventListener("click", function (e) {
    startGame();
});