import logging

from playwright.async_api import Page
from playwright.sync_api import sync_playwright

import browser
import web_server
from game_api import GameApi
from game_round import start_round

logger = logging.getLogger(__name__)

WINDOW_POSITION = (-10, -30)
WINDOW_SIZE = (1940, 545)
BLANK_WINDOW_POSITION = (-10, 475)
BLANK_WINDOW_SIZE = (1940, 1080)


def run(config: dict):
    logger.info(f"Config: {config}")

    with web_server.WebServer(port=config.get("web_port", 5173)) as server, sync_playwright() as playwright:
        blank_context, blank_page = browser.launch_app_window(playwright, "about:blank", BLANK_WINDOW_POSITION, BLANK_WINDOW_SIZE)
        set_background(blank_page)

        context, page = browser.launch_app_window(playwright, server.url, WINDOW_POSITION, WINDOW_SIZE)

        game_api = GameApi(page)
        game_api.wait_until_ready()

        # A game leaves the result page either for a fresh setup or for the exit, and
        # the wait below falls straight through in the latter case.
        while True:
            game_api.wait_until_started_or_exited()
            if game_api.is_exited():
                break

            play_game(game_api)

        context.close()
        blank_context.close()


def play_game(game_api: GameApi):
    logger.info(f"P1 name: {game_api.get_name('p1')}")
    logger.info(f"P2 name: {game_api.get_name('p2')}")

    rounds = game_api.get_rounds()
    logger.info(f"Rounds: {rounds}")

    round_index = 0
    while round_index < rounds:
        game_api.set_current_round(round_index)
        start_round(game_api)

        # A game ending badge makes the round it was rolled in the last one (see web/src/badges.js)
        remaining_rounds = game_api.get_rounds()
        if remaining_rounds != rounds:
            logger.info(f"Rounds cut back to {remaining_rounds}")
            rounds = remaining_rounds
        round_index += 1

    game_api.finish_game()
    game_api.wait_until_finished()
    game_api.wait_until_not_finished()


def set_background(page: Page):
    page.locator("body").evaluate("(element, style) => element.setAttribute('style', style)", "background-color: #fafaf7")
