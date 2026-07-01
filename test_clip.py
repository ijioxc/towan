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
            const section = document.querySelector('section');
            const icons = document.querySelector('img[alt="social"]').parentElement.parentElement;
            
            return {
                headerRect: header.getBoundingClientRect(),
                sectionRect: section.getBoundingClientRect(),
                iconsRect: icons.getBoundingClientRect(),
                headerParent: header.parentElement.tagName,
                sectionOverflow: window.getComputedStyle(section).overflow,
                isClipped: window.getComputedStyle(header).position === 'fixed'
            };
        }"""
        res = await page.evaluate(script)
        print(res)
        await browser.close()

asyncio.run(main())
