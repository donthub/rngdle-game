import React from "react";

export default function PlayerNameScorePanel({ player, label, name, score }) {
    return (
        <div className="flex-col">
            <div className="flex player-score">
                <span>{label}: </span>
                <span className={`${player}-name`}>{name}</span>
            </div>
            <div className={`flex player-score ${player}-score`}>{score.toLocaleString("en-US")}</div>
        </div>
    );
}
