const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4321/towan/', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'screenshot1.png' });
  
  // click a tile
  await page.evaluate(() => {
    document.querySelector('.tile').click();
  });
  
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'screenshot2.png' });
  
  await browser.close();
})();
