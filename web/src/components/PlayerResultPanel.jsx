import { characterAssetUrl } from "../characters.js";
import PlayerStage from "./PlayerStage.jsx";

const DESTROYED_IMAGE = "/assets/destroyed.png";

// The destroyed wordmark is stamped over the lose art when a game ending badge cut the
// game short (see badges.js).
export default function PlayerResultPanel({ player, character, winner, destroyed }) {
    const result = winner ? "idle" : "lose";
    return (
        <PlayerStage player={player}>
            <img className="player-action-image player-action-current"
                 alt={`${character.name} ${result}`}
                 src={characterAssetUrl(character, result)}/>
            {destroyed ?
                <div className="player-destroyed">
                    <img className="player-destroyed-image" alt="Destroyed" src={DESTROYED_IMAGE}/>
                </div> : null}
        </PlayerStage>
    );
}
