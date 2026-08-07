import argparse
import json
import logging
from pathlib import Path

import game


def setup_logging(log_file: str = "app.log", level=logging.INFO) -> None:
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.StreamHandler(),  # prints to console
            logging.FileHandler(log_file),  # saves to file
        ],
    )


setup_logging()

logger = logging.getLogger(__name__)

parser = argparse.ArgumentParser()
parser.add_argument("--rounds")
args = parser.parse_args()

config_path = Path(__file__).resolve().parent / "config.json"
config = json.loads(config_path.read_text(encoding="utf-8"))

game.run(config)
