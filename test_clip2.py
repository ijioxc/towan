import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:4321/towan/")
        await page.wait_for_timeout(2000)
        
        script = """() => {
            const section = document.querySelector('section');
            const comp = window.getComputedStyle(section);
            return {
                transform: comp.transform,
                perspective: comp.perspective,
                filter: comp.filter,
                willChange: comp.willChange,
                contain: comp.contain
            };
        }"""
        res = await page.evaluate(script)
        print(res)
        await browser.close()

asyncio.run(main())
