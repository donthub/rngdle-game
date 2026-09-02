import React from "react";

const MIN_ROUNDS = 1;

export default function RoundsSelector({ rounds, onRoundsChange }) {
    // While the field is being typed into it can hold a value that is not a round count
    // yet (an emptied field most of all), so the text lives here until it is committed.
    const [draft, setDraft] = React.useState(null);

    const commit = () => {
        const value = Number.parseInt(draft, 10);
        setDraft(null);
        if (!Number.isNaN(value)) {
            onRoundsChange(Math.max(value, MIN_ROUNDS));
        }
    };
    const onKeyDown = event => {
        if (event.key === "Enter") {
            event.target.blur();
        } else if (event.key === "Escape") {
            setDraft(null);
            event.target.blur();
        }
    };

    return (
        <div className="rounds-selector">
            <span className="section-label">Rounds</span>
            <div className="rounds-stepper">
                <button type="button"
                        className="rounds-stepper-button"
                        aria-label="One round fewer"
                        disabled={rounds <= MIN_ROUNDS}
                        onClick={() => onRoundsChange(rounds - 1)}>&minus;</button>
                <input type="text"
                       inputMode="numeric"
                       className="rounds-stepper-value"
                       aria-label="Number of rounds"
                       value={draft ?? rounds}
                       onChange={event => setDraft(event.target.value.replace(/\D/g, ""))}
                       onFocus={event => event.target.select()}
                       onBlur={commit}
                       onKeyDown={onKeyDown}/>
                <button type="button"
                        className="rounds-stepper-button"
                        aria-label="One round more"
                        onClick={() => onRoundsChange(rounds + 1)}>+</button>
            </div>
        </div>
    );
}
