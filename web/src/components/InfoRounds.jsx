export default function InfoRounds({ currentRound, rounds }) {
    return (
        <div className="flex">
            Round <span className="current-round">{currentRound}</span>/<span className="game-rounds">{rounds}</span>
        </div>
    );
}
