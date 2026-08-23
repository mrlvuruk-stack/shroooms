const puppeteer = require('puppeteer');
const BASE_URL = 'http://localhost:3000';
const ADIR   = 'C:\\\\Users\\\\MR LV\\\\.gemini\\\\antigravity\\\\brain\\\\fa59e67c-a770-4f89-9a6c-2b7c04dbbd91';
const CHROME = 'C:\\\\Users\\\\MR LV\\\\.cache\\\\puppeteer\\\\chrome\\\\win64-150.0.7871.24\\\\chrome-win64\\\\chrome.exe';

const VIEWPORTS = [
  { w:320,  h:900,  label:'320'  },
  { w:375,  h:812,  label:'375'  },
  { w:430,  h:932,  label:'430'  },
  { w:768,  h:1024, label:'768'  },
  { w:1280, h:900,  label:'1280' },
  { w:1920, h:1080, label:'1920' },
];
const PAGES = [
  { name:'blog_listing',              path:'/blog',                        waitMs:5000 },
  { name:'blog_article_mycelium',     path:'/blog/wood-wide-web-mycelium', waitMs:5000 },
  { name:'blog_404_securitytestpost', path:'/blog/security-test-post',     waitMs:3500 },
];

async function run() {
  console.log('Chrome: ' + CHROME);
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu','--no-first-run'],
    timeout: 60000,
  });
  console.log('Browser OK');
  const results = [];

  for (const vp of VIEWPORTS) {
    for (const pg of PAGES) {
      const page = await browser.newPage();
      await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 });
      const url = BASE_URL + pg.path;
      process.stdout.write('[' + vp.label + 'px] ' + pg.name + ' ... ');
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 25000 });
        try { await page.waitForSelector('.blog-container', { timeout: 8000 }); } catch(e) {}
        await new Promise(r => setTimeout(r, pg.waitMs));
        const m = await page.evaluate(() => {
          const dw = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
          const vw = window.innerWidth;
          const h1s = document.querySelectorAll('h1');
          const txt = document.body.innerText.toLowerCase();
          const is404 = txt.includes('article not found') || txt.includes("doesn't exist");
          const hasFooter = !!document.querySelector('footer');
          const nav = document.querySelector('nav,.navbar,header');
          const headerOK = nav ? nav.getBoundingClientRect().height > 0 : false;
          return { docWidth:dw, viewWidth:vw, overflow:Math.max(0,dw-vw),
                   h1Count:h1s.length, h1Text:h1s.length?h1s[0].textContent.trim().substring(0,80):'NONE',
                   is404, hasFooter, headerOK };
        });
        const fname = pg.name + '_' + vp.label + 'px.png';
        await page.screenshot({ path: ADIR + '\\\\' + fname, fullPage: true });
        results.push({ vp:vp.label, page:pg.name, file:fname, ...m });
        console.log('PASS overflow='+m.overflow+' h1='+m.h1Count+' 404='+m.is404+' footer='+m.hasFooter+' hdr='+m.headerOK);
      } catch(e) {
        console.log('ERR: ' + e.message.split('\n')[0]);
        results.push({ vp:vp.label, page:pg.name, error:e.message.split('\n')[0] });
      }
      await page.close();
    }
  }
  await browser.close();
  console.log('\n=== JSON RESULTS ===');
  console.log(JSON.stringify(results, null, 2));
  console.log('=== END ===');
}
run().catch(e => { console.error('FATAL:',e.message); process.exit(1); });
