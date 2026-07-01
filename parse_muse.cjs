const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  // We can load from local file to avoid network issues or timeouts!
  await page.goto('file:///Users/ijioxc/.gemini/antigravity-ide/brain/f5d53d23-792f-45e7-be52-4e697684405b/.system_generated/steps/593/content.md', { waitUntil: 'domcontentloaded' });
  
  const extracted = await page.evaluate(() => {
    // Only query inside the desktop breakpoint
    const bp = document.querySelector('#bp_infinity');
    if (!bp) return { error: "No desktop breakpoint" };

    const images = Array.from(bp.querySelectorAll('a.clip_frame')).map(a => {
       const img = a.querySelector('img');
       if (!img) return null;
       const rect = a.getBoundingClientRect();
       const src = img.getAttribute('data-orig-src') || img.getAttribute('src') || '';
       return {
           type: 'image',
           href: a.getAttribute('href'),
           src: src.split('?')[0], // remove crc query param
           x: rect.x + window.scrollX,
           y: rect.y + window.scrollY,
           width: rect.width,
           height: rect.height
       };
    }).filter(Boolean);

    const texts = Array.from(bp.querySelectorAll('.txt_frame')).map(div => {
       const ps = Array.from(div.querySelectorAll('p')).map(p => p.innerText.trim()).filter(t => t);
       if (ps.length === 0) return null;
       // filter out common UI text
       if (['VIEW', 'TOWAN WORKS', 'ABOUT', 'CONTACT'].includes(ps[0])) return null;
       
       const rect = div.getBoundingClientRect();
       return {
           type: 'text',
           category: ps.length >= 2 ? ps[0] : '',
           title: ps.length >= 2 ? ps[1] : ps[0],
           x: rect.x + window.scrollX,
           y: rect.y + window.scrollY,
           width: rect.width,
           height: rect.height
       };
    }).filter(Boolean);

    return { images, texts };
  });

  if (extracted.error) {
     console.log(extracted.error);
     process.exit(1);
  }

  // Spatial matching:
  // For each image, find the text frame that is spatially closest to it (usually just below or overlapping)
  const projects = [];
  
  extracted.images.forEach(img => {
      // Find the closest text frame vertically
      let closestText = null;
      let minDistance = Infinity;
      
      extracted.texts.forEach(txt => {
          // Calculate center points
          const imgCX = img.x + img.width / 2;
          const txtCX = txt.x + txt.width / 2;
          
          const imgBottom = img.y + img.height;
          const txtTop = txt.y;
          
          // Check if horizontally aligned (centers within 100px)
          if (Math.abs(imgCX - txtCX) < 150) {
              // The text is usually placed below the image, so txtTop should be >= img.y
              // We'll calculate the vertical distance from image bottom to text top
              let dy = Math.abs(txtTop - imgBottom);
              // Or if it overlaps, just center to center
              let centerDist = Math.sqrt(Math.pow(imgCX - txtCX, 2) + Math.pow((img.y+img.height/2) - (txt.y+txt.height/2), 2));
              
              if (centerDist < minDistance) {
                  minDistance = centerDist;
                  closestText = txt;
              }
          }
      });
      
      if (closestText) {
          projects.push({
              title: closestText.title,
              category: closestText.category,
              link: img.href,
              image: 'https://towan.com.tw/' + img.src
          });
      }
  });

  // Remove duplicates based on title
  const unique = [];
  const seen = new Set();
  // Sort by vertical position to maintain order! (Wait, we lost original Y. Let's add it back)
  
  extracted.images.forEach(img => {
      // Re-run matching, store with Y
  });

  const finalProjects = projects.filter(p => {
      if (seen.has(p.title)) return false;
      seen.add(p.title);
      return true;
  });

  console.log(`Extracted ${finalProjects.length} unique projects.`);
  fs.writeFileSync('extracted_projects.json', JSON.stringify(finalProjects, null, 2));
  
  await browser.close();
})();
