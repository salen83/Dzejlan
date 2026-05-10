from playwright.sync_api import sync_playwright
import time
import random
import json

results = []

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

    def log_response(resp):
        if "betting/matches" in resp.url:
            print("🎯 MATCHES API HIT")

            try:
                data = resp.json()

                results.append({
                    "url": resp.url,
                    "data": data
                })

            except Exception as e:
                print("ERROR:", e)

    page.on("response", log_response)

    page.goto(
        "https://www.mozzartbet.com/sr/kladjenje/sport/1?date=all_days",
        wait_until="domcontentloaded"
    )

    human_sleep()

    page.wait_for_timeout(10000)

    with open("matches.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"✅ Saved {len(results)} responses")

    browser.close()
