import logging
import tempfile
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

import game_round
from game_round import start_round

logger = logging.getLogger(__name__)


def run(config: dict):
    logger.info(f"Config: {config}")

    size = (1920, 480)
    position = (0, 0)
    user_data_dir = tempfile.mkdtemp()
    width, height = size
    script_dir = Path(__file__).resolve().parent
    with sync_playwright() as playwright:
        context = playwright.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=False,
            viewport=None,
            args=[
                f"--app=file:///{script_dir}/game-window.html",  # removes tabs/address bar
            ],
        )
        page = context.pages[0] if context.pages else context.new_page()
        x, y = position
        set_window_bounds(page=page, x=x, y=y, width=width, height=height)

        page.evaluate(f"() => setRounds({config['rounds']});")
        page.evaluate(f"() => setP1Name(\"{config['p1_name']}\");")
        page.evaluate(f"() => setP2Name(\"{config['p2_name']}\");")

        page.wait_for_selector(".game-started", state="attached", timeout=0)

        for i in range(config['rounds']):
            page.evaluate(f"() => setCurrentRound({i});")
            p1_result, p2_result = {}, {}
            start_round(p1_result, p2_result)
            page.evaluate(f"() => addP1Score({p1_result['score']});")
            page.evaluate(f"() => addP2Score({p2_result['score']});")

        page.evaluate(f"() => finishGame({p2_result['score']});")

        input()

        context.close()


def set_window_bounds(page, x: int, y: int, width: int, height: int):
    cdp = page.context.new_cdp_session(page)
    window_id = cdp.send("Browser.getWindowForTarget")["windowId"]
    cdp.send("Browser.setWindowBounds", {
        "windowId": window_id,
        "bounds": {"windowState": "normal"}
    })
    cdp.send("Browser.setWindowBounds", {
        "windowId": window_id,
        "bounds": {"left": x, "top": y, "width": width, "height": height}
    })

    page.wait_for_timeout(100)

    page.set_viewport_size({"width": width, "height": height})
