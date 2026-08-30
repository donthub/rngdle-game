import React from "react";

import Scoreboard from "../components/Scoreboard.jsx";

export default function InProgressPage({ gameStatus, currentRound, rounds, p1, p2 }) {
    return (
        <div className="container">
            <Scoreboard gameStatus={gameStatus} currentRound={currentRound} rounds={rounds} p1={p1} p2={p2}/>
        </div>
    );
}
