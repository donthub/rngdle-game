import { characterAssetUrl } from "../characters.js";
import PlayerStage from "./PlayerStage.jsx";

const DESTROYED_IMAGE = "/assets/destroyed.png";

// The destroyed wordmark is stamped over the lose art when a game ending badge cut the
// game short (see badges.js). The last action image is kept when that badge is what won
// the game, so the finishing move stays up instead of the idle art.
export default function PlayerResultPanel({ player, character, winner, destroyed, action, finishedByBadge }) {
    const result = winner ? "idle" : "lose";
    // What the action panel was showing when the game ended (see PlayerActionPanel.jsx).
    const shownImage = action ?? characterAssetUrl(character, "idle");
    const image = finishedByBadge ? shownImage : characterAssetUrl(character, result);
    // Art the player is already looking at stays put; only a swap is faded in.
    const fadeIn = image === shownImage ? "" : " player-action-current";
    return (
        <PlayerStage player={player}>
            <img className={`player-action-image${fadeIn}`}
                 alt={`${character.name} ${image === action ? "move" : result}`}
                 src={image}/>
            {destroyed ?
                <div className="player-destroyed">
                    <img className="player-destroyed-image" alt="Destroyed" src={DESTROYED_IMAGE}/>
                </div> : null}
        </PlayerStage>
    );
}
