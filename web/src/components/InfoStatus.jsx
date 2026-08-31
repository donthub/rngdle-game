import React from "react";

export default function InfoStatus({ gameStatus }) {
    return (
        <div className="flex">
            <span>Game status: </span><span className="game-status">{gameStatus.label}</span>
        </div>
    );
}
