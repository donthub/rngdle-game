import React from "react";

import { characterAssetUrl, randomCharacterWinImage } from "../characters.js";
import classNames from "../classNames.js";
import PlayerStage from "./PlayerStage.jsx";

const DESTROYED_IMAGE = "/assets/destroyed.png";

// The destroyed wordmark is stamped over the lose art when a game ending badge cut the
// game short (see badges.js). The last action image is kept when that badge is what won
// the game, so the finishing move stays up instead of the win pose.
export default function PlayerResultPanel({ player, character, winner, destroyed, action, finishedByBadge }) {
    const result = winner ? "win" : "lose";
    // Drawn once so a re-render of the result page does not swap the pose out mid-look.
    const winImage = React.useMemo(() => randomCharacterWinImage(character), [character]);
    // What the action panel was showing when the game ended (see PlayerActionPanel.jsx).
    const shownImage = action ?? characterAssetUrl(character, "idle");
    const resultImage = winner ? winImage : characterAssetUrl(character, result);
    const image = finishedByBadge ? shownImage : resultImage;
    // Art the player is already looking at stays put; only a swap is faded in.
    const swapped = image !== shownImage;
    return (
        <PlayerStage player={player}>
            <img className={classNames("player-action-image", swapped && "player-action-current")}
                 alt={`${character.name} ${image === action ? "move" : result}`}
                 src={image}/>
            {destroyed ?
                <div className="player-destroyed">
                    <img className="player-destroyed-image" alt="Destroyed" src={DESTROYED_IMAGE}/>
                </div> : null}
        </PlayerStage>
    );
}
