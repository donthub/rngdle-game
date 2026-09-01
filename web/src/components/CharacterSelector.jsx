import { Character, ROSTER_IMAGE, ROSTER_IMAGE_HEIGHT, ROSTER_IMAGE_WIDTH } from "../characters.js";

const MAP_NAME = "GGACR_Characters_ImageMap";

export default function CharacterSelector({ nextPlayer, onSelectCharacter }) {
    return (
        <div className="character-selector">
            <span className="section-label">Select characters</span>
            <div className="character-selector-panel">
                <img src={ROSTER_IMAGE} width={ROSTER_IMAGE_WIDTH} height={ROSTER_IMAGE_HEIGHT}
                     alt="Guilty Gear XX Accent Core Plus R roster" useMap={`#${MAP_NAME}`}/>
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
            <div className="character-selector-hint">
                <span className="character-selector-hint-lead">Click a portrait to assign</span>
                <span className="character-selector-hint-separator"/>
                <span className="character-selector-hint-label">next pick</span>
                <span className={`player-tag ${nextPlayer}-tag`}>{nextPlayer.toUpperCase()}</span>
            </div>
        </div>
    );
}
