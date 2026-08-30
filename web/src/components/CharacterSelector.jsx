import React from "react";

import { Character, ROSTER_IMAGE, ROSTER_IMAGE_HEIGHT, ROSTER_IMAGE_WIDTH } from "../characters.js";

export default function CharacterSelector({ player, onSelect }) {
    const mapName = `GGACR_Characters_ImageMap_${player.toUpperCase()}`;

    return (
        <div className="player-character-selector">
            <span>
                <img src={ROSTER_IMAGE} width={ROSTER_IMAGE_WIDTH} height={ROSTER_IMAGE_HEIGHT}
                     alt="Guilty Gear XX Accent Core Plus R roster" useMap={`#${mapName}`}/>
            </span>
            <map name={mapName}>
                {Object.values(Character).map(character => (
                    <area key={character.id}
                          className={`player-character-selector-item player-character-selector-item-${player}`}
                          href="#"
                          shape="poly"
                          coords={character.coords}
                          alt={character.name}
                          title={character.name}
                          data-id={character.id}
                          onClick={event => {
                              event.preventDefault();
                              onSelect(character);
                          }}/>
                ))}
            </map>
        </div>
    );
}
