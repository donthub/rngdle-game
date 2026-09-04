from playwright.sync_api import Page


class GameApi:
    """Thin wrapper over the window.gameApi bridge that web/src/App.jsx exposes."""

    def __init__(self, page: Page):
        self.page = page

    def focus(self):
        """Raises the game window, which the player windows keep taking focus from."""
        self.page.bring_to_front()

    def wait_until_ready(self):
        self.page.wait_for_function("() => window.gameApi !== undefined")

    def wait_until_started_or_exited(self):
        self.page.wait_for_function("() => window.gameApi.isStarted() || window.gameApi.isExited()", timeout=0)

    def wait_until_finished(self):
        """The result page is held back until the last count up animation lands."""
        self.page.wait_for_function("() => window.gameApi.isFinished()", timeout=0)

    def wait_until_not_finished(self):
        self.page.wait_for_function("() => !window.gameApi.isFinished()", timeout=0)

    def is_exited(self) -> bool:
        return self.call("isExited")

    def get_rounds(self) -> int:
        return int(self.call("getRounds"))

    def get_name(self, player: str) -> str:
        return self.call("getName", player)

    def set_current_round(self, round_index: int):
        self.call("setCurrentRound", round_index)

    def add_score(self, player: str, score: int):
        self.call("addScore", player, score)

    def add_badge(self, player: str, badge_rarity: str):
        self.call("addBadge", player, badge_rarity)

    def finish_game(self):
        self.call("finishGame")

    def call(self, method: str, *arguments):
        return self.page.evaluate(f"args => window.gameApi.{method}(...args)", list(arguments))
