import { Character, ROSTER_IMAGE, ROSTER_IMAGE_HEIGHT, ROSTER_IMAGE_WIDTH } from "../characters.js";

const MAP_NAME = "GGACR_Characters_ImageMap";

export default function CharacterSelector({ onSelectCharacter }) {
    return (
        <div className="flex h-100 align-items-center">
            <span>
                <img src={ROSTER_IMAGE} width={ROSTER_IMAGE_WIDTH} height={ROSTER_IMAGE_HEIGHT}
                     alt="Guilty Gear XX Accent Core Plus R roster" useMap={`#${MAP_NAME}`}/>
            </span>
            <map name={MAP_NAME}>
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
