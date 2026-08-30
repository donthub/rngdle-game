import React from "react";

import InfoPanel from "./components/InfoPanel.jsx";
import PlayerPanel from "./components/PlayerPanel.jsx";

const STATUS_WAITING = "Waiting to start";
const STATUS_IN_PROGRESS = "In progress";
const STATUS_FINISHED = "Finished";

function resolveWinner(p1Score, p2Score) {
    if (p1Score > p2Score) {
        return { text: "Player 1 wins!", color: "red" };
    }
    if (p2Score > p1Score) {
        return { text: "Player 2 wins!", color: "blue" };
    }
    return { text: "Draw!", color: "gray" };
}

export default function App() {
    const [rounds, setRounds] = React.useState(0);
    const [currentRound, setCurrentRound] = React.useState(null);
    const [p1Name, setP1Name] = React.useState("");
    const [p2Name, setP2Name] = React.useState("");
    const [p1Score, setP1Score] = React.useState(0);
    const [p2Score, setP2Score] = React.useState(0);
    const [p1Character, setP1Character] = React.useState(null);
    const [p2Character, setP2Character] = React.useState(null);
    const [started, setStarted] = React.useState(false);
    const [finished, setFinished] = React.useState(false);

    // Imperative bridge used by the Playwright driver (see game.py).
    React.useEffect(() => {
        window.gameApi = {
            setRounds: value => setRounds(Number(value)),
            setP1Name: value => setP1Name(String(value)),
            setP2Name: value => setP2Name(String(value)),
            setCurrentRound: value => setCurrentRound(Number(value)),
            addP1Score: value => setP1Score(score => score + Number(value)),
            addP2Score: value => setP2Score(score => score + Number(value)),
            startGame: () => setStarted(true),
            finishGame: () => setFinished(true),
        };
        return () => {
            delete window.gameApi;
        };
    }, []);

    let status = STATUS_WAITING;
    if (finished) {
        status = STATUS_FINISHED;
    } else if (started) {
        status = STATUS_IN_PROGRESS;
    }

    return (
        <div className="container">
            <div className="players-container">
                <PlayerPanel player="p1"
                             label="Player 1"
                             name={p1Name}
                             score={p1Score}
                             character={p1Character}
                             onSelectCharacter={setP1Character}
                             showSelector={!started}/>
                <PlayerPanel player="p2"
                             label="Player 2"
                             name={p2Name}
                             score={p2Score}
                             character={p2Character}
                             onSelectCharacter={setP2Character}
                             showSelector={!started}/>
            </div>
            <InfoPanel currentRound={currentRound === null ? 0 : currentRound + 1}
                       rounds={rounds}
                       status={status}
                       winner={finished ? resolveWinner(p1Score, p2Score) : null}/>
            <div className="start-container">
                <button className="start-button" disabled={started} onClick={() => setStarted(true)}>Fight!</button>
            </div>
            {started && <div className="game-started"/>}
        </div>
    );
}
