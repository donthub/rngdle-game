import React from "react";

import { characterAssetUrl } from "../characters.js";
import PlayerStage from "./PlayerStage.jsx";

export default function PlayerActionPanel({ player, character, action }) {
    const currentAction = action ?? characterAssetUrl(character, "idle");
    const [previousAction, setPreviousAction] = React.useState(null);
    const [renderedAction, setRenderedAction] = React.useState(currentAction);

    if (renderedAction !== currentAction) {
        setPreviousAction(renderedAction);
        setRenderedAction(currentAction);
    }

    return (
        <PlayerStage player={player}>
            {previousAction === null ? null :
                <img key={`previous-${previousAction}`}
                     className="player-action-image player-action-previous"
                     alt=""
                     src={previousAction}
                     onAnimationEnd={() => setPreviousAction(null)}/>}
            <img key={`current-${currentAction}`}
                 className="player-action-image player-action-current"
                 alt={`${character.name} ${action === null ? "idle" : "move"}`}
                 src={currentAction}/>
        </PlayerStage>
    );
}
