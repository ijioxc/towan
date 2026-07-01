import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:4321/towan/")
        await page.wait_for_timeout(2000)
        
        script = """() => {
            const header = document.querySelector('#header');
            const op = header.offsetParent;
            const docWidth = document.documentElement.clientWidth;
            return {
                headerWidth: header.getBoundingClientRect().width,
                offsetParentTag: op ? op.tagName : null,
                offsetParentClass: op ? op.className : null,
                docWidth: docWidth
            };
        }"""
        res = await page.evaluate(script)
        print(res)
        await browser.close()

asyncio.run(main())
