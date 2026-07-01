import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:4321")
        await page.wait_for_timeout(2000)
        
        fb_visible = await page.evaluate("() => { const el = document.querySelector('img[alt=\"FB\"]'); return el ? (el.offsetParent !== null && window.getComputedStyle(el).opacity !== '0' && window.getComputedStyle(el.parentElement).opacity !== '0' && el.getBoundingClientRect().width > 0) : false; }")
        mail_visible = await page.evaluate("() => { const el = document.querySelector('img[alt=\"Email\"]'); return el ? (el.offsetParent !== null && window.getComputedStyle(el).opacity !== '0' && window.getComputedStyle(el.parentElement).opacity !== '0' && el.getBoundingClientRect().width > 0) : false; }")
        
        print(f"FB icon visible: {fb_visible}")
        print(f"Mail icon visible: {mail_visible}")
        
        fb_rect = await page.evaluate("() => { const el = document.querySelector('img[alt=\"FB\"]'); return el ? JSON.stringify(el.getBoundingClientRect()) : null; }")
        print(f"FB rect: {fb_rect}")
        
        nav_rect = await page.evaluate("() => { const el = document.querySelector('nav'); return el ? JSON.stringify(el.getBoundingClientRect()) : null; }")
        print(f"Nav rect: {nav_rect}")
        
        await page.screenshot(path="local_screenshot.png")
        await browser.close()

asyncio.run(main())
