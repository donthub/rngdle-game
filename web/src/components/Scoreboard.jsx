import React from "react";

import InfoPanel from "./InfoPanel.jsx";
import PlayerScorePanel from "./PlayerScorePanel.jsx";

export default function Scoreboard({ gameStatus, currentRound, rounds, p1, p2 }) {
    return (
        <div className="main-container">
            <PlayerScorePanel player="p1" label="Player 1" {...p1}/>
            <InfoPanel gameStatus={gameStatus}>
                Round <span className="current-round">{currentRound}</span>/<span className="game-rounds">{rounds}</span>
            </InfoPanel>
            <PlayerScorePanel player="p2" label="Player 2" {...p2}/>
        </div>
    );
}
