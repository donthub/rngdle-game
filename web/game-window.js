var gameRounds = 0;
var currentRound = 0;
var p1Score = 0;
var p2Score = 0;
var p1CharacterId = '';

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
    document.querySelectorAll(".player-character-container").forEach(item => {
        item.style = "display: none;"
    });
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

function selectCharacterP1(selectedCharacter) {
    const characterName = selectedCharacter.getAttribute("title");
    document.querySelector(".character-name-p1").innerText = characterName;
    const characterId = selectedCharacter.getAttribute("data-id");
    p1CharacterId = characterId;
}

function selectCharacterP2(selectedCharacter) {
    const characterName = selectedCharacter.getAttribute("title");
    document.querySelector(".character-name-p2").innerText = characterName;
    const characterId = selectedCharacter.getAttribute("data-id");
    p2CharacterId = characterId;
}

document.querySelector(".start-button").addEventListener("click", function (e) {
    startGame();
});

document.querySelectorAll(".player-character-selector-item-p1").forEach(item => {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        const element = this;
        selectCharacterP1(element);
    });
});

document.querySelectorAll(".player-character-selector-item-p2").forEach(item => {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        const element = this;
        selectCharacterP2(element);
    });
});
