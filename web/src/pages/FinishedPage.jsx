import React from "react";

import Scoreboard from "../components/Scoreboard.jsx";

function resolveWinner(p1Score, p2Score) {
    if (p1Score > p2Score) {
        return { text: "Player 1 wins!", color: "red" };
    }
    if (p2Score > p1Score) {
        return { text: "Player 2 wins!", color: "blue" };
    }
    return { text: "Draw!", color: "gray" };
}

export default function FinishedPage({ gameStatus, currentRound, rounds, p1, p2, onReset, onExit }) {
    const winner = resolveWinner(p1.score, p2.score);
    return (
        <div className="container">
            <Scoreboard gameStatus={gameStatus} currentRound={currentRound} rounds={rounds}
                        p1={p1} p2={p2}/>
            <div className="winner-container" style={{ color: winner.color }}>
                {winner.text}
            </div>
            <div className="controls-container">
                <div className="reset-container">
                    <button className="reset-button" onClick={onReset}>Reset</button>
                </div>
                <div className="exit-container">
                    <button className="exit-button" onClick={onExit}>Exit</button>
                </div>
            </div>
        </div>
    );
}
