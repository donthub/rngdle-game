import PlayerColumn from "../components/PlayerColumn.jsx";
import PlayerNameScorePanel from "../components/PlayerNameScorePanel.jsx";
import PlayerResultPanel from "../components/PlayerResultPanel.jsx";
import { PLAYER_LABELS } from "../players.js";

function resolveWinner(p1Score, p2Score) {
    if (p1Score > p2Score) {
        return { subject: "Player 1", predicate: "wins!", className: "winner-p1", player: "p1" };
    }
    if (p2Score > p1Score) {
        return { subject: "Player 2", predicate: "wins!", className: "winner-p2", player: "p2" };
    }
    return { subject: "Draw!", predicate: null, className: "winner-draw", player: null };
}

// On a draw neither side is tinted or dimmed, so the two columns read as equals, and
// nobody is destroyed either.
function ResultColumn({ player, state, winner, destroyed }) {
    const won = winner.player === player;
    const drawn = winner.player === null;
    return (
        <PlayerColumn player={player} active={won} winner={won}>
            <div className="player-body">
                <PlayerNameScorePanel player={player}
                                      label={PLAYER_LABELS[player]}
                                      name={state.name}
                                      score={state.score}
                                      muted={!won && !drawn}/>
                <div className="player-divider"/>
                <PlayerResultPanel player={player}
                                   character={state.character}
                                   winner={won}
                                   destroyed={destroyed && !won && !drawn}/>
            </div>
        </PlayerColumn>
    );
}

export default function FinishedPage({ currentRound, rounds, p1, p2, destroyed, onReset, onExit }) {
    const winner = resolveWinner(p1.score, p2.score);
    return (
        <>
            <ResultColumn player="p1" state={p1} winner={winner} destroyed={destroyed}/>
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
                    <button type="button" className="button button-primary" onClick={onReset}>Reset</button>
                    <button type="button" className="button button-secondary" onClick={onExit}>Exit</button>
                </div>
            </div>
            <ResultColumn player="p2" state={p2} winner={winner} destroyed={destroyed}/>
        </>
    );
}
