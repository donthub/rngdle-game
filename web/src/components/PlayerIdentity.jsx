// P1/P2 tag next to the name, or the fallback label while the name is still blank.
export default function PlayerIdentity({ player, label, name, muted = false, mirrored = false }) {
    return (
        <div className={`player-identity${mirrored ? " player-identity-mirrored" : ""}`}>
            <span className={`player-tag ${player}-tag${muted ? "-muted" : ""}`}>{player.toUpperCase()}</span>
            <span className={`player-name${muted || name === "" ? " player-name-muted" : ""}`}>
                {name === "" ? label : name}
            </span>
        </div>
    );
}
