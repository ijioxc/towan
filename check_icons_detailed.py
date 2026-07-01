import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:4321/towan/")
        await page.wait_for_timeout(2000)
        
        fb_details = await page.evaluate("""() => {
            const el = document.querySelector('img[alt="FB"]');
            if (!el) return 'No element';
            const rect = el.getBoundingClientRect();
            const comp = window.getComputedStyle(el);
            const parentComp = window.getComputedStyle(el.parentElement);
            return JSON.stringify({
                offsetParent: !!el.offsetParent,
                opacity: comp.opacity,
                parentOpacity: parentComp.opacity,
                display: comp.display,
                visibility: comp.visibility,
                width: rect.width,
                height: rect.height,
                parentDisplay: parentComp.display
            });
        }""")
        print(f"FB details: {fb_details}")
        
        await browser.close()

asyncio.run(main())
