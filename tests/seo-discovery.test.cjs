const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");

test("search engines receive a crawlable sitemap and robots policy for the production domain", () => {
  const sitemap = fs.readFileSync(path.join(root, "app", "sitemap.ts"), "utf8");
  const robots = fs.readFileSync(path.join(root, "app", "robots.ts"), "utf8");

  assert.match(sitemap, /https:\/\/paginajb\.vercel\.app/);
  assert.match(sitemap, /changeFrequency:\s*["']daily["']/);
  assert.match(robots, /userAgent:\s*["']\*["']/);
  assert.match(robots, /allow:\s*["']\/["']/);
  assert.match(robots, /sitemap:\s*["']https:\/\/paginajb\.vercel\.app\/sitemap\.xml["']/);
});

test("storefront metadata describes JBCELL's local shopping and delivery coverage", () => {
  const layout = fs.readFileSync(path.join(root, "app", "layout.tsx"), "utf8");
  const page = fs.readFileSync(path.join(root, "app", "page.tsx"), "utf8");

  assert.match(layout, /Tienda de celulares y accesorios en Santo Domingo/);
  assert.match(layout, /República Dominicana/);
  assert.match(page, /Envíos a toda República Dominicana/);
  assert.match(page, /Entrega en Santo Domingo/);
});

test("homepage publishes store structured data with Santo Domingo and nationwide coverage", () => {
  const page = fs.readFileSync(path.join(root, "app", "page.tsx"), "utf8");

  assert.match(page, /application\/ld\+json/);
  assert.match(page, /LocalBusiness/);
  assert.match(page, /Santo Domingo/);
  assert.match(page, /República Dominicana/);
  assert.match(page, /whatsappLink/);
});
