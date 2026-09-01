import React from "react";

import FinishedPage from "./pages/FinishedPage.jsx";
import InProgressPage from "./pages/InProgressPage.jsx";
import WaitingPage from "./pages/WaitingPage.jsx";
import TopBar from "./components/TopBar.jsx";
import { isGameEndingBadge, resolveBadgeMoveImage } from "./badges.js";
import { Character } from "./characters.js";
import { GameStatus } from "./gameStatus.js";
import { PLAYER_KEYS } from "./players.js";
import useCountUp from "./useCountUp.js";
import useLatestRef from "./useLatestRef.js";

function usePlayer(defaultCharacter) {
    const [name, setName] = React.useState("");
    const [score, setScore] = React.useState(0);
    const [character, setCharacter] = React.useState(defaultCharacter);
    const [action, setAction] = React.useState(null);

    // The panels show the counting value; the awarded total stays behind it
    // until the animation catches up.
    const countedScore = useCountUp(score);

    const nameRef = useLatestRef(name);
    const characterRef = useLatestRef(character);

    return {
        state: { name, score: countedScore, character, action, onNameChange: setName },
        isCountingUp: countedScore !== score,
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
    const [destroyers, setDestroyers] = React.useState([]);
    const [finishRequested, setFinishRequested] = React.useState(false);
    const [selectedPlayerIndex, setSelectedPlayerIndex] = React.useState(0);

    const p1 = usePlayer(Character.SOL);
    const p2 = usePlayer(Character.KY);
    const playersByKey = { p1, p2 };
    const players = PLAYER_KEYS.map(playerKey => playersByKey[playerKey]);

    // The last round's score is still counting up when the driver finishes the
    // game, so hold the result page back until both totals have landed.
    const isCountingUp = players.some(player => player.isCountingUp);
    React.useEffect(() => {
        if (finishRequested && !isCountingUp) {
            setGameStatus(GameStatus.FINISHED);
        }
    }, [finishRequested, isCountingUp]);

    const gameStatusRef = useLatestRef(gameStatus);
    const roundsRef = useLatestRef(rounds);
    const currentRoundRef = useLatestRef(currentRound);

    // A game ending badge stops the driver after the current round (see game_round.py),
    // so the round meter is cut back to make that round the last one, and the loser is
    // marked as destroyed on the result page. Whoever rolled one is remembered, because a
    // lone destroyer takes the game whatever the scores say (see FinishedPage.jsx).
    const addBadge = (playerKey, badge) => {
        playersByKey[playerKey].addBadge(badge);
        if (!isGameEndingBadge(badge)) {
            return;
        }
        setDestroyers(previousDestroyers => previousDestroyers.includes(playerKey)
            ? previousDestroyers
            : [...previousDestroyers, playerKey]);
        if (currentRoundRef.current !== null) {
            setRounds(previousRounds => Math.min(previousRounds, currentRoundRef.current + 1));
        }
    };

    // Imperative bridge used by the Playwright driver (see game.py).
    React.useEffect(() => {
        window.gameApi = {
            // Setters
            setCurrentRound: value => setCurrentRound(Number(value)),
            addP1Score: value => p1.addScore(value),
            addP2Score: value => p2.addScore(value),
            addP1Badge: value => addBadge("p1", value),
            addP2Badge: value => addBadge("p2", value),
            finishGame: () => setFinishRequested(true),

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

    let page;
    if (gameStatus === GameStatus.WAITING) {
        page = <WaitingPage rounds={rounds}
                            onRoundsChange={setRounds}
                            onSelectCharacter={onSelectCharacter}
                            nextPlayer={PLAYER_KEYS[selectedPlayerIndex]}
                            p1={p1.state}
                            p2={p2.state}
                            onStart={onStart}
                            onExit={onExit}/>;
    } else if (gameStatus === GameStatus.FINISHED) {
        page = <FinishedPage currentRound={displayedRound}
                             rounds={rounds}
                             p1={p1.state}
                             p2={p2.state}
                             destroyers={destroyers}
                             onReset={onReset}
                             onExit={onExit}/>;
    } else {
        page = <InProgressPage currentRound={displayedRound}
                               rounds={rounds}
                               p1={p1.state}
                               p2={p2.state}/>;
    }

    return (
        <div className="app">
            <TopBar gameStatus={gameStatus}/>
            <div className="game-body">
                {page}
            </div>
        </div>
    );
}

export default function App() {
    // Bumping the key remounts Game, so every useState falls back to its default.
    const [gameKey, setGameKey] = React.useState(0);

    return <Game key={gameKey} onReset={() => setGameKey(key => key + 1)}/>;
}
