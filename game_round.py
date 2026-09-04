import dataclasses
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
    "p1": (-10, 505),
    "p2": (952, 505),
}
PLAYER_WINDOW_SIZE = (978, 585)

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
BADGE_SCORE = "> div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1)"

THEME_BUTTON = f"[title='{RNGDLE_THEME}']"
ROLL_BUTTON = "[aria-label='Generate a new number']"
SCORE_READY = "[aria-label='Copy to clipboard']"


@dataclasses.dataclass(frozen=True)
class Badge:
    """One badge as it was rolled, on its way to the board."""

    player: str
    rarity: str
    score: int


@dataclasses.dataclass
class PlayerRound:
    """One player's rngdle.com window for a single round, run on a thread of its own.

    The main thread waits on `ready_event` before releasing `roll_event`, then on
    `score_event`, after which `score` is the total the page settled on. `stop_event`
    holds the window open until both results have been on screen for a moment.
    """

    player: str
    position: tuple[int, int]
    badge_queue: queue.Queue
    roll_event: threading.Event
    stop_event: threading.Event
    ready_event: threading.Event = dataclasses.field(default_factory=threading.Event)
    score_event: threading.Event = dataclasses.field(default_factory=threading.Event)
    score: int | None = None
    thread: threading.Thread | None = None

    def start(self):
        self.thread = threading.Thread(target=self.run, daemon=True)
        self.thread.start()

    def join(self):
        self.thread.join()

    def run(self):
        # A Playwright instance of its own, because the sync API is not thread safe
        with sync_playwright() as playwright:
            context, page = browser.launch_app_window(playwright, RNGDLE_URL, self.position, PLAYER_WINDOW_SIZE)

            page.locator(THEME_BUTTON).click()
            remove_element(page, "header")
            self.ready_event.set()  # signal that this page is ready

            self.roll_event.wait()

            page.locator(ROLL_BUTTON).click()

            page.get_by_text("Badge breakdown").wait_for(timeout=0)
            remove_element(page, BADGE_PANEL_TITLE)

            self.collect_badges(page)

            page.wait_for_selector(SCORE_READY)
            self.score = parse_score(page.locator(SCORE_TEXT).text_content())
            remove_element(page, LIFETIME_EP)
            remove_element(page, BADGE_PANEL)
            self.score_event.set()

            self.stop_event.wait()
            context.close()

    def collect_badges(self, page: Page):
        """Queues every badge as it appears, and returns once the score is ready."""
        collected_count = 0
        while True:
            badges = page.locator(BADGE_LIST).locator("> div")
            badges_count = badges.count()
            while collected_count < badges_count:
                # Badges are prepended, so the list is walked backwards to queue them in
                # the order they were rolled
                badge = badges.nth(badges_count - collected_count - 1)
                rarity = badge.locator(BADGE_RARITY).text_content()
                logger.info(f"[{self.player}] Badge rarity: {rarity}")
                score = parse_score(badge.locator(BADGE_SCORE).text_content())
                self.badge_queue.put(Badge(player=self.player, rarity=rarity, score=score))
                collected_count += 1

            if page.locator(SCORE_READY).count() > 0:
                return

            time.sleep(BADGE_POLL_SECONDS)


def start_round(game_api: GameApi):
    """Rolls both players' windows in step, feeding badges to the board as they land."""
    roll_event, stop_event = threading.Event(), threading.Event()
    badge_queue = queue.Queue()
    player_rounds = [
        PlayerRound(
            player=player,
            position=position,
            badge_queue=badge_queue,
            roll_event=roll_event,
            stop_event=stop_event,
        )
        for player, position in PLAYER_WINDOW_POSITIONS.items()
    ]

    for player_round in player_rounds:
        player_round.start()

    for player_round in player_rounds:
        player_round.ready_event.wait()
    logger.info("All pages ready")

    roll_event.set()

    for player_round in player_rounds:
        wait_for_score(player_round.score_event, game_api, badge_queue)
        logger.info(f"[{player_round.player}] Score: {player_round.score}")

    time.sleep(RESULT_DISPLAY_SECONDS)

    stop_event.set()
    for player_round in player_rounds:
        player_round.join()
    drain_badge_queue(game_api, badge_queue)


def wait_for_score(score_event: threading.Event, game_api: GameApi, badge_queue: queue.Queue):
    while not score_event.wait(BADGE_POLL_SECONDS):
        drain_badge_queue(game_api, badge_queue)
    drain_badge_queue(game_api, badge_queue)


def drain_badge_queue(game_api: GameApi, badge_queue: queue.Queue):
    while True:
        try:
            badge = badge_queue.get_nowait()
        except queue.Empty:
            return
        game_api.add_badge(badge.player, badge.rarity)
        game_api.add_score(badge.player, badge.score)


def parse_score(score_text: str) -> int:
    return int(score_text.replace(",", "").replace(" ", "").replace("EP", ""))


def remove_element(page: Page, selector: str):
    page.locator(selector).evaluate("element => element.remove()")
