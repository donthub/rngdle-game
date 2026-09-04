import InfoRounds from "../components/InfoRounds.jsx";
import PlayerActionPanel from "../components/PlayerActionPanel.jsx";
import PlayerColumn from "../components/PlayerColumn.jsx";
import PlayerHeader from "../components/PlayerHeader.jsx";
import ScoreLine from "../components/ScoreLine.jsx";

// The scores share one line across the top of the window (see ScoreLine.jsx), which leaves
// the columns under it carrying their own name and the character art. The window is only
// 520px tall, so this is what buys the art most of its height back.
//
// The header row is mirrored for p2, which keeps every name on the outer edge of its
// column and the tally in the corner closer to the middle (see PlayerHeader.jsx).
function StageColumn({ player, state }) {
    return (
        <PlayerColumn player={player} active>
            <div className="player-body player-body-stage">
                <PlayerHeader player={player} name={state.name} badges={state.badges}/>
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
            <ScoreLine p1={p1} p2={p2}/>
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
