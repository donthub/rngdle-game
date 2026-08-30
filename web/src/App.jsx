import React from "react";

import InfoPanel from "./components/InfoPanel.jsx";
import PlayerPanel from "./components/PlayerPanel.jsx";
import { Character } from "./characters.js";
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

function Game({ onReset }) {
    const [rounds, setRounds] = React.useState(5);
    const [currentRound, setCurrentRound] = React.useState(null);
    const [p1Name, setP1Name] = React.useState("");
    const [p2Name, setP2Name] = React.useState("");
    const [p1Score, setP1Score] = React.useState(0);
    const [p2Score, setP2Score] = React.useState(0);
    const [p1Character, setP1Character] = React.useState(Character.SOL);
    const [p2Character, setP2Character] = React.useState(Character.KY);
    const [gameStatus, setGameStatus] = React.useState(GameStatus.WAITING);

    const gameStatusRef = React.useRef(gameStatus);
    gameStatusRef.current = gameStatus;
    const roundsRef = React.useRef(rounds);
    roundsRef.current = rounds;
    const p1NameRef = React.useRef(p1Name);
    p1NameRef.current = p1Name;
    const p2NameRef = React.useRef(p2Name);
    p2NameRef.current = p2Name;

    // Imperative bridge used by the Playwright driver (see game.py).
    React.useEffect(() => {
        window.gameApi = {
            // Setters
            setCurrentRound: value => setCurrentRound(Number(value)),
            addP1Score: value => setP1Score(score => score + Number(value)),
            addP2Score: value => setP2Score(score => score + Number(value)),
            startGame: () => setGameStatus(GameStatus.IN_PROGRESS),
            finishGame: () => setGameStatus(GameStatus.FINISHED),

            // Getters
            isStarted: () => gameStatusRef.current === GameStatus.IN_PROGRESS,
            isFinished: () => gameStatusRef.current === GameStatus.FINISHED,
            isExited: () => gameStatusRef.current === GameStatus.EXITED,
            getRounds: () => roundsRef.current,
            getP1Name: () => p1NameRef.current,
            getP2Name: () => p2NameRef.current,
        };
        return () => {
            delete window.gameApi;
        };
    }, []);

    return (
        <div className="container">
            <div className="main-container">
                <PlayerPanel player="p1"
                             label="Player 1"
                             name={p1Name}
                             onNameChange={setP1Name}
                             score={p1Score}
                             character={p1Character}
                             onSelectCharacter={setP1Character}
                             gameStatus={gameStatus}/>
                <InfoPanel currentRound={currentRound === null ? 0 : currentRound + 1}
                           rounds={rounds}
                           onRoundsChange={setRounds}
                           gameStatus={gameStatus}
                           winner={gameStatus === GameStatus.FINISHED ? resolveWinner(p1Score, p2Score) : null}/>
                <PlayerPanel player="p2"
                             label="Player 2"
                             name={p2Name}
                             onNameChange={setP2Name}
                             score={p2Score}
                             character={p2Character}
                             onSelectCharacter={setP2Character}
                             gameStatus={gameStatus}/>
            </div>
            {gameStatus === GameStatus.WAITING &&
                <div className="controls-container">
                    <div className="start-container">
                        <button className="start-button" onClick={() => setGameStatus(GameStatus.IN_PROGRESS)}>Fight!</button>
                    </div>
                    <div className="exit-container">
                        <button className="exit-button" onClick={() => setGameStatus(GameStatus.EXITED)}>Exit</button>
                    </div>
                </div>
            }
            {gameStatus === GameStatus.FINISHED &&
                <div className="controls-container">
                    <div className="reset-container">
                        <button className="reset-button" onClick={onReset}>Reset</button>
                    </div>
                    <div className="exit-container">
                        <button className="exit-button" onClick={() => setGameStatus(GameStatus.EXITED)}>Exit</button>
                    </div>
                </div>
            }
        </div>
    );
}

export default function App() {
    // Bumping the key remounts Game, so every useState falls back to its default.
    const [gameKey, setGameKey] = React.useState(0);

    return <Game key={gameKey} onReset={() => setGameKey(key => key + 1)}/>;
}
