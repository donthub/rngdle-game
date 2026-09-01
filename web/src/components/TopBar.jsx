import InfoStatus from "./InfoStatus.jsx";

export default function TopBar({ gameStatus }) {
    return (
        <div className="top-bar">
            <div className="top-bar-brand">
                <span className="wordmark">+RNGdle</span>
                <span className="top-bar-subtitle">Tournament Edition</span>
            </div>
            <InfoStatus gameStatus={gameStatus}/>
        </div>
    );
}
