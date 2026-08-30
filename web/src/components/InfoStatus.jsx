import React from "react";

export default function InfoStatus({ gameStatus }) {
    return (
        <div className="info-status">
            <span>Game status: </span><span className="game-status">{gameStatus.label}</span>
        </div>
    );
}
