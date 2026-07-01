import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:4321/towan/")
        await page.wait_for_timeout(2000)
        
        script = """() => {
            const rules = window.getMatchedCSSRules ? window.getMatchedCSSRules(document.querySelector('#header')) : 'not supported';
            const bodySizing = window.getComputedStyle(document.body).boxSizing;
            return {
                bodySizing: bodySizing,
                rules: rules
            };
        }"""
        res = await page.evaluate(script)
        print(res)
        await browser.close()

asyncio.run(main())
