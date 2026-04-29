import { chromium } from "playwright";

const baseUrl = process.argv[2] || "http://127.0.0.1:5173";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];

page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});

await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.waitForSelector(".workspace");

const initial = await page.locator(".editor-body").innerText();
const checks = {};

await page.click('[data-tool="research"]');
await page.click("#generateBtn");
await page.waitForSelector(".artifact-card");
checks.researchCards = await page.locator(".artifact-card").count();

await page.click('[data-tool="audio"]');
await page.click("#generateBtn");
await page.waitForSelector(".editor-textarea");
checks.audioEditors = await page.locator(".editor-textarea").count();

await page.click('[data-tool="slides"]');
await page.click("#generateBtn");
await page.waitForSelector(".slide-card");
checks.slideCards = await page.locator(".slide-card").count();

await page.click('[data-tool="video"]');
await page.click("#generateBtn");
await page.waitForSelector(".timeline");
checks.videoTimelines = await page.locator(".timeline").count();

await page.click('[data-tool="website"]');
await page.click("#generateBtn");
await page.waitForSelector("#websitePreview");
checks.websitePreview = await page.locator("#websitePreview").count();

await page.click('[data-tool="app"]');
await page.click("#generateBtn");
await page.waitForSelector(".app-editor");
checks.appEditors = await page.locator(".app-editor").count();

await page.click('[data-tool="export"]');
await page.click("#generateBtn");
await page.waitForSelector(".artifact-card");
checks.exportCards = await page.locator(".artifact-card").count();

await page.click('[data-tool="design"]');
await page.waitForSelector("#designCanvas");
checks.designCanvas = await page.locator("#designCanvas").count();
await page.click("#addTextBtn");
await page.waitForTimeout(300);
checks.layerButtons = await page.locator(".layer-list button").count();
checks.canvasObjectCount = await page.evaluate(() => window.__dragonselDebug?.canvasObjectCount?.() ?? null);

const result = {
  title: await page.title(),
  hasWorkspace: await page.locator(".workspace").count(),
  initialMentionsReady: initial.includes("Ready"),
  checks,
  errors
};

console.log(JSON.stringify(result, null, 2));
await browser.close();

if (errors.length) {
  process.exitCode = 1;
}
