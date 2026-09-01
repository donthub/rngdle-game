// Past this many rounds the per-round numerals stop being legible, so only the bars are drawn.
const MAX_METER_LABELS = 10;

function meterClass(base, round, currentRound) {
    if (round === currentRound) {
        return `${base} ${base}-current`;
    }
    if (round < currentRound) {
        return `${base} ${base}-done`;
    }
    return base;
}

export default function InfoRounds({ currentRound, rounds }) {
    const roundNumbers = Array.from({ length: rounds }, (_, index) => index + 1);
    return (
        <>
            <div className="round-block">
                <span className="section-label">Round</span>
                <div className="round-counter">
                    <span className="round-counter-current">{currentRound}</span>
                    <span className="round-counter-separator">/</span>
                    <span className="round-counter-total">{rounds}</span>
                </div>
            </div>
            <div className="round-meter">
                <div className="round-meter-track">
                    {roundNumbers.map(round => (
                        <span key={round} className={meterClass("round-meter-bar", round, currentRound)}/>
                    ))}
                </div>
                {roundNumbers.length > MAX_METER_LABELS ? null : (
                    <div className="round-meter-labels">
                        {roundNumbers.map(round => (
                            <span key={round} className={meterClass("round-meter-label", round, currentRound)}>
                                {round}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
