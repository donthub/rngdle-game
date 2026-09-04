import classNames from "../classNames.js";
import PlayerIdentity from "./PlayerIdentity.jsx";
import PlayerTally from "./PlayerTally.jsx";

// The name and the badges the player has rolled share one line across the top of the
// column, held apart at its two ends: the name on the outer edge, the tally in the corner
// closer to the middle of the board. The row is mirrored for p2, so both sides read
// outward from the middle (see PlayerTally.jsx).
export default function PlayerHeader({ player, name, badges, settled = false }) {
    const mirrored = player === "p2";
    return (
        <div className={classNames("player-header", mirrored && "player-header-mirrored")}>
            <PlayerIdentity player={player} name={name} mirrored={mirrored}/>
            <PlayerTally player={player} badges={badges} settled={settled}/>
        </div>
    );
}
