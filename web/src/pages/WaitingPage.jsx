import CharacterSelector from "../components/CharacterSelector.jsx";
import PlayerCharacter from "../components/PlayerCharacter.jsx";
import PlayerColumn from "../components/PlayerColumn.jsx";
import PlayerNameSelector from "../components/PlayerNameSelector.jsx";
import RoundsSelector from "../components/RoundsSelector.jsx";
import { PLAYER_LABELS } from "../players.js";

// The side receiving the next character pick is the active one.
function SetupColumn({ player, state, active }) {
    return (
        <PlayerColumn player={player} active={active}>
            <div className="player-setup">
                <PlayerNameSelector player={player}
                                    label={PLAYER_LABELS[player]}
                                    name={state.name}
                                    active={active}
                                    onNameChange={state.onNameChange}/>
                <PlayerCharacter character={state.character}/>
            </div>
        </PlayerColumn>
    );
}

export default function WaitingPage({ rounds, onRoundsChange, onSelectCharacter, nextPlayer, p1, p2, onStart, onExit }) {
    return (
        <>
            <SetupColumn player="p1" state={p1} active={nextPlayer === "p1"}/>
            <div className="center-column center-column-setup">
                <RoundsSelector rounds={rounds} onRoundsChange={onRoundsChange}/>
                <div className="divider"/>
                <CharacterSelector nextPlayer={nextPlayer} onSelectCharacter={onSelectCharacter}/>
                <div className="divider"/>
                <div className="button-row">
                    <button type="button" className="button button-primary" onClick={onStart}>Fight!</button>
                    <button type="button" className="button button-secondary" onClick={onExit}>Exit</button>
                </div>
            </div>
            <SetupColumn player="p2" state={p2} active={nextPlayer === "p2"}/>
        </>
    );
}
