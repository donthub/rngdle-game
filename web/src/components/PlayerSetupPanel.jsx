import React from "react";

import CharacterSelector from "./CharacterSelector.jsx";

export default function PlayerSetupPanel({ player, label, name, onNameChange, character, onSelectCharacter }) {
    return (
        <div className="player-container">
            <div className="player-name">
                <span>{label}: </span>
                <input type="text" className={`${player}-name-input`} value={name}
                       onChange={event => onNameChange(event.target.value)}/>
            </div>
            <div className="player-character-container">
                <CharacterSelector player={player} onSelect={onSelectCharacter}/>
                {character && (
                    <>
                        <div className="player-character-nameplate">
                            <img alt={`${character.name} nameplate`} src={`assets/${character.id}/nameplate.png`}/>
                        </div>
                        <div className="player-character-portrait">
                            <img alt={`${character.name} portrait`} src={`assets/${character.id}/portrait.png`}/>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
