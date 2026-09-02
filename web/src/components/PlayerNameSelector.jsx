import { PLAYER_NAME_MAX_LENGTH } from "../players.js";

export default function PlayerNameSelector({ player, label, name, active, onNameChange }) {
    return (
        <div className={`name-field${active ? ` ${player}-name-field-active` : ""}`}>
            <span className={`player-tag ${player}-tag`}>{player.toUpperCase()}</span>
            <input type="text"
                   className="name-field-input"
                   maxLength={PLAYER_NAME_MAX_LENGTH}
                   placeholder={label}
                   value={name}
                   onChange={event => onNameChange(event.target.value)}/>
        </div>
    );
}
