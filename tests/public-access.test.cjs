const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const storefront = fs.readFileSync(path.join(__dirname, "..", "app", "page.tsx"), "utf8");

test("the public storefront does not expose an administrator login link", () => {
  assert.doesNotMatch(storefront, /href="\/admin\/login"/);
});

