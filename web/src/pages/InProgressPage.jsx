import PlayerNameScorePanel from "../components/PlayerNameScorePanel.jsx";
import InfoRounds from "../components/InfoRounds.jsx";
import InfoStatus from "../components/InfoStatus.jsx";
import PlayerActionPanel from "../components/PlayerActionPanel.jsx";

export default function InProgressPage({ gameStatus, currentRound, rounds, p1, p2 }) {
    return (
        <div className="flex-row">
            <div className="flex-col w-100">
                <PlayerNameScorePanel player="p1" label="Player 1" {...p1}/>
                <PlayerActionPanel player="p1" {...p1}/>
            </div>
            <div className="flex-col">
                <InfoRounds currentRound={currentRound} rounds={rounds}/>
                <InfoStatus gameStatus={gameStatus}/>
            </div>
            <div className="flex-col w-100">
                <PlayerNameScorePanel player="p2" label="Player 2" {...p2}/>
                <PlayerActionPanel player="p2" {...p2}/>
            </div>
        </div>
    );
}
