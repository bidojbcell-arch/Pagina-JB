const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");

const serviceWorker = fs.readFileSync(path.join(__dirname, "..", "public", "sw.js"), "utf8");

test("the service worker fetches page requests from the network before its cache", () => {
  assert.match(serviceWorker, /const CACHE_NAME = "jb-catalogo-v2"/);
  assert.match(serviceWorker, /fetch\(request\)[\s\S]*\.catch\(\(\) => caches\.match\(request\)\)/);
  assert.doesNotMatch(serviceWorker, /return cached \|\| fetchPromise/);
});
