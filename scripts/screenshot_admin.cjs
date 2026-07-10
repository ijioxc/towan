const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:8931/secret-admin/', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: '/Users/ijioxc/.gemini/antigravity-ide/brain/f5d53d23-792f-45e7-be52-4e697684405b/scratch/screenshot_admin.png' });
  await browser.close();
})();
