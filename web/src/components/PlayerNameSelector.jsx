// A cross drawn on the same 12px grid as the other inline icons
function ClearIcon() {
    return (
        <svg className="icon-clear" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
            <path d="M3 3 9 9M9 3 3 9"/>
        </svg>
    );
}

export default function PlayerNameSelector({ player, label, name, active, onNameChange }) {
    return (
        <div className={`name-field${active ? ` ${player}-name-field-active` : ""}`}>
            <span className={`player-tag ${player}-tag`}>{player.toUpperCase()}</span>
            <input type="text"
                   className="name-field-input"
                   placeholder={label}
                   value={name}
                   onChange={event => onNameChange(event.target.value)}/>
            <button type="button"
                    className="name-field-clear"
                    aria-label={`Clear ${label} name`}
                    title="Clear name"
                    disabled={!name}
                    onClick={() => onNameChange("")}>
                <ClearIcon/>
            </button>
        </div>
    );
}
