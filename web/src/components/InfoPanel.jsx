import React from "react";
import { GameStatus } from "../gameStatus.js";

export default function InfoPanel({ currentRound, rounds, onRoundsChange, gameStatus, winner }) {
    return (
        <div className="info-container">
            <div className="info-rounds">
                {gameStatus === GameStatus.WAITING ? (
                    <>
                        Rounds: <input type="number" value={rounds} onChange={event => onRoundsChange(event.target.value)} />
                    </>
                ) : (
                    <>
                        Round <span className="current-round">{currentRound}</span>/<span className="game-rounds">{rounds}</span>
                    </>
                )}
            </div>
            <div className="info-status">
                <span>Game status: </span><span className="game-status">{gameStatus.label}</span>
            </div>
            <div className="info-winner" style={winner ? { color: winner.color } : undefined}>
                {winner ? winner.text : ""}
            </div>
        </div>
    );
}
