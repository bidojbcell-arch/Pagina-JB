const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const layout = fs.readFileSync(path.join(__dirname, "..", "app", "layout.tsx"), "utf8");

test("the storefront initializes the approved Meta Pixel on every route", () => {
  assert.match(layout, /<MetaPixel\s*\/>/);
});

