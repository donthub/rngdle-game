import { characterAssetUrl } from "../characters.js";

// A hovered pick is shown at full strength, the same as a made one: what marks it as
// provisional is the caption and the lit cell back on the roster, not faded art. The
// caption row is held open either way so the portrait does not shift as it changes.
export default function PlayerCharacter({ character, preview = false }) {
    if (!character) {
        return null;
    }

    return (
        <div className="player-character">
            <div className="player-character-nameplate">
                <img alt={`${character.name} nameplate`} src={characterAssetUrl(character, "nameplate")}/>
            </div>
            <div className="player-character-portrait" key={character.id}>
                <img alt={`${character.name} portrait`} src={characterAssetUrl(character, "portrait")}/>
            </div>
            <span className="player-character-caption">{preview ? "Preview" : ""}</span>
        </div>
    );
}
