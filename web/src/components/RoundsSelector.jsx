const MIN_ROUNDS = 1;

export default function RoundsSelector({ rounds, onRoundsChange }) {
    return (
        <div className="rounds-selector">
            <span className="section-label">Rounds</span>
            <div className="rounds-stepper">
                <button type="button"
                        className="rounds-stepper-button"
                        aria-label="One round fewer"
                        disabled={rounds <= MIN_ROUNDS}
                        onClick={() => onRoundsChange(rounds - 1)}>&minus;</button>
                <span className="rounds-stepper-value">{rounds}</span>
                <button type="button"
                        className="rounds-stepper-button"
                        aria-label="One round more"
                        onClick={() => onRoundsChange(rounds + 1)}>+</button>
            </div>
        </div>
    );
}
