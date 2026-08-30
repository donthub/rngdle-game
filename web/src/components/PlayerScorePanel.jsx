import React from "react";

export default function PlayerScorePanel({ player, label, name, score }) {
    return (
        <div className="player-container">
            <div className="player-name">
                <span>{label}: </span>
                <span className={`${player}-name`}>{name}</span>
            </div>
            <div className={`player-score ${player}-score`}>{score.toLocaleString("en-US")}</div>
        </div>
    );
}
