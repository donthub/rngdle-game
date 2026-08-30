import React from "react";

import InfoPanel from "./components/InfoPanel.jsx";
import PlayerPanel from "./components/PlayerPanel.jsx";
import { GameStatus } from "./gameStatus.js";

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
    const [gameStatus, setGameStatus] = React.useState(GameStatus.WAITING);

    // Imperative bridge used by the Playwright driver (see game.py).
    React.useEffect(() => {
        window.gameApi = {
            setRounds: value => setRounds(Number(value)),
            setP1Name: value => setP1Name(String(value)),
            setP2Name: value => setP2Name(String(value)),
            setCurrentRound: value => setCurrentRound(Number(value)),
            addP1Score: value => setP1Score(score => score + Number(value)),
            addP2Score: value => setP2Score(score => score + Number(value)),
            startGame: () => setGameStatus(GameStatus.IN_PROGRESS),
            finishGame: () => setGameStatus(GameStatus.FINISHED),
        };
        return () => {
            delete window.gameApi;
        };
    }, []);

    return (
        <div className="container">
            <div className="players-container">
                <PlayerPanel player="p1"
                             label="Player 1"
                             name={p1Name}
                             score={p1Score}
                             character={p1Character}
                             onSelectCharacter={setP1Character}
                             gameStatus={gameStatus}/>
                <PlayerPanel player="p2"
                             label="Player 2"
                             name={p2Name}
                             score={p2Score}
                             character={p2Character}
                             onSelectCharacter={setP2Character}
                             gameStatus={gameStatus}/>
            </div>
            <InfoPanel currentRound={currentRound === null ? 0 : currentRound + 1}
                       rounds={rounds}
                       gameStatus={gameStatus}
                       winner={gameStatus === GameStatus.FINISHED ? resolveWinner(p1Score, p2Score) : null}/>
            <div className="start-container">
                <button className="start-button" disabled={gameStatus !== GameStatus.WAITING} onClick={() => setGameStatus(GameStatus.IN_PROGRESS)}>Fight!</button>
            </div>
            {gameStatus === GameStatus.IN_PROGRESS && <div className="game-started"/>}
        </div>
    );
}
