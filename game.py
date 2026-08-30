import logging
import tempfile

from playwright.sync_api import sync_playwright

import web_server
from game_round import start_round

logger = logging.getLogger(__name__)


def run(config: dict):
    logger.info(f"Config: {config}")

    size = (1920, 480)
    position = (0, 0)
    user_data_dir = tempfile.mkdtemp()
    width, height = size
    with web_server.WebServer(port=config.get("web_port", 5173)) as server, sync_playwright() as playwright:
        context = playwright.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=False,
            viewport=None,
            args=[
                f"--app={server.url}",  # removes tabs/address bar
            ],
        )
        page = context.pages[0] if context.pages else context.new_page()
        x, y = position
        set_window_bounds(page=page, x=x, y=y, width=width, height=height)

        page.wait_for_function("() => window.gameApi !== undefined")

        page.evaluate("rounds => window.gameApi.setRounds(rounds)", config["rounds"])
        page.evaluate("name => window.gameApi.setP1Name(name)", config["p1_name"])
        page.evaluate("name => window.gameApi.setP2Name(name)", config["p2_name"])

        page.wait_for_selector(".game-started", state="attached", timeout=0)

        for i in range(config["rounds"]):
            page.evaluate("round => window.gameApi.setCurrentRound(round)", i)
            p1_result, p2_result = {}, {}
            start_round(p1_result, p2_result)
            page.evaluate("score => window.gameApi.addP1Score(score)", p1_result["score"])
            page.evaluate("score => window.gameApi.addP2Score(score)", p2_result["score"])

        page.evaluate("() => window.gameApi.finishGame()")

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
