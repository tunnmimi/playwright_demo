const { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, firefox, webkit, request } = require('@playwright/test');
const { ensureDir } = require('fs-extra');
const config = require('./config');
const tracesDir = 'traces';

let browser;

setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 1000);

BeforeAll(async function () {
  switch (config.browser) {
    case 'firefox':
      browser = await firefox.launch(config.browserOptions);
      break;
    case 'webkit':
      browser = await webkit.launch(config.browserOptions);
      break;
    default:
      browser = await chromium.launch(config.browserOptions);
  }
  await ensureDir(tracesDir);
});

Before({ tags: '@ignore' }, async function () {
  return 'skipped';
});

Before({ tags: '@debug' }, async function () {
  this.debug = true;
});

Before(async function ({ pickle }) {
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');

  this.context = await browser.newContext({
    acceptDownloads: true,
    recordVideo: process.env.PWVIDEO ? { dir: 'screenshots' } : undefined,
    viewport: { width: 1200, height: 800 },
  });

  this.server = await request.newContext({
    baseURL: config.BASE_API_URL,
  });

  await this.context.tracing.start({ screenshots: true, snapshots: true });

  this.page = await this.context.newPage();
  this.page.on('console', async (msg) => {
    if (msg.type() === 'log') {
      await this.attach(msg.text());
    }
  });

  this.feature = pickle;
});

After(async function ({ result }) {
  if (result) {
    await this.attach(`Status: ${result.status}. Duration: ${result.duration?.seconds}s`);

    if (result.status !== Status.PASSED) {
      const image = await this.page?.screenshot();
      const timePart = this.startTime?.toISOString().split('.')[0].replace(/:/g, '_');

      if (image) {
        await this.attach(image, 'image/png');
      }

      await this.context?.tracing.stop({
        path: `${tracesDir}/${this.testName}-${timePart}trace.zip`,
      });
    }
  }

  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  await browser.close();
});
