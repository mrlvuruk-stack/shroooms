const puppeteer = require('puppeteer');
const CHROME = 'C:\\\\Users\\\\MR LV\\\\.cache\\\\puppeteer\\\\chrome\\\\win64-150.0.7871.24\\\\chrome-win64\\\\chrome.exe';
async function run() {
  const browser = await puppeteer.launch({ headless:'new', executablePath:CHROME, args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu'], timeout:60000 });
  const page = await browser.newPage();
  await page.setViewport({ width:1280, height:900, deviceScaleFactor:1 });
  await page.goto('http://localhost:3000/', { waitUntil:'domcontentloaded', timeout:20000 });
  await new Promise(r => setTimeout(r, 3000));
  const m = await page.evaluate(() => {
    const dw = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    return { docWidth: dw, viewWidth: window.innerWidth, overflow: Math.max(0, dw - window.innerWidth) };
  });
  console.log('HOME 1280px overflow:', JSON.stringify(m));
  await page.setViewport({ width:1920, height:1080, deviceScaleFactor:1 });
  await page.goto('http://localhost:3000/', { waitUntil:'domcontentloaded', timeout:20000 });
  await new Promise(r => setTimeout(r, 3000));
  const m2 = await page.evaluate(() => {
    const dw = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    return { docWidth: dw, viewWidth: window.innerWidth, overflow: Math.max(0, dw - window.innerWidth) };
  });
  console.log('HOME 1920px overflow:', JSON.stringify(m2));
  await browser.close();
}
run().catch(e => console.error('ERR:', e.message));
