import React from "react";

export default function InfoPanel({ gameStatus, children }) {
    return (
        <div className="info-container">
            <div className="info-rounds">{children}</div>
            <div className="info-status">
                <span>Game status: </span><span className="game-status">{gameStatus.label}</span>
            </div>
        </div>
    );
}
