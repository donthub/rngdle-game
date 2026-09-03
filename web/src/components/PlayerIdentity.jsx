import classNames from "../classNames.js";
import { PLAYER_LABELS } from "../players.js";

// P1/P2 tag next to the name, or the P1/P2 label while the name is still blank.
export default function PlayerIdentity({ player, name, mirrored = false }) {
    return (
        <div className={classNames("player-identity", mirrored && "player-identity-mirrored")}>
            <span className={`player-tag ${player}-tag`}>{player.toUpperCase()}</span>
            <span className={classNames("player-name", name === "" && "player-name-muted")}>
                {name === "" ? PLAYER_LABELS[player] : name}
            </span>
        </div>
    );
}
