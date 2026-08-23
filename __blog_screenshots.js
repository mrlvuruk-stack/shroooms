const puppeteer = require('puppeteer');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const ARTIFACT_DIR = 'C:\\\\Users\\\\MR LV\\\\.gemini\\\\antigravity\\\\brain\\\\fa59e67c-a770-4f89-9a6c-2b7c04dbbd91';

const VIEWPORTS = [
  { width: 320, height: 900, label: '320' },
  { width: 375, height: 812, label: '375' },
  { width: 430, height: 932, label: '430' },
  { width: 768, height: 1024, label: '768' },
  { width: 1280, height: 900, label: '1280' },
  { width: 1920, height: 1080, label: '1920' },
];

const PAGES = [
  { name: 'blog_listing', path: '/blog', waitFor: '.blog-card, .chronicles-header, .blog-grid', waitMs: 4000 },
  { name: 'blog_article', path: '/blog/wood-wide-web-mycelium', waitFor: '.blog-article-container, .blog-article-not-found, h1', waitMs: 4000 },
  { name: 'blog_security_test_post', path: '/blog/security-test-post', waitFor: '.blog-article-not-found, .blog-article-container, h1', waitMs: 3000 },
];

async function run() {
  console.log('Starting Puppeteer v' + require('puppeteer/package.json').version);
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  const results = [];

  for (const vp of VIEWPORTS) {
    for (const pg of PAGES) {
      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      const url = BASE_URL + pg.path;
      console.log('>> ' + vp.label + 'px | ' + pg.name + ' | ' + url);
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        try { await page.waitForSelector(pg.waitFor, { timeout: 6000 }); } catch(e) {}
        await new Promise(r => setTimeout(r, pg.waitMs));
        const ov = await page.evaluate(() => {
          const dw = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
          const vw = window.innerWidth;
          return { overflow: dw > vw ? (dw - vw) : 0, docWidth: dw, viewWidth: vw };
        });
        const h1s = await page.evaluate(() => document.querySelectorAll('h1').length);
        const notFound = await page.evaluate(() => !!document.querySelector('.blog-article-not-found'));
        const fname = pg.name + '_' + vp.label + 'px.png';
        const fpath = ARTIFACT_DIR + '\\\\' + fname;
        await page.screenshot({ path: fpath, fullPage: true });
        const res = { vp: vp.label, page: pg.name, file: fname, overflow: ov.overflow, h1: h1s, notFound };
        results.push(res);
        console.log('   OK overflow=' + ov.overflow + 'px | h1=' + h1s + ' | 404state=' + notFound);
      } catch(e) {
        console.log('   ERR: ' + e.message);
        results.push({ vp: vp.label, page: pg.name, error: e.message });
      }
      await page.close();
    }
  }

  await browser.close();
  console.log('\n=== RESULTS ===');
  console.log(JSON.stringify(results, null, 2));
}

run().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
