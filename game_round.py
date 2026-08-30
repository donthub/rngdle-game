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
            size=(978, 610),
            position=(-10, 480),
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
            size=(978, 610),
            position=(952, 480),
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
        x, y = position
        width, height = size
        context = playwright.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=False,
            no_viewport=True,
            args=[
                "--app=https://rngdle.com",
                f"--window-position={x},{y}",
                f"--window-size={width},{height}",
            ],
        )
        page = context.pages[0] if context.pages else context.new_page()

        page.wait_for_selector(f"[title='{mode}']").click()
        page.locator("header").evaluate("element => element.remove()")
        result_holder["page"] = page
        ready_event.set()  # signal that this page is ready

        roll_event.wait()

        page.query_selector("[aria-label='Generate a new number']").click()

        page.get_by_text("Badge breakdown").wait_for(timeout=0)
        # Remove "Badge breakdown element"
        page.locator("main").locator("> div").nth(0).locator("> div").nth(3).locator("> div").nth(0).evaluate(
            "element => element.remove()")

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
