import React from "react";

export default function PlayerActionPanel({ player, character, action }) {
    const [previousAction, setPreviousAction] = React.useState(null);
    const [renderedAction, setRenderedAction] = React.useState(action);

    if (renderedAction !== action) {
        setPreviousAction(renderedAction);
        setRenderedAction(action);
    }

    return (
        <div className={`player-action-container ${player}-action`}>
            {previousAction === null ? null :
                <img key={`previous-${previousAction}`}
                     className="player-action-image player-action-previous"
                     alt=""
                     src={previousAction}
                     onAnimationEnd={() => setPreviousAction(null)}/>}
            {action === null ? null :
                <img key={`current-${action}`}
                     className="player-action-image player-action-current"
                     alt={`${character.name} move`}
                     src={action}/>}
        </div>
    );
}
