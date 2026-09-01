import { characterAssetUrl } from "../characters.js";

export default function PlayerCharacter({ character }) {
    if (!character) {
        return null;
    }

    return (
        <>
            <div className="player-character-nameplate">
                <img alt={`${character.name} nameplate`} src={characterAssetUrl(character, "nameplate")}/>
            </div>
            <div className="player-character-portrait">
                <img alt={`${character.name} portrait`} src={characterAssetUrl(character, "portrait")}/>
            </div>
        </>
    );
}
