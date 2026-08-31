import React from "react";

export default function PlayerCharacter({ character }) {
    return (
        <div className="flex-col">
            {character && (
                <>
                    <div className="player-character-nameplate">
                        <img alt={`${character.name} nameplate`} src={`assets/${character.id}/nameplate.png`}/>
                    </div>
                    <div className="player-character-portrait">
                        <img alt={`${character.name} portrait`} src={`assets/${character.id}/portrait.png`}/>
                    </div>
                </>
            )}
        </div>
    );
}
