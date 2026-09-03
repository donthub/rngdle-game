import classNames from "../classNames.js";

export default function PlayerScore({ score, muted = false, className = "" }) {
    return (
        <div className={classNames("player-score", className, muted && "player-score-muted")}>
            <span className="player-score-value">{score.toLocaleString("en-US")}</span>
            <span className="player-score-unit">EP</span>
        </div>
    );
}
