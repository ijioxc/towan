const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://towan.com.tw/mestere-facial-cleanser.html', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: '/Users/ijioxc/.gemini/antigravity-ide/brain/f5d53d23-792f-45e7-be52-4e697684405b/scratch/towan-reference.png' });
  await browser.close();
})();
