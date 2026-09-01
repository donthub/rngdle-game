import PlayerNameScorePanel from "../components/PlayerNameScorePanel.jsx";
import InfoRounds from "../components/InfoRounds.jsx";
import InfoStatus from "../components/InfoStatus.jsx";
import PlayerResultPanel from "../components/PlayerResultPanel.jsx";

function resolveWinner(p1Score, p2Score) {
    if (p1Score > p2Score) {
        return { text: "Player 1 wins!", className: "winner-p1", player: "p1" };
    }
    if (p2Score > p1Score) {
        return { text: "Player 2 wins!", className: "winner-p2", player: "p2" };
    }
    return { text: "Draw!", className: "winner-draw", player: null };
}

export default function FinishedPage({ gameStatus, currentRound, rounds, p1, p2, onReset, onExit }) {
    const winner = resolveWinner(p1.score, p2.score);
    return (
        <div className="flex-col">
            <div className="flex-row w-100">
                <div className="flex-col w-100">
                    <PlayerNameScorePanel player="p1" label="Player 1" {...p1}/>
                    <PlayerResultPanel player="p1" character={p1.character} winner={winner.player === "p1"}/>
                </div>
                <div className="flex-col">
                    <InfoRounds currentRound={currentRound} rounds={rounds}/>
                    <InfoStatus gameStatus={gameStatus}/>
                    <div className={`flex winner-container ${winner.className}`}>
                        {winner.text}
                    </div>
                    <div className="flex-row">
                        <div className="flex">
                            <button className="reset-button" onClick={onReset}>Reset</button>
                        </div>
                        <div className="flex">
                            <button className="exit-button" onClick={onExit}>Exit</button>
                        </div>
                    </div>
                </div>
                <div className="flex-col w-100">
                    <PlayerNameScorePanel player="p2" label="Player 2" {...p2}/>
                    <PlayerResultPanel player="p2" character={p2.character} winner={winner.player === "p2"}/>
                </div>
            </div>

        </div>
    );
}
