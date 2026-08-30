import React from "react";

import PlayerNameScorePanel from "../components/PlayerNameScorePanel.jsx";
import InfoRounds from "../components/InfoRounds.jsx";
import InfoStatus from "../components/InfoStatus.jsx";

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
            <div className="main-container">
                <div className="player-container">
                    <PlayerNameScorePanel player="p1" label="Player 1" {...p1}/>
                </div>
                <div className="info-container">
                    <InfoRounds currentRound={currentRound} rounds={rounds} />
                    <InfoStatus gameStatus={gameStatus}/>
                    <div className="winner-container" style={{ color: winner.color }}>
                        {winner.text}
                    </div>
                </div>
                <div className="player-container">
                    <PlayerNameScorePanel player="p2" label="Player 2" {...p2}/>
                </div>
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
