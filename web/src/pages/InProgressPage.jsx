import InfoRounds from "../components/InfoRounds.jsx";
import PlayerActionPanel from "../components/PlayerActionPanel.jsx";
import PlayerColumn from "../components/PlayerColumn.jsx";
import PlayerNameScorePanel from "../components/PlayerNameScorePanel.jsx";
import { PLAYER_LABELS } from "../players.js";

function PlayColumn({ player, state }) {
    return (
        <PlayerColumn player={player} active>
            <div className="player-body">
                <PlayerNameScorePanel player={player}
                                      label={PLAYER_LABELS[player]}
                                      name={state.name}
                                      score={state.score}/>
                <div className="player-divider"/>
                <PlayerActionPanel player={player} character={state.character} action={state.action}/>
            </div>
        </PlayerColumn>
    );
}

export default function InProgressPage({ currentRound, rounds, p1, p2 }) {
    return (
        <>
            <PlayColumn player="p1" state={p1}/>
            <div className="center-column center-column-play">
                <InfoRounds currentRound={currentRound} rounds={rounds}/>
            </div>
            <PlayColumn player="p2" state={p2}/>
        </>
    );
}
