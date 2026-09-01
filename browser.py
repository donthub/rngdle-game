import logging
import tempfile

from playwright.sync_api import BrowserContext, Page, Playwright

logger = logging.getLogger(__name__)


def launch_app_window(playwright: Playwright, url: str, position: tuple, size: tuple) -> tuple[BrowserContext, Page]:
    x, y = position
    width, height = size

    logger.info(f"Opening {url} at {position} with size {size}")
    context = playwright.chromium.launch_persistent_context(
        user_data_dir=tempfile.mkdtemp(),
        headless=False,
        no_viewport=True,
        args=[
            f"--app={url}",  # removes tabs/address bar
            f"--window-position={x},{y}",
            f"--window-size={width},{height}",
        ],
    )
    page = context.pages[0] if context.pages else context.new_page()
    return context, page
