import { characterAssetUrl } from "../characters.js";

export default function PlayerResultPanel({ player, character, winner }) {
    const result = winner ? "idle" : "lose";
    return (
        <div className={`player-action-container ${player}-action`}>
            <img className="player-action-image player-action-current"
                 alt={`${character.name} ${result}`}
                 src={characterAssetUrl(character, result)}/>
        </div>
    );
}
