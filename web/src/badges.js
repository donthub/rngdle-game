import { MOVE_IMAGES } from "virtual:move-images";

// Badge rarities are mapped to the move type directories under public/assets/characters/{character id}
const BADGE_MOVE_TYPES = Object.freeze({
    COMMON: "normal",
    UNCOMMON: "special",
    RARE: "forcebreak",
    EPIC: "overdrive",
    ANOMALY: "instantkill",
    MYTHIC: "instantkill",
});

// Rolling one of these is rare enough to end the game on the spot (see game_round.py)
const GAME_ENDING_BADGES = Object.freeze(["ANOMALY", "MYTHIC"]);

export function isGameEndingBadge(badge) {
    return GAME_ENDING_BADGES.includes(badge);
}

// The tally is read as a fixed ladder with the rarest at the top, which is the order the
// move types above are written in, backwards (see PlayerTally.jsx).
const BADGE_LADDER = Object.freeze(Object.keys(BADGE_MOVE_TYPES).reverse());

// The rarities a player has rolled, rarest first, with how many of each. A rarity the
// board has no move type for is one it has never seen, so it has no hue either: it is
// left off the ladder the same way it is left off the stage.
export function rolledBadges(counts) {
    return BADGE_LADDER
        .filter(badge => counts[badge] > 0)
        .map(badge => ({ badge, count: counts[badge] }));
}

export function resolveBadgeMoveImage(badge, character, previousImage = null) {
    const moveType = BADGE_MOVE_TYPES[badge];
    if (moveType === undefined) {
        return null;
    }

    const images = MOVE_IMAGES[character.id]?.[moveType];
    if (images === undefined || images.length === 0) {
        return null;
    }

    const candidates = images.filter(image => image !== previousImage);
    const pool = candidates.length === 0 ? images : candidates;

    return pool[Math.floor(Math.random() * pool.length)];
}
