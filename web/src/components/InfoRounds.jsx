import React from "react";

export default function InfoRounds({ currentRound, rounds }) {
    return (
        <div className="info-rounds">
            Round <span className="current-round">{currentRound}</span>/<span className="game-rounds">{rounds}</span>
        </div>
    );
}
