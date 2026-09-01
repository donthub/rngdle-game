import { characterAssetUrl } from "../characters.js";
import PlayerStage from "./PlayerStage.jsx";

export default function PlayerResultPanel({ player, character, winner }) {
    const result = winner ? "idle" : "lose";
    return (
        <PlayerStage player={player}>
            <img className="player-action-image player-action-current"
                 alt={`${character.name} ${result}`}
                 src={characterAssetUrl(character, result)}/>
        </PlayerStage>
    );
}
