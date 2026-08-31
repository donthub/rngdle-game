import React from "react";

export default function RoundsSelector({ rounds, onRoundsChange }) {
    return (
        <div className="flex">
            Rounds: <input type="number"
                           value={rounds}
                           onChange={event => onRoundsChange(event.target.value)}/>
        </div>
    );
}
