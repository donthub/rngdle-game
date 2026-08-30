import React from "react";

import CharacterSelector from "./CharacterSelector.jsx";
import { GameStatus } from "../gameStatus.js";

export default function PlayerPanel({ player, label, name, onNameChange, score, character, onSelectCharacter, gameStatus }) {
    return (
        <div className="player-container">
            <div className="player-name">
                <span>{label}: </span>
                {gameStatus === GameStatus.WAITING ? (
                    <input type="text" className={`${player}-name-input`} value={name} onChange={event => onNameChange(event.target.value)}/>
                ) : (
                    <span className={`${player}-name`}>{name}</span>
                )}
            </div>
            {gameStatus !== GameStatus.WAITING && (
                <div className={`player-score ${player}-score`}>{score.toLocaleString("en-US")}</div>
            )}
            {gameStatus === GameStatus.WAITING && (
                <div className="player-character-container">
                    <CharacterSelector player={player} onSelect={onSelectCharacter}/>
                    {character && (
                        <>
                            <div className="player-character-nameplate">
                                <img alt={`${character.name} nameplate`} src={`assets/${character.id}/nameplate.png`} />
                            </div>
                            <div className="player-character-portrait">
                                <img alt={`${character.name} portrait`} src={`assets/${character.id}/portrait.png`} />
                            </div>
                        </>

                    )}
                </div>
            )}
        </div>
    );
}
