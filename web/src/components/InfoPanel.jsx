import React from "react";

export default function InfoPanel({ currentRound, rounds, status, winner }) {
    return (
        <div className="info-container">
            <div className="info-rounds">
                Round <span className="current-round">{currentRound}</span>/<span className="game-rounds">{rounds}</span>
            </div>
            <div className="info-status">
                <span>Game status: </span><span className="game-status">{status}</span>
            </div>
            <div className="info-winner" style={winner ? { color: winner.color } : undefined}>
                {winner ? winner.text : ""}
            </div>
        </div>
    );
}
