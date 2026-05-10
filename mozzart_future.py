from playwright.sync_api import sync_playwright
import pandas as pd
import time

MOBILE_UA = (
    "Mozilla/5.0 (Linux; Android 13; SM-A166B) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Mobile Safari/537.36"
)

def scrape_future_matches():
    url = "https://www.mozzartbet.com/sr/kladjenje/Fudbal/1"

    data = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        context = browser.new_context(
            user_agent=MOBILE_UA,
            viewport={"width": 412, "height": 915},
            locale="sr-RS"
        )

        page = context.new_page()

        def handle_response(response):
            nonlocal data
            try:
                if "betting/matches" in response.url:
                    json_data = response.json()
                    events = json_data.get("events", [])
                    if events:
                        data.extend(events)
            except:
                pass

        page.on("response", handle_response)

        page.goto(url, timeout=60000)
        time.sleep(5)

        # scroll da učita sve
        for _ in range(20):
            page.mouse.wheel(0, 2000)
            time.sleep(1)

        browser.close()

    return data


def transform(matches):
    rows = []

    for m in matches:
        markets = m.get("markets", [])

        odds_1x2 = []

        for mk in markets:
            for o in mk.get("outcomes", []):
                odds_1x2.append(o.get("odds"))

        rows.append({
            "Liga": m.get("competition", {}).get("name", ""),
            "Home": m.get("homeTeam", {}).get("name", ""),
            "Away": m.get("awayTeam", {}).get("name", ""),
            "Vreme": m.get("startTime", ""),
            "Kvote": " | ".join([str(x) for x in odds_1x2 if x])
        })

    return rows


def main():
    print("Skidam buduće mečeve...")

    matches = scrape_future_matches()

    print("RAW:", len(matches))

    rows = transform(matches)

    df = pd.DataFrame(rows)
    df.to_excel("mozzart_future.xlsx", index=False)

    print("GOTOVO -> mozzart_future.xlsx")


if __name__ == "__main__":
    main()
