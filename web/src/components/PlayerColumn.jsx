import classNames from "../classNames.js";
import Fireworks from "./Fireworks.jsx";

// One side of the triptych: a 2px accent rule claims the side, recoloured to a neutral
// hairline while that side is inactive. The winner's side also gets fireworks, drawn
// behind the panels so the score and the art stay crisp.
export default function PlayerColumn({ player, active = false, winner = false, children }) {
    return (
        <div className={classNames("player-column", winner && `${player}-column-winner`)}>
            <div className={classNames("player-accent-rule", active && `${player}-accent-rule-active`)}/>
            {winner ? <Fireworks/> : null}
            {children}
        </div>
    );
}
