import React from "react";
import PlayerScorePanel from "../components/PlayerScorePanel.jsx";
import InfoRounds from "../components/InfoRounds.jsx";
import InfoStatus from "../components/InfoStatus.jsx";

export default function InProgressPage({ gameStatus, currentRound, rounds, p1, p2 }) {
    return (
        <div className="container">
            <div className="main-container">
                <PlayerScorePanel player="p1" label="Player 1" {...p1}/>
                <div className="info-container">
                    <InfoRounds currentRound={currentRound} rounds={rounds}/>
                    <InfoStatus gameStatus={gameStatus}/>
                </div>
                <PlayerScorePanel player="p2" label="Player 2" {...p2}/>
            </div>
        </div>
    );
}
