import React from "react";

import FinishedPage from "./pages/FinishedPage.jsx";
import InProgressPage from "./pages/InProgressPage.jsx";
import WaitingPage from "./pages/WaitingPage.jsx";
import { resolveBadgeMoveImage } from "./badges.js";
import { Character } from "./characters.js";
import { GameStatus } from "./gameStatus.js";
import useLatestRef from "./useLatestRef.js";

function usePlayer(defaultCharacter) {
    const [name, setName] = React.useState("");
    const [score, setScore] = React.useState(0);
    const [character, setCharacter] = React.useState(defaultCharacter);
    const [action, setAction] = React.useState(null);

    const nameRef = useLatestRef(name);
    const characterRef = useLatestRef(character);

    return {
        state: { name, score, character, action, onNameChange: setName },
        setCharacter,
        getName: () => nameRef.current,
        addScore: value => setScore(previousScore => previousScore + Number(value)),
        addBadge: badge => setAction(previousImage =>
            resolveBadgeMoveImage(badge, characterRef.current, previousImage) ?? previousImage),
    };
}

function Game({ onReset }) {
    const [rounds, setRounds] = React.useState(5);
    const [currentRound, setCurrentRound] = React.useState(null);
    const [gameStatus, setGameStatus] = React.useState(GameStatus.WAITING);
    const [selectedPlayerIndex, setSelectedPlayerIndex] = React.useState(0);

    const p1 = usePlayer(Character.SOL);
    const p2 = usePlayer(Character.KY);
    const players = [p1, p2];

    const gameStatusRef = useLatestRef(gameStatus);
    const roundsRef = useLatestRef(rounds);

    // Imperative bridge used by the Playwright driver (see game.py).
    React.useEffect(() => {
        window.gameApi = {
            // Setters
            setCurrentRound: value => setCurrentRound(Number(value)),
            addP1Score: value => p1.addScore(value),
            addP2Score: value => p2.addScore(value),
            addP1Badge: value => p1.addBadge(value),
            addP2Badge: value => p2.addBadge(value),
            finishGame: () => setGameStatus(GameStatus.FINISHED),

            // Getters
            isStarted: () => gameStatusRef.current === GameStatus.IN_PROGRESS,
            isFinished: () => gameStatusRef.current === GameStatus.FINISHED,
            isExited: () => gameStatusRef.current === GameStatus.EXITED,
            getRounds: () => roundsRef.current,
            getP1Name: () => p1.getName(),
            getP2Name: () => p2.getName(),
        };
        return () => {
            delete window.gameApi;
        };
    }, []);

    const onSelectCharacter = character => {
        players[selectedPlayerIndex].setCharacter(character);
        setSelectedPlayerIndex(index => (index + 1) % players.length);
    };
    const onStart = () => setGameStatus(GameStatus.IN_PROGRESS);
    const onExit = () => setGameStatus(GameStatus.EXITED);
    const displayedRound = currentRound === null ? 0 : currentRound + 1;

    if (gameStatus === GameStatus.WAITING) {
        return <WaitingPage gameStatus={gameStatus}
                            rounds={rounds}
                            onRoundsChange={setRounds}
                            onSelectCharacter={onSelectCharacter}
                            p1={p1.state}
                            p2={p2.state}
                            onStart={onStart}
                            onExit={onExit}/>;
    }

    if (gameStatus === GameStatus.FINISHED) {
        return <FinishedPage gameStatus={gameStatus}
                             currentRound={displayedRound}
                             rounds={rounds}
                             p1={p1.state}
                             p2={p2.state}
                             onReset={onReset}
                             onExit={onExit}/>;
    }

    return <InProgressPage gameStatus={gameStatus}
                           currentRound={displayedRound}
                           rounds={rounds}
                           p1={p1.state}
                           p2={p2.state}/>;
}

export default function App() {
    // Bumping the key remounts Game, so every useState falls back to its default.
    const [gameKey, setGameKey] = React.useState(0);

    return <Game key={gameKey} onReset={() => setGameKey(key => key + 1)}/>;
}
