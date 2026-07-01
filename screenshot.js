const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://towan.com.tw/towanworks.html', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: '/Users/ijioxc/.gemini/antigravity-ide/brain/f5d53d23-792f-45e7-be52-4e697684405b/towanworks_screenshot.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved to towanworks_screenshot.png');
})();
