from playwright.sync_api import sync_playwright
import json

all_matches = []

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        args=["--no-sandbox"]
    )

    context = browser.new_context()
    page = context.new_page()

    page.goto(
        "https://www.mozzartbet.com/sr/kladjenje/sport/1?date=all_days",
        wait_until="load"
    )

    page.wait_for_timeout(5000)

    for current_page in range(0, 20):
        payload = {
            "date": "all_days",
            "sort": "bycompetition",
            "currentPage": current_page,
            "pageSize": 15,
            "sportId": 1,
            "competitionIds": [],
            "search": "",
            "matchTypeId": 0
        }

        print(f"PAGE {current_page}")

        response = page.request.post(
            "https://www.mozzartbet.com/betting/matches",
            data=payload
        )

        try:
            data = response.json()

            matches = data.get("matches", [])

            print("MATCHES:", len(matches))

            if not matches:
                break

            all_matches.extend(matches)

        except Exception as e:
            print("ERROR:", e)

    with open("matches.json", "w", encoding="utf-8") as f:
        json.dump(all_matches, f, ensure_ascii=False, indent=2)

    print("TOTAL:", len(all_matches))

    browser.close()
