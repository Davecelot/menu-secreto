const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs/promises');
const http = require('node:http');
const { chromium } = require('playwright');

test('catalog data remains inert and cart operations work in Chromium', async () => {
  const root = path.resolve(__dirname, '..');
  const server = http.createServer(async (request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    const file = path.resolve(root, `.${pathname}`);
    if (!file.startsWith(root + path.sep)) {
      response.writeHead(404).end();
      return;
    }
    try {
      const type = file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream';
      const body = await fs.readFile(file);
      response.writeHead(200, { 'Content-Type': type });
      response.end(body);
    } catch (_) {
      response.writeHead(404).end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}/`;
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_BIN || undefined,
      headless: true,
    });
    const page = await browser.newPage();
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await page.goto(base + 'tests/product-security.html');
    await page.waitForFunction(() => document.documentElement.dataset.testResult);
    const result = await page.locator('html').getAttribute('data-test-result');
    const error = await page.locator('html').getAttribute('data-test-error');
    assert.equal(result, 'pass', error);
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
});
