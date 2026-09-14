const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const logo = fs.readFileSync(path.join(__dirname, "..", "public", "jbcell-logo.svg"), "utf8");

test("the JBCELL logo uses the energetic connection mark", () => {
  assert.match(logo, /id="connection-signal"/);
  assert.match(logo, /fill="#e34343"/);
  assert.match(logo, /fill="#252b62"/);
});

test("the JBCELL logo has a transparent background for every page surface", () => {
  assert.doesNotMatch(logo, /<rect width="420" height="125" fill="white"\/>/);
});
