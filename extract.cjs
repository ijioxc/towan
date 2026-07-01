const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://towan.com.tw/towanworks.html', { waitUntil: 'domcontentloaded' });
  
  // Wait a bit for initial JS to run
  await new Promise(r => setTimeout(r, 2000));
  
  // Scroll down to trigger lazy loading and make elements visible
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      let distance = 500;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if(totalHeight >= scrollHeight - window.innerHeight || totalHeight > 10000){
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
  
  // Wait for images to load
  await new Promise(r => setTimeout(r, 1000));
  
  // Get visually displayed elements
  const projects = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a.clip_frame'));
    return links.map(link => {
      const rect = link.getBoundingClientRect();
      const parent = link.closest('.clearfix.colelem') || link.parentElement;
      const textEls = parent.querySelectorAll('p');
      const texts = Array.from(textEls).map(p => p.innerText.trim()).filter(t => t);
      
      const compStyle = window.getComputedStyle(parent);
      // in Muse, elements are often hidden via negative top or left (e.g. top: -2300px)
      // or opacity 0.
      return {
        href: link.getAttribute('href'),
        visible: rect.width > 0 && rect.height > 0 && parseFloat(compStyle.top) > -1000 && parseFloat(compStyle.left) > -1000 && compStyle.display !== 'none' && compStyle.visibility !== 'hidden',
        texts: texts
      };
    }).filter(p => p.visible);
  });
  
  // Deduplicate by text
  const uniqueProjects = [];
  const seen = new Set();
  for (let p of projects) {
    const key = p.texts.join('|');
    if (!seen.has(key) && key !== '') {
      seen.add(key);
      uniqueProjects.push(p);
    }
  }
  
  console.log(`Visually visible projects count: ${uniqueProjects.length}`);
  uniqueProjects.forEach(p => console.log(p.texts.join(' | ')));
  
  await browser.close();
})();
