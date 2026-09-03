import classNames from "../classNames.js";
import PlayerScore from "./PlayerScore.jsx";

function leadingPlayer(p1Score, p2Score) {
    if (p1Score === p2Score) {
        return null;
    }
    return p1Score > p2Score ? "p1" : "p2";
}

export default function ScoreLine({ p1, p2, leader = leadingPlayer(p1.score, p2.score) }) {
    const total = p1.score + p2.score;
    // Nobody has scored yet, so nobody owns any of the line
    const level = total === 0;
    const seam = `${((level ? 0.5 : p1.score / total) * 100).toFixed(3)}%`;
    return (
        <div className={classNames("score-line-band", level && "score-line-band-level")}
             style={{ "--score-line-seam": seam }}>
            <div className="score-line-row">
                <span className="score-line-even-label">Even</span>
                <span className="score-line-even-tick"/>
                <span className="score-line-side score-line-p1"/>
                <span className="score-line-side score-line-p2"/>
                <span className="score-line-marker"/>
            </div>
            <div className="score-line-lower">
                <div className="score-line-scores">
                    <PlayerScore score={p1.score} muted={leader === "p2"} className="score-line-score score-line-score-p1"/>
                    <span className="score-line-score-gap"/>
                    <PlayerScore score={p2.score} muted={leader === "p1"} className="score-line-score score-line-score-p2"/>
                </div>
            </div>
        </div>
    );
}
