import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const ASSETS_DIRECTORY = fileURLToPath(new URL("./public/assets", import.meta.url));
const MOVE_IMAGES_MODULE_ID = "virtual:move-images";
const RESOLVED_MOVE_IMAGES_MODULE_ID = `\0${MOVE_IMAGES_MODULE_ID}`;

function readDirectoryNames(directory) {
    return fs.readdirSync(directory, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
}

// { <character id>: { <move type>: ["/assets/<character id>/<move type>/<file>", ...] } }
function readMoveImages() {
    const moveImages = {};
    for (const character of readDirectoryNames(ASSETS_DIRECTORY)) {
        const characterDirectory = path.join(ASSETS_DIRECTORY, character);
        const characterImages = {};
        for (const moveType of readDirectoryNames(characterDirectory)) {
            characterImages[moveType] = fs.readdirSync(path.join(characterDirectory, moveType))
                .filter(file => file.endsWith(".png"))
                .map(file => `/assets/${character}/${moveType}/${file}`);
        }
        moveImages[character] = characterImages;
    }
    return moveImages;
}

// public/ is served as-is, so the move images are indexed here and exposed as a module.
function moveImages() {
    return {
        name: "move-images",
        resolveId(id) {
            return id === MOVE_IMAGES_MODULE_ID ? RESOLVED_MOVE_IMAGES_MODULE_ID : null;
        },
        load(id) {
            if (id !== RESOLVED_MOVE_IMAGES_MODULE_ID) {
                return null;
            }
            return `export const MOVE_IMAGES = ${JSON.stringify(readMoveImages())};`;
        },
    };
}

export default defineConfig({
    plugins: [react(), moveImages()],
    server: {
        host: "127.0.0.1",
        port: 5173,
        strictPort: true,
    },
});
