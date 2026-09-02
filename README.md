# RNGdle Game

## Pre-requisites

- Install Python3: https://www.python.org/
- Install Node.js: https://nodejs.org/en

### Linux

```
# Create Python venv
python3 -m venv .venv

# Activate venv
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Initialize Playwright
playwright install

# Install NPM dependencies
(cd web && npm install)
```

### Windows

```
# Create Python venv
python -m venv .venv

# Activate venv
.venv\Scripts\activate.bat

# Install requirements
pip install -r requirements.txt

# Initialize Playwright
playwright install

# Install NPM dependencies
cd web
npm install
```

## Running

The game window is a React app served by the Vite dev server on `http://127.0.0.1:5173`
(configurable with `web_port` in `config.json`). `app.py` starts the dev server, opens it in a
Chromium app window, and stops the server when the game exits.

### Linux

```
# Activate venv
source .venv/bin/activate

# Run application
python3 app.py
```

### Windows

```
# Activate venv
.venv\Scripts\activate.bat

# Run application
python app.py
```

## Web app

The web app lives in `web/` and can also be run on its own:

```
(cd web && npm run dev)
```

The Python driver controls the UI through `window.gameApi`, which `web/src/App.jsx` exposes.
