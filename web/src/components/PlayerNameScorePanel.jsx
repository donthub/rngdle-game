export default function PlayerNameScorePanel({ player, label, name, score, muted = false }) {
    const mirrored = player === "p2";
    return (
        <div className={`player-header${mirrored ? " player-header-mirrored" : ""}`}>
            <div className="player-identity">
                <span className={`player-tag ${player}-tag${muted ? "-muted" : ""}`}>{player.toUpperCase()}</span>
                <span className={`player-name${muted || name === "" ? " player-name-muted" : ""}`}>
                    {name === "" ? label : name}
                </span>
            </div>
            <div className={`player-score${muted ? " player-score-muted" : ""}`}>
                <span className="player-score-value">{score.toLocaleString("en-US")}</span>
                <span className="player-score-unit">EP</span>
            </div>
        </div>
    );
}
