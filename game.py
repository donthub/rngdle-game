import logging
import tempfile

from playwright.sync_api import sync_playwright

import web_server
from game_round import start_round

logger = logging.getLogger(__name__)


def run(config: dict):
    logger.info(f"Config: {config}")

    x, y = (0, 0)
    width, height = (1920, 480)

    user_data_dir = tempfile.mkdtemp()
    with web_server.WebServer(port=config.get("web_port", 5173)) as server, sync_playwright() as playwright:
        context = playwright.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=False,
            no_viewport=True,
            args=[
                f"--app={server.url}",  # removes tabs/address bar
                f"--window-position={x},{y}",
                f"--window-size={width},{height}",
            ],
        )
        page = context.pages[0] if context.pages else context.new_page()
        page.goto(server.url)

        page.wait_for_function("() => window.gameApi !== undefined")

        is_exited = False
        while not is_exited:
            page.wait_for_function("() => window.gameApi.isStarted()", timeout=0)
            p1_name = page.evaluate("() => window.gameApi.getP1Name()")
            p2_name = page.evaluate("() => window.gameApi.getP2Name()")
            rounds = int(page.evaluate("() => window.gameApi.getRounds()"))
            logger.info(f"P1 name: {p1_name}")
            logger.info(f"P2 name: {p2_name}")
            logger.info(f"Rounds: {rounds}")

            for i in range(rounds):
                page.evaluate("round => window.gameApi.setCurrentRound(round)", i)
                p1_result, p2_result = {}, {}
                start_round(p1_result, p2_result)
                page.evaluate("score => window.gameApi.addP1Score(score)", p1_result["score"])
                page.evaluate("score => window.gameApi.addP2Score(score)", p2_result["score"])

            page.evaluate("() => window.gameApi.finishGame()")
            page.wait_for_function("() => !window.gameApi.isFinished()", timeout=0)
            is_exited = page.evaluate("() => window.gameApi.isExited()")

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
