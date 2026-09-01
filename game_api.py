from playwright.sync_api import Page


class GameApi:
    """Thin wrapper over the window.gameApi bridge that web/src/App.jsx exposes."""

    def __init__(self, page: Page):
        self.page = page

    def wait_until_ready(self):
        self.page.wait_for_function("() => window.gameApi !== undefined")

    def wait_until_started_or_exited(self):
        self.page.wait_for_function("() => window.gameApi.isStarted() || window.gameApi.isExited()", timeout=0)

    def wait_until_not_finished(self):
        self.page.wait_for_function("() => !window.gameApi.isFinished()", timeout=0)

    def is_exited(self) -> bool:
        return self.call("isExited")

    def get_rounds(self) -> int:
        return int(self.call("getRounds"))

    def get_name(self, player: str) -> str:
        return self.call(f"get{player.upper()}Name")

    def set_current_round(self, round_index: int):
        self.call("setCurrentRound", round_index)

    def add_score(self, player: str, score: str):
        self.call(f"add{player.upper()}Score", score)

    def add_badge(self, player: str, badge_rarity: str):
        self.call(f"add{player.upper()}Badge", badge_rarity)

    def finish_game(self):
        self.call("finishGame")

    def call(self, method: str, argument=None):
        if argument is None:
            return self.page.evaluate(f"() => window.gameApi.{method}()")
        return self.page.evaluate(f"argument => window.gameApi.{method}(argument)", argument)
