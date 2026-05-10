from playwright.sync_api import sync_playwright
import pandas as pd
import os
import time
import random
import re
from datetime import datetime, timedelta

URL = "https://www.mozzartbet.com/sr/kladjenje/sport/1?date=three_days"

OUTPUT_DIR = "output"
EXCEL_FILE = os.path.join(OUTPUT_DIR, "future_matches.xlsx")

MOBILE_UA = (
    "Mozilla/5.0 (Linux; Android 13; SM-A166B) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Mobile Safari/537.36"
)

WEEKDAY_MAP = {
    "pon": 0,
    "uto": 1,
    "sre": 2,
    "čet": 3,
    "pet": 4,
    "sub": 5,
    "ned": 6
}

def human_sleep(min_sec=2, max_sec=5):
    time.sleep(random.uniform(min_sec, max_sec))

def get_full_date_from_day(day_str):
    today = datetime.now()

    target_weekday = WEEKDAY_MAP.get(day_str.lower())

    if target_weekday is None:
        return ""

    days_ahead = (target_weekday - today.weekday() + 7) % 7

    match_date = today + timedelta(days=days_ahead)

    return match_date.strftime("%d.%m.%Y")

def get_full_date_from_ddmm(ddmm_str):
    try:
        day, month = map(int, ddmm_str.split("."))

        year = datetime.now().year

        return f"{day:02d}.{month:02d}.{year}"

    except:
        return ""

def scrape_future_matches():

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-blink-features=AutomationControlled"
            ]
        )

        context = browser.new_context(
            user_agent=MOBILE_UA,
            viewport={"width": 412, "height": 915},
            locale="sr-RS"
        )

        page = context.new_page()

        print("Otvaram Mozzart...")

        page.goto(URL, timeout=60000)

        human_sleep(5, 8)

        try:
            page.click("text=Sačuvaj i zatvori", timeout=5000)
            human_sleep(1, 2)
        except:
            pass

        print("Skrolujem i učitavam mečeve...")

        for _ in range(30):

            try:
                page.mouse.wheel(0, 3000)
            except:
                pass

            try:
                page.click("text=Učitaj još", timeout=2000)
            except:
                pass

            human_sleep(1, 3)

        text = page.inner_text("body")

        browser.close()

    lines = [line.strip() for line in text.splitlines() if line.strip()]

    football_leagues = []

    in_football_section = False

    for line in lines:

        if line.lower() == "fudbal":
            in_football_section = True
            continue

        if in_football_section:

            if line.lower() in [
                "kosarka",
                "tenis",
                "rukomet",
                "hokej",
                "odbojka",
                "stoni tenis",
                "američki fudbal",
                "futsal",
                "vaterpolo",
                "snuker",
                "ragbi",
                "pikado",
                "boks",
                "kriket"
            ]:
                break

            if not line.isdigit():
                football_leagues.append(line)

    matches = []

    current_league = ""

    i = 0

    while i < len(lines):

        line = lines[i]

        if line in football_leagues:
            current_league = line
            i += 1
            continue

        m_full = re.match(r"(\\d{2}\\.\\d{2})\\.\\s+\\S+\\s+(\\d{2}:\\d{2})", line)

        if m_full:

            ddmm = m_full.group(1)

            time_str = m_full.group(2)

            full_date = get_full_date_from_ddmm(ddmm)

            try:
                matches.append({
                    "datum": full_date,
                    "Time": time_str,
                    "Liga": current_league,
                    "Home": lines[i + 1],
                    "Away": lines[i + 2]
                })

                i += 3

            except:
                i += 1

            continue

        m_day = re.match(r"(\\S+)\\s+(\\d{2}:\\d{2})", line)

        if m_day:

            day_name = m_day.group(1)

            time_str = m_day.group(2)

            full_date = get_full_date_from_day(day_name)

            try:
                matches.append({
                    "datum": full_date,
                    "Time": time_str,
                    "Liga": current_league,
                    "Home": lines[i + 1],
                    "Away": lines[i + 2]
                })

                i += 3

            except:
                i += 1

            continue

        i += 1

    df = pd.DataFrame(matches)

    df.to_excel(EXCEL_FILE, index=False)

    print(f"Sačuvano {len(df)} fudbalskih mečeva u {EXCEL_FILE}")

if __name__ == "__main__":
    scrape_future_matches()
