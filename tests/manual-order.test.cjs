const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const storefront = fs.readFileSync(path.join(root, "app", "page.tsx"), "utf8");
const admin = fs.readFileSync(path.join(root, "components", "AdminProductList.tsx"), "utf8");
const types = fs.readFileSync(path.join(root, "lib", "types.ts"), "utf8");
const schema = fs.readFileSync(path.join(root, "supabase", "schema.sql"), "utf8");

test("the catalog reads products using the saved manual order", () => {
  assert.match(storefront, /\.order\("orden",\s*\{ascending:\s*true\}\)/);
});

test("the administrator can move products up and down", () => {
  assert.match(admin, /move\(.*-1/);
  assert.match(admin, /move\(.*1/);
});

test("products persist a manual order in the database", () => {
  assert.match(types, /orden:number/);
  assert.match(schema, /orden integer/);
  assert.ok(fs.existsSync(path.join(root, "supabase", "orden_productos.sql")));
});

