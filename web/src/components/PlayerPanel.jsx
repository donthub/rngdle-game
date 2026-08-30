import React from "react";

import CharacterSelector from "./CharacterSelector.jsx";
import { GameStatus } from "../gameStatus.js";

export default function PlayerPanel({ player, label, name, score, character, onSelectCharacter, gameStatus }) {
    return (
        <div className="player-container">
            <div className="player-name">
                <span>{label}: </span>
                <span className={`${player}-name`}>{name}</span>
            </div>
            <div className={`player-score ${player}-score`}>{score.toLocaleString("en-US")}</div>
            {gameStatus === GameStatus.WAITING && (
                <div className="player-character-container">
                    <CharacterSelector player={player} onSelect={onSelectCharacter}/>
                    <div className="character-name">
                        <span>Selected character: </span>
                        <span className={`character-name-${player}`}>{character ? character.name : ""}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
