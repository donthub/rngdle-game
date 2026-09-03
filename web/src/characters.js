import { MOVE_IMAGES } from "virtual:move-images";

export const ROSTER_IMAGE = "/assets/GGACR_Roster.png";
export const ROSTER_IMAGE_WIDTH = 660;
export const ROSTER_IMAGE_HEIGHT = 177;

export const Character = Object.freeze({
    EDDIE: { id: "eddie", name: "Eddie", coords: "431,102,431,128,407,151,358,151,358,125,381,102" },
    VENOM: { id: "venom", name: "Venom", coords: "483,128,483,154,459,177,409,177,409,151,432,128" },
    BAIKEN: { id: "baiken", name: "Baiken", coords: "507,77,507,102,483,126,434,126,434,100,457,77" },
    POTEMKIN: { id: "potemkin", name: "Potemkin", coords: "558,102,558,129,535,152,484,152,484,126,509,102" },
    FAUST: { id: "faust", name: "Faust", coords: "584,52,584,78,559,101,509,101,509,75,534,52" },
    INO: { id: "ino", name: "I-No", coords: "635,78,635,104,611,127,561,127,561,101,585,78" },
    DIZZY: { id: "dizzy", name: "Dizzy", coords: "126,26,178,26,201,50,201,75,150,75,126,51" },
    ZAPPA: { id: "zappa", name: "Zappa", coords: "76,52,126,52,150,76,150,101,99,101,76,77" },
    CHIPP: { id: "chipp", name: "Chipp Zanuff", coords: "100,102,152,102,175,127,175,152,123,152,100,128" },
    ANJI: { id: "anji", name: "Anji Mito", coords: "152,77,202,77,226,101,226,126,175,126,152,102" },
    JOHNNY: { id: "johnny", name: "Johnny", coords: "202,51,253,51,277,75,277,100,226,100,202,76" },
    MILLIA: { id: "millia", name: "Millia Rage", coords: "228,102,279,102,302,126,302,151,251,151,228,127" },
    SLAYER: { id: "slayer", name: "Slayer", coords: "177,128,228,128,251,152,251,177,200,177,177,153" },
    AXL: { id: "axl", name: "Axl Low", coords: "25,78,76,78,99,102,99,127,47,127,25,102" },
    KLIFF: { id: "kliff", name: "Kliff Undersn", coords: "0,27,50,27,74,51,74,76,23,76,0,52" },
    JAM: { id: "jam", name: "Jam Kuradoberi", coords: "50,1,101,1,124,25,124,50,74,50,50,26" },
    ABA: { id: "aba", name: "A.B.A", coords: "178,0,228,0,252,24,252,49,201,49,178,25" },
    JUSTICE: { id: "justice", name: "Justice", coords: "660,27,660,53,635,76,586,76,586,50,610,27" },
    BRIDGET: { id: "bridget", name: "Bridget", coords: "608,1,608,27,585,50,535,50,535,24,558,1" },
    TESTAMENT: { id: "testament", name: "Testament", coords: "533,26,533,52,509,75,459,75,459,49,483,26" },
    MAY: { id: "may", name: "May", coords: "456,51,456,77,432,100,383,100,383,74,407,51" },
    ORDERSOL: { id: "ordersol", name: "Order-Sol", coords: "287,78,335,82,375,80,375,102,352,124,305,124,285,102" },
    SOL: { id: "sol", name: "Sol Badguy", coords: "253,25,305,25,328,49,328,74,277,74,253,50" },
    KY: { id: "ky", name: "Ky Kiske", coords: "405,25,405,51,381,74,332,74,332,48,356,25" },
    ROBOKY: { id: "roboky", name: "Robo-Ky", coords: "482,0,482,26,457,49,407,49,407,23,431,0" },
});

export function characterAssetUrl(character, asset) {
    return `/assets/characters/${character.id}/${asset}.png`;
}

// Win poses live in the win directory under public/assets/characters/{character id}, the
// same way the move images do (see badges.js). The idle art stands in for a character
// with no win pose indexed.
export function randomCharacterWinImage(character) {
    const images = MOVE_IMAGES[character.id]?.win;
    if (images === undefined || images.length === 0) {
        return characterAssetUrl(character, "idle");
    }
    return images[Math.floor(Math.random() * images.length)];
}
