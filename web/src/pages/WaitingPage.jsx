import React from "react";
import InfoStatus from "../components/InfoStatus.jsx";
import CharacterSelector from "../components/CharacterSelector.jsx";
import PlayerNameSelector from "../components/PlayerNameSelector.jsx";
import RoundsSelector from "../components/RoundsSelector.jsx";
import PlayerCharacter from "../components/PlayerCharacter.jsx";

export default function WaitingPage({ gameStatus, rounds, onRoundsChange, onSelectCharacter, p1, p2, onStart, onExit }) {
    return (
        <div className="flex-col w-100">
            <div className="flex-row">
                <div className="flex-col">
                    <PlayerNameSelector label="Player 1" {...p1} />
                    <PlayerCharacter {...p1} />
                </div>
                <div className="flex-col">
                    <div className="flex-col">
                        <RoundsSelector rounds={rounds}
                                        onRoundsChange={onRoundsChange}/>
                        <InfoStatus gameStatus={gameStatus}/>
                    </div>
                    <CharacterSelector onSelectCharacter={onSelectCharacter} />
                </div>
                <div className="flex-col">
                    <PlayerNameSelector label="Player 2" {...p2} />
                    <PlayerCharacter {...p2} />
                </div>
            </div>
            <div className="flex-row">
                <div className="flex">
                    <button onClick={onStart}>Fight!</button>
                </div>
                <div className="flex">
                    <button onClick={onExit}>Exit</button>
                </div>
            </div>
        </div>
    );
}
