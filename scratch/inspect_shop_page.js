const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log('Navigating to http://localhost:3001/shop ...');
  await page.goto('http://localhost:3001/shop', { waitUntil: 'networkidle2' });

  await page.setViewport({ width: 1440, height: 900 });
  await page.screenshot({ path: 'scratch/shop_page_debug.png', fullPage: true });

  const cardCount = await page.evaluate(() => {
    return document.querySelectorAll('.product-luxury-card').length;
  });
  console.log(`Found ${cardCount} .product-luxury-card elements in DOM`);

  const containerHTML = await page.evaluate(() => {
    const el = document.querySelector('.products-grid-wrapper');
    return el ? el.outerHTML.slice(0, 500) : 'NOT FOUND';
  });
  console.log('products-grid-wrapper HTML:', containerHTML);

  await browser.close();
})();
