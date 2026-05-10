from playwright.sync_api import sync_playwright
import json

matches_data = []

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        args=["--no-sandbox"]
    )

    context = browser.new_context()

    page = context.new_page()

    def log_response(resp):
        if "https://www.mozzartbet.com/betting/matches" in resp.url:
            print("🎯 FOUND MATCHES API")

            try:
                data = resp.json()

                matches_data.append({
                    "url": resp.url,
                    "data": data
                })

                print("✅ JSON captured")

            except Exception as e:
                print("❌ JSON ERROR:", e)

    page.on("response", log_response)

    page.goto(
        "https://www.mozzartbet.com/sr/kladjenje/sport/1?date=all_days",
        wait_until="load"
    )

    page.wait_for_timeout(15000)

    with open("matches.json", "w", encoding="utf-8") as f:
        json.dump(matches_data, f, ensure_ascii=False, indent=2)

    print("Saved responses:", len(matches_data))

    browser.close()
