import React from "react";

import CharacterSelector from "../components/CharacterSelector.jsx";
import PlayerCharacter from "../components/PlayerCharacter.jsx";
import PlayerColumn from "../components/PlayerColumn.jsx";
import PlayerNameSelector from "../components/PlayerNameSelector.jsx";
import RoundsSelector from "../components/RoundsSelector.jsx";

// The side receiving the next character pick is the active one, and it shows the
// hovered portrait in place of its own until the pointer leaves the roster.
function SetupColumn({ player, state, active, preview }) {
    return (
        <PlayerColumn player={player} active={active}>
            <div className="player-setup">
                <PlayerNameSelector player={player}
                                    name={state.name}
                                    active={active}
                                    onNameChange={state.onNameChange}/>
                <PlayerCharacter character={preview ?? state.character} preview={Boolean(preview)}/>
            </div>
        </PlayerColumn>
    );
}

export default function WaitingPage({ rounds, onRoundsChange, onSelectCharacter, onResetPicks, nextPlayer,
                                      p1, p2, onStart, onExit }) {
    const [hoveredCharacter, setHoveredCharacter] = React.useState(null);

    return (
        <>
            <SetupColumn player="p1" state={p1} active={nextPlayer === "p1"}
                         preview={nextPlayer === "p1" ? hoveredCharacter : null}/>
            <div className="center-column center-column-setup">
                <RoundsSelector rounds={rounds} onRoundsChange={onRoundsChange}/>
                <div className="divider"/>
                <CharacterSelector nextPlayer={nextPlayer}
                                   picks={{ p1: p1.character, p2: p2.character }}
                                   hovered={hoveredCharacter}
                                   onSelectCharacter={onSelectCharacter}
                                   onResetPicks={onResetPicks}
                                   onHoverCharacter={setHoveredCharacter}/>
                <div className="divider"/>
                <div className="button-row">
                    <button type="button" className="button button-primary" onClick={onStart}>Fight!</button>
                    <button type="button" className="button button-secondary" onClick={onExit}>Exit</button>
                </div>
            </div>
            <SetupColumn player="p2" state={p2} active={nextPlayer === "p2"}
                         preview={nextPlayer === "p2" ? hoveredCharacter : null}/>
        </>
    );
}
