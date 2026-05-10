from playwright.sync_api import sync_playwright
import pandas as pd
import time

MOBILE_UA = (
    "Mozilla/5.0 (Linux; Android 13; SM-A166B) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Mobile Safari/537.36"
)

def scrape():
    url = "https://www.mozzartbet.com/sr/kladjenje/Fudbal/1"

    matches = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)

        context = browser.new_context(
            user_agent=MOBILE_UA,
            viewport={"width": 412, "height": 915},
            locale="sr-RS"
        )

        page = context.new_page()

        def handle_response(response):
            nonlocal matches
            try:
                ct = response.headers.get("content-type", "")

                if "json" in ct:
                    data = response.json()

                    if isinstance(data, dict):
                        if "events" in data:
                            matches.extend(data["events"])
                        elif "data" in data and isinstance(data["data"], list):
                            matches.extend(data["data"])

            except:
                pass

        page.on("response", handle_response)

        print("Otvaram stranicu...")
        page.goto(url, timeout=60000)

        page.wait_for_timeout(8000)

        for _ in range(15):
            page.mouse.wheel(0, 2000)
            page.wait_for_timeout(1200)

        page.wait_for_timeout(5000)

        browser.close()

    return matches


def transform(matches):
    rows = []

    for m in matches:
        try:
            home = m.get("homeTeam", {}).get("name", "")
            away = m.get("awayTeam", {}).get("name", "")
            league = m.get("competition", {}).get("name", "")
            time_m = m.get("startTime", "")

            odds = []

            for mk in m.get("markets", []):
                for o in mk.get("outcomes", []):
                    if "odds" in o:
                        odds.append(str(o["odds"]))

            rows.append({
                "Liga": league,
                "Home": home,
                "Away": away,
                "Vreme": time_m,
                "Kvote": " | ".join(odds)
            })

        except:
            pass

    return rows


def main():
    print("Skidam Mozzart buduće mečeve...")

    matches = scrape()

    print("RAW:", len(matches))

    if not matches:
        print("Nema podataka (blokada ili promena stranice)")
        return

    rows = transform(matches)

    df = pd.DataFrame(rows)
    df.to_excel("mozzart_future.xlsx", index=False)

    print("GOTOVO -> mozzart_future.xlsx")


if __name__ == "__main__":
    main()
