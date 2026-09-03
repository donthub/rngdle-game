import json
import logging
from pathlib import Path

import game

PROJECT_DIR = Path(__file__).resolve().parent
CONFIG_PATH = PROJECT_DIR / "config.json"
LOG_PATH = PROJECT_DIR / "app.log"


def setup_logging(log_file: Path = LOG_PATH, level: int = logging.INFO) -> None:
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.StreamHandler(),  # prints to console
            logging.FileHandler(log_file),  # saves to file
        ],
    )


def main():
    setup_logging()
    config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    game.run(config)


if __name__ == "__main__":
    main()
