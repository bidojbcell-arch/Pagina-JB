const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const layout = fs.readFileSync(path.join(__dirname, "..", "app", "layout.tsx"), "utf8");
const pixel = fs.readFileSync(path.join(__dirname, "..", "components", "MetaPixel.tsx"), "utf8");

test("the storefront initializes Meta's approved Pixel on every route", () => {
  assert.match(layout, /<MetaPixel\s*\/>/);
  assert.match(pixel, /1604952077954720/);
  assert.doesNotMatch(pixel, /1577667884074919/);
});

