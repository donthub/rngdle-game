// The character art stands on a hairline floor with a soft contact shadow. Mirroring the
// whole stage for p2 is safe: both the floor and the shadow are horizontally centred.
export default function PlayerStage({ player, children }) {
    return (
        <div className={`player-stage ${player}-action`}>
            <div className="player-stage-floor"/>
            <div className="player-stage-shadow"/>
            {children}
        </div>
    );
}
