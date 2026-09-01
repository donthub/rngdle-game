import React from "react";

// A rocket climbs from the foot of the column and bursts into sparks that arc down
// under gravity. Sparks are drawn as short streaks between their previous and current
// position, so the canvas stays transparent over the winner's tint instead of having
// to repaint the background to fade out trails.

const LAUNCH_DELAY_MS = [260, 720];
const LAUNCH_BAND = [0.18, 0.82]; // fraction of the width a rocket lifts off from
const APEX_BAND = [0.08, 0.34]; // fraction of the height the rocket stalls out at
const SPARK_COUNT = [38, 58];
const SPARK_SPEED = [0.06, 0.46]; // px per ms
const SPARK_LIFE_MS = [900, 1700];
const GRAVITY = 0.00035; // px per ms squared
const DRAG = 0.0013; // fraction of a spark's velocity shed per ms
const TRAIL_MS = 30; // streak length, measured as travel time
const MAX_FRAME_MS = 48; // a backgrounded tab must not teleport everything
const SPARK_WIDTH = 1.9;
const ROCKET_WIDTH = 2;
const FALLBACK_COLOR = "#1e1d19";

function randomIn([min, max]) {
    return min + Math.random() * (max - min);
}

function randomPick(values) {
    return values[Math.floor(Math.random() * values.length)];
}

// The palette lives with the rest of the player tokens in styles.scss and arrives as a
// comma separated custom property, so the sim never hard codes a player's hue.
function readColors(element) {
    const colors = window.getComputedStyle(element)
        .getPropertyValue("--firework-colors")
        .split(",")
        .map(color => color.trim())
        .filter(color => color.length > 0);
    return colors.length > 0 ? colors : [FALLBACK_COLOR];
}

// The rocket is fired hard enough that gravity alone stalls it at the target height:
// launching at sqrt(2 g h) puts the top of the arc in the apex band, so the burst lands
// where it should without the climb having to be faked.
function spawnRocket(width, height, color) {
    const rise = height * (1 - randomIn(APEX_BAND));
    return {
        x: width * randomIn(LAUNCH_BAND),
        y: height,
        velocityX: 0,
        velocityY: -Math.sqrt(2 * GRAVITY * rise),
        color,
    };
}

// Biasing the speed towards the outer edge keeps the burst reading as a shell rather
// than an evenly filled disc. Every spark draws its own hue, so a burst comes out mixed
// instead of monochrome.
function spawnSparks(rocket, colors) {
    const sparks = [];
    const count = Math.round(randomIn(SPARK_COUNT));
    for (let index = 0; index < count; index += 1) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = SPARK_SPEED[0] + (SPARK_SPEED[1] - SPARK_SPEED[0]) * Math.sqrt(Math.random());
        sparks.push({
            x: rocket.x,
            y: rocket.y,
            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed,
            age: 0,
            life: randomIn(SPARK_LIFE_MS),
            color: randomPick(colors),
        });
    }
    return sparks;
}

function advanceRocket(rocket, elapsed) {
    rocket.velocityY += GRAVITY * elapsed;
    rocket.y += rocket.velocityY * elapsed;
}

function advanceSpark(spark, elapsed) {
    const drag = Math.max(1 - DRAG * elapsed, 0);
    spark.velocityX *= drag;
    spark.velocityY = spark.velocityY * drag + GRAVITY * elapsed;
    spark.x += spark.velocityX * elapsed;
    spark.y += spark.velocityY * elapsed;
}

function drawStreak(context, particle, alpha, width) {
    context.globalAlpha = alpha;
    context.strokeStyle = particle.color;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(particle.x - particle.velocityX * TRAIL_MS, particle.y - particle.velocityY * TRAIL_MS);
    context.lineTo(particle.x, particle.y);
    context.stroke();
}

export default function Fireworks() {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return undefined;
        }

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        const colors = readColors(canvas);

        let width = 0;
        let height = 0;
        const resize = () => {
            const ratio = window.devicePixelRatio || 1;
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            context.lineCap = "round";
        };
        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(canvas);

        let rockets = [];
        let sparks = [];
        let launchIn = 0;
        let previousTimestamp = null;

        const step = timestamp => {
            const elapsed = previousTimestamp === null
                ? 0
                : Math.min(timestamp - previousTimestamp, MAX_FRAME_MS);
            previousTimestamp = timestamp;

            launchIn -= elapsed;
            if (launchIn <= 0 && width > 0 && height > 0) {
                rockets.push(spawnRocket(width, height, randomPick(colors)));
                launchIn = randomIn(LAUNCH_DELAY_MS);
            }

            const climbing = [];
            for (const rocket of rockets) {
                advanceRocket(rocket, elapsed);
                // The stall at the top of the arc is the burst.
                if (rocket.velocityY >= 0) {
                    sparks.push(...spawnSparks(rocket, colors));
                } else {
                    climbing.push(rocket);
                }
            }
            rockets = climbing;

            for (const spark of sparks) {
                spark.age += elapsed;
                advanceSpark(spark, elapsed);
            }
            sparks = sparks.filter(spark => spark.age < spark.life);

            context.clearRect(0, 0, width, height);
            for (const rocket of rockets) {
                drawStreak(context, rocket, 0.75, ROCKET_WIDTH);
            }
            for (const spark of sparks) {
                // Holds the spark near full strength, then drops it away over the last third.
                const remaining = 1 - spark.age / spark.life;
                drawStreak(context, spark, Math.min(remaining * 1.5, 1), SPARK_WIDTH);
            }
            context.globalAlpha = 1;

            frame = requestAnimationFrame(step);
        };

        let frame = requestAnimationFrame(step);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, []);

    return <canvas className="fireworks" ref={canvasRef} aria-hidden="true"/>;
}
