from playwright.sync_api import sync_playwright
import time
import random

def human_sleep(a=1.5, b=4.0):
    time.sleep(random.uniform(a, b))

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        args=["--no-sandbox"]
    )

    context = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    )

    page = context.new_page()

    print("🔄 Loading page...")

    page.goto(
        "https://www.mozzartbet.com/sr/kladjenje/sport/1?date=all_days",
        wait_until="domcontentloaded"
    )

    human_sleep()

    # sačekaj mrežu stabilno
    page.wait_for_timeout(5000)

    print("✅ Page loaded")

    # hvatanje API poziva
    def log_response(resp):
        if "betting/matches" in resp.url:
            print("\\n🎯 MATCHES API HIT")
            try:
                print(resp.json())
            except:
                print(resp.text())

    page.on("response", log_response)

    page.wait_for_timeout(10000)

    browser.close()
