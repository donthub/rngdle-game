import React from "react";

// The smallest awards are around 2,000 points and should run for three
// seconds. Scaling on the cube root from there keeps the five figure awards
// in range: ten times the award is only about twice the run.
const REFERENCE_AMOUNT = 2000;
const REFERENCE_DURATION_MS = 3000;
const SCALE_EXPONENT = 1 / 4;
const MAX_DURATION_MS = 6000;

const EASE_EXPONENT = 8;

function resolveDuration(amount) {
    const duration = REFERENCE_DURATION_MS * Math.pow(Math.abs(amount) / REFERENCE_AMOUNT, SCALE_EXPONENT);
    return Math.min(duration, MAX_DURATION_MS);
}

// Ease-out: most of the distance is covered in the first few frames, then the
// last stretch crawls in before the final value lands.
function easeOut(progress) {
    return 1 - Math.pow(1 - progress, EASE_EXPONENT);
}

// Counts from the value currently on screen towards `target`. A target that
// changes mid-flight retargets the running animation instead of snapping, so
// scores arriving back to back stay continuous.
export default function useCountUp(target) {
    const [displayed, setDisplayed] = React.useState(target);
    const displayedRef = React.useRef(target);

    React.useEffect(() => {
        const from = displayedRef.current;
        if (from === target) {
            return undefined;
        }

        const duration = resolveDuration(target - from);
        let frame = null;
        let startedAt = null;
        const step = timestamp => {
            if (startedAt === null) {
                startedAt = timestamp;
            }
            const progress = Math.min((timestamp - startedAt) / duration, 1);
            const value = Math.round(from + (target - from) * easeOut(progress));
            displayedRef.current = value;
            setDisplayed(value);
            if (progress < 1) {
                frame = requestAnimationFrame(step);
            }
        };

        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [target]);

    return displayed;
}
