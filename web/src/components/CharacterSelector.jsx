import { Character, ROSTER_IMAGE, ROSTER_IMAGE_HEIGHT, ROSTER_IMAGE_WIDTH } from "../characters.js";
import { PLAYER_KEYS } from "../players.js";

const CHARACTERS = Object.values(Character);

// The roster is one flat image, so the hit areas are polygons laid over it. Drawing them
// as SVG rather than an image map is what makes them styleable: the art is left alone and
// the state is carried by rings over it - solid for a pick made, dashed for one hovered.
function cellClass(owner, hovered, nextPlayer) {
    const classes = ["roster-cell"];
    if (owner) {
        classes.push(`roster-cell-picked roster-cell-${owner}`);
    }
    if (hovered) {
        classes.push(`roster-cell-hovered roster-cell-hovered-${nextPlayer}`);
    }
    return classes.join(" ");
}

// A quiet circular arrow, sized to sit on the hint line next to its label
function ResetIcon() {
    return (
        <svg className="icon-repick" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
            <path className="icon-repick-arc" d="M10 6A4 4 0 1 1 6 2"/>
            <polygon className="icon-repick-head" points="5.7,0.5 8.3,2 5.7,3.5"/>
        </svg>
    );
}

export default function CharacterSelector({ nextPlayer, picks, hovered, onSelectCharacter, onResetPicks,
                                            onHoverCharacter }) {
    const ownerOf = character => PLAYER_KEYS.find(playerKey => picks[playerKey]?.id === character.id) ?? null;
    // Both picks are in once nobody is next, and the board stops taking clicks
    const locked = !nextPlayer;

    return (
        <div className="character-selector">
            <span className="section-label">Select characters</span>
            <div className="character-selector-panel">
                <div className={`character-selector-roster${locked ? " character-selector-roster-locked" : ""}`}>
                    <img src={ROSTER_IMAGE} width={ROSTER_IMAGE_WIDTH} height={ROSTER_IMAGE_HEIGHT}
                         alt="Guilty Gear XX Accent Core Plus R roster"/>
                    <svg className="roster-overlay"
                         viewBox={`0 0 ${ROSTER_IMAGE_WIDTH} ${ROSTER_IMAGE_HEIGHT}`}>
                        {CHARACTERS.map(character => (
                            <polygon key={character.id}
                                     className={cellClass(ownerOf(character),
                                         !locked && character.id === hovered?.id, nextPlayer)}
                                     points={character.coords}
                                     role="button"
                                     tabIndex={locked ? -1 : 0}
                                     aria-label={character.name}
                                     onClick={() => onSelectCharacter(character)}
                                     onKeyDown={event => {
                                         if (event.key === "Enter" || event.key === " ") {
                                             event.preventDefault();
                                             onSelectCharacter(character);
                                         }
                                     }}
                                     onMouseEnter={() => onHoverCharacter(character)}
                                     onMouseLeave={() => onHoverCharacter(null)}
                                     onFocus={() => onHoverCharacter(character)}
                                     onBlur={() => onHoverCharacter(null)}>
                                <title>{character.name}</title>
                            </polygon>
                        ))}
                    </svg>
                </div>
            </div>
            <div className="character-selector-hint">
                {locked ? <span className="character-selector-hint-lead">Both characters are set</span> : (
                    <>
                        <span className="character-selector-hint-lead">Click a portrait to assign</span>
                        <span className="character-selector-hint-separator"/>
                        <span className="character-selector-hint-label">next pick</span>
                        <span className={`player-tag ${nextPlayer}-tag`}>{nextPlayer.toUpperCase()}</span>
                    </>
                )}
                {onResetPicks ? (
                    <>
                        <span className="character-selector-hint-separator"/>
                        <button type="button" className="character-selector-reset"
                                title="Pick both characters again" onClick={onResetPicks}>
                            <ResetIcon/>
                            Re-pick
                        </button>
                    </>
                ) : null}
            </div>
        </div>
    );
}
