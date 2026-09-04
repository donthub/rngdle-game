import { rolledBadges } from "../badges.js";
import classNames from "../classNames.js";

// The badges a player has rolled, one chip per rarity, on the name's line in the corner
// closer to the middle of the board (see PlayerHeader.jsx) and read outward from there as
// a fixed row: rarest at the inner end, every rarity always in the same place, so where a
// chip sits says how rare it is rather than when it turned up. A rarity landing for the
// first time opens at the inner end and pushes the commoner chips outward. Every chip is
// a hue and a number, so the row holds one height whatever lands on it and the art below
// keeps the room it started with. The rarity that just landed is outlined in its own hue
// and steps forward as its count goes up - keying it on the roll is what replays that
// when the same rarity comes round again. Nothing is still landing once the game is
// settled, so there nothing is outlined (see FinishedPage.jsx).
export default function PlayerTally({ player, badges, settled = false }) {
    return (
        <div className={`player-tally player-tally-${player}`}>
            {rolledBadges(badges.counts).map(({ badge, count }) => {
                const latest = !settled && badge === badges.latest;
                return (
                    <span key={latest ? `${badge}-${badges.roll}` : badge}
                          className={classNames("player-tally-chip",
                              `player-tally-chip-${badge.toLowerCase()}`,
                              latest && "player-tally-chip-latest")}>
                        <span className="player-tally-dot"/>
                        <span className="player-tally-count">{count}</span>
                    </span>
                );
            })}
        </div>
    );
}
