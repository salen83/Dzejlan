from playwright.sync_api import sync_playwright
from openpyxl import Workbook
import json
import time

all_matches = []
seen_ids = set()

with sync_playwright() as p:

    browser = p.chromium.launch(
        headless=True,
        args=["--no-sandbox"]
    )

    context = browser.new_context()

    page = context.new_page()

    def capture_response(resp):

        if "/betting/matches" not in resp.url:
            return

        try:
            data = resp.json()

            matches = data.get("matches", [])

            print("CAPTURED:", len(matches))

            for match in matches:

                match_id = match.get("id")

                if match_id not in seen_ids:
                    seen_ids.add(match_id)
                    all_matches.append(match)

        except Exception as e:
            print("ERROR:", e)

    page.on("response", capture_response)

    page.goto(
        "https://www.mozzartbet.com/sr/kladjenje/sport/1?date=all_days",
        wait_until="load"
    )

    page.wait_for_timeout(5000)

    # skrol da frontend učita dodatne stranice
    for i in range(30):

        print("SCROLL", i)

        page.mouse.wheel(0, 5000)

        page.wait_for_timeout(2000)

    with open("matches.json", "w", encoding="utf-8") as f:
        json.dump(all_matches, f, ensure_ascii=False, indent=2)

    wb = Workbook()
    ws = wb.active
    ws.title = "Matches"

    ws.append([
        "ID",
        "Home",
        "Away",
        "League",
        "Sport",
        "Start Time"
    ])

    for match in all_matches:

        ws.append([
            match.get("id", ""),
            match.get("home", ""),
            match.get("away", ""),
            match.get("competitionName", ""),
            match.get("sportName", ""),
            match.get("startTime", "")
        ])

    wb.save("matches.xlsx")

    print("TOTAL:", len(all_matches))

    browser.close()
