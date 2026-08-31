import React from "react";

import FinishedPage from "./pages/FinishedPage.jsx";
import InProgressPage from "./pages/InProgressPage.jsx";
import WaitingPage from "./pages/WaitingPage.jsx";
import { resolveBadgeMoveImage } from "./badges.js";
import { Character } from "./characters.js";
import { GameStatus } from "./gameStatus.js";

function addBadge(badge, characterRef, setAction) {
    setAction(previousImage => {
        const image = resolveBadgeMoveImage(badge, characterRef.current, previousImage);
        return image === null ? previousImage : image;
    });
}

function handleOnSelectCharacter(character, playerSelection, setPlayerSelection, setP1Character, setP2Character) {
    if (playerSelection === "P1") {
        setP1Character(character);
        setPlayerSelection("P2");
    } else if (playerSelection === "P2") {
        setP2Character(character);
        setPlayerSelection("P1");
    }
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
    const [p1Action, setP1Action] = React.useState(null);
    const [p2Action, setP2Action] = React.useState(null);
    const [gameStatus, setGameStatus] = React.useState(GameStatus.WAITING);
    const [playerSelection, setPlayerSelection] = React.useState("P1");

    const gameStatusRef = React.useRef(gameStatus);
    gameStatusRef.current = gameStatus;
    const roundsRef = React.useRef(rounds);
    roundsRef.current = rounds;
    const p1NameRef = React.useRef(p1Name);
    p1NameRef.current = p1Name;
    const p2NameRef = React.useRef(p2Name);
    p2NameRef.current = p2Name;
    const p1CharacterRef = React.useRef(p1Character);
    p1CharacterRef.current = p1Character;
    const p2CharacterRef = React.useRef(p2Character);
    p2CharacterRef.current = p2Character;

    // Imperative bridge used by the Playwright driver (see game.py).
    React.useEffect(() => {
        window.gameApi = {
            // Setters
            setCurrentRound: value => setCurrentRound(Number(value)),
            addP1Score: value => setP1Score(score => score + Number(value)),
            addP2Score: value => setP2Score(score => score + Number(value)),
            addP1Badge: value => addBadge(value, p1CharacterRef, setP1Action),
            addP2Badge: value => addBadge(value, p2CharacterRef, setP2Action),
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

    const p1 = {
        name: p1Name,
        onNameChange: setP1Name,
        score: p1Score,
        character: p1Character,
        onSelectCharacter: setP1Character,
        action: p1Action,
    };
    const p2 = {
        name: p2Name,
        onNameChange: setP2Name,
        score: p2Score,
        character: p2Character,
        onSelectCharacter: setP2Character,
        action: p2Action,
    };
    const onCharacterSelect = character => handleOnSelectCharacter(character, playerSelection, setPlayerSelection, setP1Character, setP2Character);
    const onStart = () => setGameStatus(GameStatus.IN_PROGRESS);
    const onExit = () => setGameStatus(GameStatus.EXITED);

    if (gameStatus === GameStatus.WAITING) {
        return <WaitingPage gameStatus={gameStatus}
                            rounds={rounds}
                            onRoundsChange={setRounds}
                            onSelectCharacter={onCharacterSelect}
                            p1={p1}
                            p2={p2}
                            onStart={onStart}
                            onExit={onExit}/>;
    }

    if (gameStatus === GameStatus.FINISHED) {
        return <FinishedPage gameStatus={gameStatus}
                             currentRound={currentRound === null ? 0 : currentRound + 1}
                             rounds={rounds}
                             p1={p1}
                             p2={p2}
                             onReset={onReset}
                             onExit={onExit}/>;
    }

    return <InProgressPage gameStatus={gameStatus}
                           currentRound={currentRound === null ? 0 : currentRound + 1}
                           rounds={rounds}
                           p1={p1}
                           p2={p2}/>;
}

export default function App() {
    // Bumping the key remounts Game, so every useState falls back to its default.
    const [gameKey, setGameKey] = React.useState(0);

    return <Game key={gameKey} onReset={() => setGameKey(key => key + 1)}/>;
}
