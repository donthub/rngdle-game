import React from "react";

// Mirrors the latest value into a ref, so the window.gameApi bridge can read the
// current state without having to be reinstalled on every render.
export default function useLatestRef(value) {
    const ref = React.useRef(value);
    React.useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref;
}
