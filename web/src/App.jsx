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

const DEFAULT_SETUP = Object.freeze({
    rounds: 5,
    p1: { name: "", character: Character.SOL },
    p2: { name: "", character: Character.KY },
});

function usePlayer(setup) {
    const [name, setName] = React.useState(setup.name);
    const [score, setScore] = React.useState(0);
    const [character, setCharacter] = React.useState(setup.character);
    const [action, setAction] = React.useState(null);
    const [badge, setBadge] = React.useState(null);

    // The panels show the counting value; the awarded total stays behind it
    // until the animation catches up.
    const countedScore = useCountUp(score);

    const nameRef = useLatestRef(name);
    const characterRef = useLatestRef(character);

    return {
        state: { name, score: countedScore, character, action, badge, onNameChange: setName },
        isCountingUp: countedScore !== score,
        setCharacter,
        getName: () => nameRef.current,
        addScore: value => setScore(previousScore => previousScore + Number(value)),
        // Only the rarity of the last badge is kept: the chip has nothing to say about a
        // repeat of the rarity already up beside it (see PlayerBadge.jsx).
        addBadge: rarity => {
            setAction(previousImage =>
                resolveBadgeMoveImage(rarity, characterRef.current, previousImage) ?? previousImage);
            setBadge(rarity);
        },
    };
}

function Game({ setup, onRematch, onReset }) {
    // The meter can be cut back mid-game by a game ending badge, so what the player picked
    // is kept beside it: that is the count a rematch starts over on.
    const [selectedRounds, setSelectedRounds] = React.useState(setup.rounds);
    const [rounds, setRounds] = React.useState(setup.rounds);
    const [currentRound, setCurrentRound] = React.useState(null);
    const [gameStatus, setGameStatus] = React.useState(GameStatus.WAITING);
    const [destroyers, setDestroyers] = React.useState([]);
    const [finishRequested, setFinishRequested] = React.useState(false);
    const [selectedPlayerIndex, setSelectedPlayerIndex] = React.useState(0);

    const p1 = usePlayer(setup.p1);
    const p2 = usePlayer(setup.p2);
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

    // The two picks are made in turn and then the roster is done. It does not wrap back
    // round to p1, so a stray click cannot overwrite a pick that has already been made.
    const onSelectCharacter = character => {
        if (selectedPlayerIndex >= players.length) {
            return;
        }
        players[selectedPlayerIndex].setCharacter(character);
        setSelectedPlayerIndex(index => index + 1);
    };
    // Putting the turn back on p1 is what re-opens the roster. Both sides keep the
    // character they have until it is picked over, so the board never goes blank.
    const onResetPicks = selectedPlayerIndex === 0 ? null : () => setSelectedPlayerIndex(0);
    // Only the selector writes to the picked count; the badge cut above touches the meter alone.
    const onRoundsChange = value => {
        setRounds(value);
        setSelectedRounds(value);
    };
    // A rematch replays the setup the players already have, so it is handed back as it
    // stands (see App below) with the picked round count rather than a cut back meter.
    const onRematchGame = () => onRematch({
        rounds: selectedRounds,
        p1: { name: p1.state.name, character: p1.state.character },
        p2: { name: p2.state.name, character: p2.state.character },
    });
    const onStart = () => setGameStatus(GameStatus.IN_PROGRESS);
    const onExit = () => setGameStatus(GameStatus.EXITED);
    const displayedRound = currentRound === null ? 0 : currentRound + 1;

    let page;
    if (gameStatus === GameStatus.WAITING) {
        page = <WaitingPage rounds={rounds}
                            onRoundsChange={onRoundsChange}
                            onSelectCharacter={onSelectCharacter}
                            nextPlayer={PLAYER_KEYS[selectedPlayerIndex] ?? null}
                            onResetPicks={onResetPicks}
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
                             onRematch={onRematchGame}
                             onReset={onReset}
                             onExit={onExit}/>;
    } else {
        page = <InProgressPage currentRound={displayedRound}
                       rounds={rounds}
                       p1={p1.state}
                       p2={p2.state}/>;
    }

    // Only the setup page carries the bar. Both scored pages drop it, which gives the
    // character art back the 44px it would take; there the rope is the top of the window
    // and each column names its own player (see TugOfWar.jsx).
    return (
        <div className="app">
            {gameStatus === GameStatus.WAITING ? <TopBar/> : null}
            <div className="game-body">
                {page}
            </div>
        </div>
    );
}

export default function App() {
    // Bumping the key remounts Game, so every useState falls back to what the setup carries.
    // A rematch hands back the names, characters and round count the last game was played
    // on; a reset drops the lot back to the defaults.
    const [gameKey, setGameKey] = React.useState(0);
    const [setup, setSetup] = React.useState(DEFAULT_SETUP);

    const restart = nextSetup => {
        setSetup(nextSetup);
        setGameKey(key => key + 1);
    };

    return <Game key={gameKey}
                 setup={setup}
                 onRematch={restart}
                 onReset={() => restart(DEFAULT_SETUP)}/>;
}
