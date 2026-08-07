import logging
import tempfile
import threading
import time

from playwright.sync_api import sync_playwright, Page

logger = logging.getLogger(__name__)


def start_round(p1_result: dict, p2_result: dict):
    p1_ready, p2_ready = threading.Event(), threading.Event()
    roll_event = threading.Event()
    p1_score, p2_score = threading.Event(), threading.Event()
    stop_event = threading.Event()

    t1 = threading.Thread(
        target=player_game,
        kwargs=dict(
            mode="Dark",
            size=(960, 600),
            position=(0, 480),
            result_holder=p1_result,
            ready_event=p1_ready,
            roll_event=roll_event,
            score_event=p1_score,
            stop_event=stop_event
        ),
        daemon=True,
    )
    t2 = threading.Thread(
        target=player_game,
        kwargs=dict(
            mode="Dark",
            size=(960, 600),
            position=(960, 480),
            result_holder=p2_result,
            ready_event=p2_ready,
            roll_event=roll_event,
            score_event=p2_score,
            stop_event=stop_event
        ),
        daemon=True,
    )

    t1.start()
    t2.start()

    p1_ready.wait()
    p2_ready.wait()
    logger.info("Both pages ready")

    roll_event.set()

    p1_score.wait()
    logger.info(f"P1 score: {p1_result['score']}")
    p2_score.wait()
    logger.info(f"P2 score: {p2_result['score']}")

    time.sleep(3)

    stop_event.set()
    t1.join()
    t2.join()


def player_game(
        mode: str,
        size: tuple,
        position: tuple,
        result_holder: dict,
        ready_event: threading.Event,
        roll_event: threading.Event,
        score_event: threading.Event,
        stop_event: threading.Event
):
    with sync_playwright() as playwright:
        user_data_dir = tempfile.mkdtemp()
        width, height = size
        context = playwright.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=False,
            viewport=None,
            args=[
                "--app=https://rngdle.com",
                "--window-position=-3000,-3000",
            ]
        )
        page = context.pages[0] if context.pages else context.new_page()

        page.wait_for_selector(f"[title='{mode}']").click()
        page.locator("header").evaluate("element => element.remove()")
        result_holder["page"] = page
        ready_event.set()  # signal that this page is ready

        roll_event.wait()

        x, y = position
        set_window_bounds(page=page, x=x, y=y, width=width, height=height)

        page.query_selector("[aria-label='Generate a new number']").click()

        page.wait_for_selector("[aria-label='Copy to clipboard']")
        score = page.locator("main").locator("> div").nth(0).locator("> div").nth(2).locator("> div").nth(
            0).text_content()

        # Remove "Lifetime EP" element
        page.locator("main").locator("> div").nth(0).locator("> div").nth(2).locator("> div").nth(1).evaluate(
            "element => element.remove()")
        # Remove "Share" element
        page.locator("main").locator("> div").nth(0).locator("> div").nth(3).evaluate("element => element.remove()")

        result_holder["score"] = score.replace(",", "").replace(" ", "").replace("EP", "")
        score_event.set()

        stop_event.wait()
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

    page.set_viewport_size({"width": width, "height": height})

def set_window_state(page: Page, state: str):
    """state: 'normal', 'minimized', 'maximized', or 'fullscreen'"""
    cdp = page.context.new_cdp_session(page)
    window_id = cdp.send("Browser.getWindowForTarget")["windowId"]
    cdp.send("Browser.setWindowBounds", {
        "windowId": window_id,
        "bounds": {"windowState": state}
    })

def set_window_offscreen(page):
    cdp = page.context.new_cdp_session(page)
    window_id = cdp.send("Browser.getWindowForTarget")["windowId"]
    cdp.send("Browser.setWindowBounds", {
        "windowId": window_id,
        "bounds": {"windowState": "normal"}
    })
    cdp.send("Browser.setWindowBounds", {
        "windowId": window_id,
        "bounds": {"left": -3000, "top": -3000, "width": 640, "height": 1280}
    })