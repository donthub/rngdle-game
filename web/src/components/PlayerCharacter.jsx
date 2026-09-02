import { characterAssetUrl } from "../characters.js";

export default function PlayerCharacter({ character, preview = false }) {
    if (!character) {
        return null;
    }

    const previewClass = preview ? " player-character-preview" : "";

    return (
        <>
            <div className={`player-character-nameplate${previewClass}`}>
                <img alt={`${character.name} nameplate`} src={characterAssetUrl(character, "nameplate")}/>
            </div>
            <div className={`player-character-portrait${previewClass}`}>
                <img alt={`${character.name} portrait`} src={characterAssetUrl(character, "portrait")}/>
            </div>
        </>
    );
}
