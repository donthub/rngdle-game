import logging
import queue
import threading
import time

from playwright.sync_api import sync_playwright, Page

import browser
from game_api import GameApi

logger = logging.getLogger(__name__)

RNGDLE_URL = "https://rngdle.com"
RNGDLE_THEME = "Dark"

PLAYER_WINDOW_POSITIONS = {
    "p1": (-10, 480),
    "p2": (952, 480),
}
PLAYER_WINDOW_SIZE = (978, 610)

RESULT_DISPLAY_SECONDS = 3
BADGE_POLL_SECONDS = 0.1

RESULT_PANEL = "main > div:nth-of-type(1)"
SCORE_PANEL = f"{RESULT_PANEL} > div:nth-of-type(3)"
SCORE_TEXT = f"{SCORE_PANEL} > div:nth-of-type(1)"
LIFETIME_EP = f"{SCORE_PANEL} > div:nth-of-type(2)"
BADGE_PANEL = f"{RESULT_PANEL} > div:nth-of-type(4)"
BADGE_PANEL_TITLE = f"{BADGE_PANEL} > div:nth-of-type(1)"
BADGE_LIST = ".space-y-3"
BADGE_RARITY = "> div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(3)"

THEME_BUTTON = f"[title='{RNGDLE_THEME}']"
ROLL_BUTTON = "[aria-label='Generate a new number']"
SCORE_READY = "[aria-label='Copy to clipboard']"


def start_round(game_api: GameApi) -> dict:
    roll_event, stop_event = threading.Event(), threading.Event()
    badge_queue = queue.Queue()
    scores = {}
    ready_events, score_events, threads = {}, {}, {}

    for player, position in PLAYER_WINDOW_POSITIONS.items():
        ready_events[player] = threading.Event()
        score_events[player] = threading.Event()
        threads[player] = threading.Thread(
            target=player_round,
            kwargs=dict(
                player=player,
                position=position,
                scores=scores,
                badge_queue=badge_queue,
                ready_event=ready_events[player],
                roll_event=roll_event,
                score_event=score_events[player],
                stop_event=stop_event,
            ),
            daemon=True,
        )
        threads[player].start()

    for ready_event in ready_events.values():
        ready_event.wait()
    logger.info("All pages ready")

    roll_event.set()

    for player, score_event in score_events.items():
        wait_for_score(score_event, game_api, badge_queue)
        logger.info(f"[{player}] Score: {scores[player]}")

    time.sleep(RESULT_DISPLAY_SECONDS)

    stop_event.set()
    for thread in threads.values():
        thread.join()
    drain_badge_queue(game_api, badge_queue)

    return {player: scores[player] for player in PLAYER_WINDOW_POSITIONS}


def wait_for_score(score_event: threading.Event, game_api: GameApi, badge_queue: queue.Queue):
    while not score_event.wait(BADGE_POLL_SECONDS):
        drain_badge_queue(game_api, badge_queue)
    drain_badge_queue(game_api, badge_queue)


def drain_badge_queue(game_api: GameApi, badge_queue: queue.Queue):
    while True:
        try:
            player, badge_rarity = badge_queue.get_nowait()
        except queue.Empty:
            return
        game_api.add_badge(player, badge_rarity)


def player_round(
        player: str,
        position: tuple,
        scores: dict,
        badge_queue: queue.Queue,
        ready_event: threading.Event,
        roll_event: threading.Event,
        score_event: threading.Event,
        stop_event: threading.Event
):
    with sync_playwright() as playwright:
        context, page = browser.launch_app_window(playwright, RNGDLE_URL, position, PLAYER_WINDOW_SIZE)

        page.locator(THEME_BUTTON).click()
        remove_element(page, "header")
        ready_event.set()  # signal that this page is ready

        roll_event.wait()

        page.locator(ROLL_BUTTON).click()

        page.get_by_text("Badge breakdown").wait_for(timeout=0)
        remove_element(page, BADGE_PANEL_TITLE)

        collect_badges(page, badge_queue, player)

        page.wait_for_selector(SCORE_READY)
        score_content = page.locator(SCORE_TEXT).text_content()
        scores[player] = parse_score(score_content)
        remove_element(page, LIFETIME_EP)
        remove_element(page, BADGE_PANEL)
        score_event.set()

        stop_event.wait()
        context.close()


def collect_badges(page: Page, badge_queue: queue.Queue, player: str):
    """Queues the rarity of every badge as it appears, and returns once the score is ready."""
    collected_count = 0
    while True:
        badges = page.locator(BADGE_LIST).locator("> div")
        badges_count = badges.count()
        while collected_count < badges_count:
            # Badges are prepended, so the list is walked backwards to queue them in the order they were rolled
            badge = badges.nth(badges_count - collected_count - 1)
            badge_rarity = badge.locator(BADGE_RARITY).text_content()
            logger.info(f"[{player}] Badge rarity: {badge_rarity}")
            badge_queue.put((player, badge_rarity))
            collected_count += 1

        if page.locator(SCORE_READY).count() > 0:
            if player == "p1":
                badge_queue.put((player, "ANOMALY"))
            return

        time.sleep(BADGE_POLL_SECONDS)


def parse_score(score_text: str) -> str:
    return score_text.replace(",", "").replace(" ", "").replace("EP", "")


def remove_element(page: Page, selector: str):
    page.locator(selector).evaluate("element => element.remove()")
