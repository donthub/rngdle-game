import Fireworks from "./Fireworks.jsx";

// One side of the triptych: a 2px accent rule claims the side, recoloured to a neutral
// hairline while that side is inactive. The winner's side also gets fireworks, drawn
// behind the panels so the score and the art stay crisp.
export default function PlayerColumn({ player, active = false, winner = false, children }) {
    const columnClass = winner ? ` ${player}-column-winner` : "";
    const ruleClass = active ? ` ${player}-accent-rule-active` : "";
    return (
        <div className={`player-column${columnClass}`}>
            <div className={`player-accent-rule${ruleClass}`}/>
            {winner ? <Fireworks/> : null}
            {children}
        </div>
    );
}
