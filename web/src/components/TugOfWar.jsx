import PlayerIdentity from "./PlayerIdentity.jsx";
import PlayerScore from "./PlayerScore.jsx";
import { PLAYER_LABELS } from "../players.js";

function leadingPlayer(p1Score, p2Score) {
    if (p1Score === p2Score) {
        return null;
    }
    return p1Score > p2Score ? "p1" : "p2";
}

export default function TugOfWar({ p1, p2, leader = leadingPlayer(p1.score, p2.score) }) {
    const total = p1.score + p2.score;
    // Nobody has scored yet, so nobody owns any of the rope
    const level = total === 0;
    const seam = `${((level ? 0.5 : p1.score / total) * 100).toFixed(3)}%`;
    return (
        <div className={`tug-band${level ? " tug-band-level" : ""}`} style={{ "--tug-seam": seam }}>
            <div className="tug-rope">
                <span className="tug-even-label">Even</span>
                <span className="tug-even-tick"/>
                <span className="tug-rope-side tug-rope-p1"/>
                <span className="tug-rope-side tug-rope-p2"/>
                <span className="tug-knot"/>
            </div>
            <div className="tug-lower">
                <PlayerIdentity player="p1" label={PLAYER_LABELS.p1} name={p1.name}/>
                <span className="tug-baseline" aria-hidden="true">0</span>
                <PlayerIdentity player="p2" label={PLAYER_LABELS.p2} name={p2.name} mirrored/>
                <div className="tug-scores">
                    <PlayerScore score={p1.score} muted={leader === "p2"} className="tug-score tug-score-p1"/>
                    <span className="tug-score-gap"/>
                    <PlayerScore score={p2.score} muted={leader === "p1"} className="tug-score tug-score-p2"/>
                </div>
            </div>
        </div>
    );
}
