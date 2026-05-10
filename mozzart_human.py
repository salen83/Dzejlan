from playwright.sync_api import sync_playwright

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

    print(text[:5000])

    with open("debug.txt", "w", encoding="utf-8") as f:
        f.write(text)

    browser.close()
