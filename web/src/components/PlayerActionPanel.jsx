import React from "react";

export default function PlayerActionPanel({ player, character, action }) {
    return (
        <div className={`player-action-container ${player}-action`}>
            {action === null ? null : <img alt={`${character.name} move`} src={action}/>}
        </div>
    );
}
