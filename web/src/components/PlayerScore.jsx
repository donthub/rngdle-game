export default function PlayerScore({ score, muted = false, className = "" }) {
    const modifiers = `${muted ? " player-score-muted" : ""}${className === "" ? "" : ` ${className}`}`;
    return (
        <div className={`player-score${modifiers}`}>
            <span className="player-score-value">{score.toLocaleString("en-US")}</span>
            <span className="player-score-unit">EP</span>
        </div>
    );
}
