import InfoRounds from "../components/InfoRounds.jsx";
import PlayerActionPanel from "../components/PlayerActionPanel.jsx";
import PlayerBadge from "../components/PlayerBadge.jsx";
import PlayerColumn from "../components/PlayerColumn.jsx";
import PlayerIdentity from "../components/PlayerIdentity.jsx";
import TugOfWar from "../components/TugOfWar.jsx";
import { PLAYER_LABELS } from "../players.js";

// The scores share one rope across the top of the window (see TugOfWar.jsx), which leaves
// the columns under it carrying their own name and the character art. The window is only
// 520px tall, so this is what buys the art most of its height back.
//
// The header row is mirrored for p2 along with the identity inside it, which keeps every
// name on the outer edge of its column and every badge chip in the corner nearest the
// centre, where the move that earned it is being watched.
function StageColumn({ player, state }) {
    const mirrored = player === "p2";
    return (
        <PlayerColumn player={player} active>
            <div className="player-body player-body-stage">
                <div className={`player-header${mirrored ? " player-header-mirrored" : ""}`}>
                    <PlayerIdentity player={player}
                                    label={PLAYER_LABELS[player]}
                                    name={state.name}
                                    mirrored={mirrored}/>
                    <PlayerBadge badge={state.badge}/>
                </div>
                <PlayerActionPanel player={player} character={state.character} action={state.action}/>
            </div>
        </PlayerColumn>
    );
}

// The top bar stands down once the setup page is behind us (see App.jsx) and nothing
// replaces it: the round meter is all the middle column has to say while a round runs.
// Both sides are in play, so both accent rules are lit, unlike on the other two pages
// where the rule marks whoever is picking or whoever won.
export default function InProgressPage({ currentRound, rounds, p1, p2 }) {
    return (
        <div className="board-layout">
            <TugOfWar p1={p1} p2={p2}/>
            <div className="board-triptych">
                <StageColumn player="p1" state={p1}/>
                <div className="center-column center-column-play">
                    <InfoRounds currentRound={currentRound} rounds={rounds}/>
                </div>
                <StageColumn player="p2" state={p2}/>
            </div>
        </div>
    );
}
