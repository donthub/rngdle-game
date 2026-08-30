import React from "react";

import PlayerSetupPanel from "../components/PlayerSetupPanel.jsx";
import InfoStatus from "../components/InfoStatus.jsx";

export default function WaitingPage({ gameStatus, rounds, onRoundsChange, p1, p2, onStart, onExit }) {
    return (
        <div className="container">
            <div className="main-container">
                <PlayerSetupPanel player="p1" label="Player 1" {...p1}/>
                <div className="info-container">
                    <div className="info-rounds">
                        Rounds: <input type="number"
                                       value={rounds}
                                       onChange={event => onRoundsChange(event.target.value)}/>
                    </div>
                    <InfoStatus gameStatus={gameStatus}/>
                </div>
                <PlayerSetupPanel player="p2" label="Player 2" {...p2}/>
            </div>
            <div className="controls-container">
                <div className="start-container">
                    <button className="start-button" onClick={onStart}>Fight!</button>
                </div>
                <div className="exit-container">
                    <button className="exit-button" onClick={onExit}>Exit</button>
                </div>
            </div>
        </div>
    );
}
