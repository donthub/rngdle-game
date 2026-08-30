import logging
import os
import shutil
import signal
import subprocess
import time
import urllib.error
import urllib.request
from pathlib import Path

logger = logging.getLogger(__name__)

WEB_DIR = Path(__file__).resolve().parent / "web"
IS_WINDOWS = os.name == "nt"


class WebServer:
    """Runs the React web app with the Vite dev server and exposes its localhost URL."""

    def __init__(self, port: int = 5173, startup_timeout: float = 60.0):
        self.port = port
        self.startup_timeout = startup_timeout
        self.url = f"http://127.0.0.1:{port}"
        self.process = None

    def __enter__(self):
        self.start()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.stop()

    def start(self):
        npm = resolve_npm()
        install_dependencies(npm)

        logger.info(f"Starting Vite dev server on {self.url}")
        self.process = subprocess.Popen(
            [npm, "run", "dev", "--", "--port", str(self.port), "--strictPort"],
            cwd=WEB_DIR,
            # Own process group, so the whole npm/vite tree can be stopped
            start_new_session=not IS_WINDOWS,
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if IS_WINDOWS else 0,
        )
        self.wait_until_ready()

    def wait_until_ready(self):
        deadline = time.monotonic() + self.startup_timeout
        while time.monotonic() < deadline:
            if self.process.poll() is not None:
                raise RuntimeError(f"Vite dev server exited with code {self.process.returncode}")
            try:
                with urllib.request.urlopen(self.url, timeout=1):
                    logger.info("Vite dev server is ready")
                    return
            except (urllib.error.URLError, OSError):
                time.sleep(0.2)
        self.stop()
        raise TimeoutError(f"Vite dev server did not become ready within {self.startup_timeout} seconds")

    def stop(self):
        if self.process is None or self.process.poll() is not None:
            return

        logger.info("Stopping Vite dev server")
        self.terminate_process_tree()
        try:
            self.process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            logger.warning("Vite dev server did not stop in time, killing it")
            self.kill_process_tree()
            self.process.wait()

    def terminate_process_tree(self):
        if IS_WINDOWS:
            self.taskkill(force=False)
        else:
            self.signal_process_group(signal.SIGTERM)

    def kill_process_tree(self):
        if IS_WINDOWS:
            self.taskkill(force=True)
        else:
            self.signal_process_group(signal.SIGKILL)

    def signal_process_group(self, sig: int):
        try:
            os.killpg(os.getpgid(self.process.pid), sig)
        except (ProcessLookupError, PermissionError):
            pass

    def taskkill(self, force: bool):
        # taskkill /T walks the npm -> node tree, which is the Windows counterpart of killpg
        command = ["taskkill", "/T", "/PID", str(self.process.pid)]
        if force:
            command.insert(1, "/F")
        subprocess.run(command, capture_output=True)


def resolve_npm() -> str:
    npm = shutil.which("npm")
    if npm is None:
        raise RuntimeError("npm was not found on PATH, install Node.js to run the web app")
    return npm


def install_dependencies(npm: str):
    if (WEB_DIR / "node_modules").is_dir():
        return

    logger.info("Installing web dependencies")
    subprocess.run([npm, "install"], cwd=WEB_DIR, check=True)
