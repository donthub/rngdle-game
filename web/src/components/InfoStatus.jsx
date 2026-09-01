// GameStatus.WAITING -> "waiting", GameStatus.IN_PROGRESS -> "in-progress"
function statusModifier(gameStatus) {
    return gameStatus.key.toLowerCase().replaceAll("_", "-");
}

export default function InfoStatus({ gameStatus }) {
    return (
        <div className="game-status">
            <span className={`game-status-dot game-status-dot-${statusModifier(gameStatus)}`}/>
            <span className="game-status-label">{gameStatus.label}</span>
        </div>
    );
}
