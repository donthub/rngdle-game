import { isKnownBadge } from "../badges.js";

// The rarity of the last badge the player rolled. Keying on the rarity keeps the chip
// mounted while the same one keeps coming round, so a repeat leaves it standing and only
// a change of rarity is worth stepping in for (see styles.scss).
export default function PlayerBadge({ badge }) {
    if (badge === null || !isKnownBadge(badge)) {
        return null;
    }
    return (
        <span key={badge} className={`player-badge player-badge-${badge.toLowerCase()}`}>
            {badge}
        </span>
    );
}
