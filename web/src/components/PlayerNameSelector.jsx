export default function PlayerNameSelector({ label, name, onNameChange }) {
    return (
        <div className="flex">
            <input type="text" placeholder={label} className="player-name-input" value={name}
                   onChange={event => onNameChange(event.target.value)}/>
        </div>
    );
}
