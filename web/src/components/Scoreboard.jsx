import React from "react";

import PlayerScorePanel from "./PlayerScorePanel.jsx";
import InfoStatus from "./InfoStatus.jsx";

export default function Scoreboard({ gameStatus, currentRound, rounds, p1, p2 }) {
    return (
        <div className="main-container">
            <PlayerScorePanel player="p1" label="Player 1" {...p1}/>
            <div className="info-container">
                <div className="info-rounds">
                    Round <span className="current-round">{currentRound}</span>/<span className="game-rounds">{rounds}</span>
                </div>
                <InfoStatus gameStatus={gameStatus}/>
            </div>
            <PlayerScorePanel player="p2" label="Player 2" {...p2}/>
        </div>
    );
}
