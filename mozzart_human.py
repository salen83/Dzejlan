from playwright.sync_api import sync_playwright
import json

captured = []

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        args=["--no-sandbox"]
    )

    context = browser.new_context()
    page = context.new_page()

    def log_request(req):
        if "/betting/matches" in req.url:
            print("\n🎯 REQUEST")
            print("URL:", req.url)
            print("METHOD:", req.method)

            try:
                print("POST DATA:", req.post_data)
            except:
                pass

            captured.append({
                "url": req.url,
                "method": req.method,
                "post_data": req.post_data
            })

    page.on("request", log_request)

    page.goto(
        "https://www.mozzartbet.com/sr/kladjenje/sport/1?date=all_days",
        wait_until="load"
    )

    page.wait_for_timeout(15000)

    with open("matches.json", "w", encoding="utf-8") as f:
        json.dump(captured, f, ensure_ascii=False, indent=2)

    browser.close()
