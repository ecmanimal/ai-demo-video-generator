/**
 * Get exact pixel coordinates of any element on the target website.
 * ALWAYS use this before configuring zoom overlays — never guess positions.
 *
 * Usage:
 *   node get-coordinates.js "a" "Our Story"
 *   node get-coordinates.js ".cta-button"
 *   node get-coordinates.js "#signup-form"
 */
const { chromium } = require('playwright');
const config = require('./video.config');

const selector = process.argv[2] || 'a';
const text = process.argv[3] || null;

(async () => {
  if (!config.url) {
    console.error('ERROR: Set url in video.config.js first.');
    process.exit(1);
  }

  const VIEWPORT = config.viewport || { width: 1920, height: 1080 };
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);

  console.log(`Loading ${config.url}...`);
  await page.goto(config.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  const result = await page.evaluate(({ selector, text, vw, vh }) => {
    const els = Array.from(document.querySelectorAll(selector));
    const el = text ? els.find(e => e.textContent.trim() === text) : els[0];
    if (!el) return { error: `Element not found: ${selector}${text ? ' with text "' + text + '"' : ''}` };
    const rect = el.getBoundingClientRect();
    return {
      element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
      text: el.textContent.trim().slice(0, 50),
      pixel_x: Math.round(rect.x + rect.width / 2),
      pixel_y: Math.round(rect.y + rect.height / 2),
      pct_x: +((rect.x + rect.width / 2) / vw * 100).toFixed(2),
      pct_y: +((rect.y + rect.height / 2) / vh * 100).toFixed(2),
      bounds: {
        left: Math.round(rect.left),
        top: Math.round(rect.top),
        right: Math.round(rect.right),
        bottom: Math.round(rect.bottom),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
    };
  }, { selector, text, vw: VIEWPORT.width, vh: VIEWPORT.height });

  if (result.error) {
    console.error(result.error);
  } else {
    console.log('\n=== Element Coordinates ===');
    console.log(`Element:  ${result.element}`);
    console.log(`Text:     "${result.text}"`);
    console.log(`Center:   pixel (${result.pixel_x}, ${result.pixel_y})`);
    console.log(`Percent:  (${result.pct_x}%, ${result.pct_y}%)`);
    console.log(`Bounds:   ${result.bounds.width}x${result.bounds.height} at (${result.bounds.left}, ${result.bounds.top})`);
    console.log('\n=== For video.config.js zoom overlay ===');

    // Calculate translate values for 2.5x zoom centering this element
    const S = 2.5;
    const tx = ((VIEWPORT.width / 2) - result.pixel_x * S) / VIEWPORT.width * 100;
    const ty = ((VIEWPORT.height / 2) - result.pixel_y * S) / VIEWPORT.height * 100;
    console.log(`{ type: 'zoom', targetX: ${result.pixel_x}, targetY: ${result.pixel_y}, scale: ${S},`);
    console.log(`  translateX: ${tx.toFixed(2)}, translateY: ${ty.toFixed(2)},`);
    console.log(`  fromFrame: ???, holdFrames: 40, totalFrames: 160 }`);
  }

  await browser.close();
})();
