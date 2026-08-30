import { MOVE_IMAGES } from "virtual:move-images";

// Badge rarities are mapped to the move type directories under public/assets/{character id}
const BADGE_MOVE_TYPES = Object.freeze({
    COMMON: "normal",
    UNCOMMON: "special",
    RARE: "forcebreak",
    EPIC: "overdrive",
    ANOMALY: "instantkill",
    MYTHIC: "instantkill",
});

export function resolveBadgeMoveImage(badge, character) {
    const moveType = BADGE_MOVE_TYPES[badge];
    if (moveType === undefined) {
        return null;
    }

    const images = MOVE_IMAGES[character.id]?.[moveType];
    if (images === undefined || images.length === 0) {
        return null;
    }

    return images[Math.floor(Math.random() * images.length)];
}
