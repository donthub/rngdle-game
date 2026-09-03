import PlayerColumn from "../components/PlayerColumn.jsx";
import PlayerIdentity from "../components/PlayerIdentity.jsx";
import PlayerResultPanel from "../components/PlayerResultPanel.jsx";
import ScoreLine from "../components/ScoreLine.jsx";
import { PLAYER_LABELS } from "../players.js";

const DRAW = Object.freeze({ subject: "Draw!", predicate: null, className: "winner-draw", player: null });

// The winner is announced by the name its player typed, falling back to the P1/P2 label
// while that is still blank (the same fallback PlayerIdentity uses).
function announce(player, states) {
    const name = states[player].name;
    return {
        subject: name === "" ? PLAYER_LABELS[player] : name,
        predicate: "wins!",
        className: `winner-${player}`,
        player,
    };
}

// A game ending badge is rare enough that rolling one alone takes the game, however the
// scores landed; if both sides rolled one the scores settle it as usual (see badges.js).
function resolveWinner(states, destroyers) {
    if (destroyers.length === 1) {
        return announce(destroyers[0], states);
    }
    if (states.p1.score > states.p2.score) {
        return announce("p1", states);
    }
    if (states.p2.score > states.p1.score) {
        return announce("p2", states);
    }
    return DRAW;
}

// The scores stay up on the line where they finished (see ScoreLine.jsx), so the columns
// carry their own name and the art. On a draw neither side is tinted, and nobody is
// destroyed either.
function ResultColumn({ player, state, winner, destroyers }) {
    const won = winner.player === player;
    const drawn = winner.player === null;
    // A game ending badge cut the game short, so whoever did not take it is stamped
    const gameWasCut = destroyers.length > 0;
    const finishedByBadge = won && destroyers.includes(player);
    return (
        <PlayerColumn player={player} active={won} winner={won}>
            <div className="player-body player-body-stage">
                <PlayerIdentity player={player}
                                name={state.name}
                                mirrored={player === "p2"}/>
                <PlayerResultPanel player={player}
                                   character={state.character}
                                   winner={won}
                                   destroyed={gameWasCut && !won && !drawn}
                                   action={state.action}
                                   finishedByBadge={finishedByBadge}/>
            </div>
        </PlayerColumn>
    );
}

export default function FinishedPage({ currentRound, rounds, p1, p2, destroyers, onRematch, onReset, onExit }) {
    const winner = resolveWinner({ p1, p2 }, destroyers);
    return (
        <div className="board-layout">
            <ScoreLine p1={p1} p2={p2} leader={winner.player}/>
            <div className="board-triptych">
                <ResultColumn player="p1" state={p1} winner={winner} destroyers={destroyers}/>
                <div className="center-column center-column-result">
                    <span className="section-label">Result</span>
                    <div className="result-headline">
                        <span className={`result-subject ${winner.className}`}>{winner.subject}</span>
                        {winner.predicate === null ? null :
                            <span className="result-predicate">{winner.predicate}</span>}
                    </div>
                    <div className="result-rounds">
                        <span className="result-rounds-count">{currentRound} / {rounds}</span>
                        <span className="result-rounds-label">rounds played</span>
                    </div>
                    <div className="divider divider-short"/>
                    <div className="button-row">
                        <button type="button" className="button button-primary"
                                onClick={onReset}>Reset</button>
                        <button type="button" className="button button-secondary"
                                onClick={onRematch}>Rematch</button>
                        <button type="button" className="button button-secondary"
                                onClick={onExit}>Exit</button>
                    </div>
                </div>
                <ResultColumn player="p2" state={p2} winner={winner} destroyers={destroyers}/>
            </div>
        </div>
    );
}
