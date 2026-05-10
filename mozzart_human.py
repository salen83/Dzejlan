from playwright.sync_api import sync_playwright
import json
import random
import time

with sync_playwright() as p:

    browser = p.chromium.launch(
        headless=False,
        args=[
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox"
        ]
    )

    context = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
        viewport={"width": 1366, "height": 768},
        locale="sr-RS",
        timezone_id="Europe/Belgrade"
    )

    page = context.new_page()

    page.add_init_script("""
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined
        });

        Object.defineProperty(navigator, 'languages', {
            get: () => ['sr-RS', 'sr']
        });

        Object.defineProperty(navigator, 'plugins', {
            get: () => [1,2,3,4]
        });
    """)

    page.goto(
        "https://www.mozzartbet.com/sr/kladjenje/sport/1?date=all_days",
        wait_until="domcontentloaded"
    )

    time.sleep(random.uniform(5, 8))

    response = page.request.post(
        "https://www.mozzartbet.com/betting/matches",
        data={
            "date":"all_days",
            "sort":"bycompetition",
            "currentPage":0,
            "pageSize":15,
            "sportId":1,
            "competitionIds":[],
            "search":"",
            "matchTypeId":0
        }
    )

    text = response.text()

    print(text[:2000])

    with open("debug.txt", "w", encoding="utf-8") as f:
        f.write(text)

    browser.close()
