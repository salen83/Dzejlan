from playwright.sync_api import sync_playwright
import json

all_urls = []

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        args=["--no-sandbox"]
    )

    context = browser.new_context()

    page = context.new_page()

    def log_response(resp):
        url = resp.url

        if "api" in url or "match" in url or "bet" in url:
            print("API:", url)

            all_urls.append(url)

    page.on("response", log_response)

    page.goto(
        "https://www.mozzartbet.com/sr/kladjenje/sport/1?date=all_days",
        wait_until="load"
    )

    page.wait_for_timeout(15000)

    with open("matches.json", "w", encoding="utf-8") as f:
        json.dump(all_urls, f, ensure_ascii=False, indent=2)

    print("Saved:", len(all_urls))

    browser.close()
