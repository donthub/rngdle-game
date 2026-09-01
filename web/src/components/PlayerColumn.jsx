// One side of the triptych: a 2px accent rule claims the side, recoloured to a neutral
// hairline while that side is inactive.
export default function PlayerColumn({ player, active = false, winner = false, children }) {
    const columnClass = winner ? ` ${player}-column-winner` : "";
    const ruleClass = active ? ` ${player}-accent-rule-active` : "";
    return (
        <div className={`player-column${columnClass}`}>
            <div className={`player-accent-rule${ruleClass}`}/>
            {children}
        </div>
    );
}
