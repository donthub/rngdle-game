import React from "react";

import { Character, ROSTER_IMAGE, ROSTER_IMAGE_HEIGHT, ROSTER_IMAGE_WIDTH } from "../characters.js";

export default function CharacterSelector({ onSelectCharacter }) {
    const mapName = 'GGACR_Characters_ImageMap';

    return (
        <div className="flex">
            <span>
                <img src={ROSTER_IMAGE} width={ROSTER_IMAGE_WIDTH} height={ROSTER_IMAGE_HEIGHT}
                     alt="Guilty Gear XX Accent Core Plus R roster" useMap={`#${mapName}`}/>
            </span>
            <map name={mapName}>
                {Object.values(Character).map(character => (
                    <area key={character.id}
                          href="#"
                          shape="poly"
                          coords={character.coords}
                          alt={character.name}
                          title={character.name}
                          data-id={character.id}
                          onClick={event => {
                              event.preventDefault();
                              onSelectCharacter(character);
                          }}/>
                ))}
            </map>
        </div>
    );
}
