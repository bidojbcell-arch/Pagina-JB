const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  module._compile(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText, filename);
};

const { canOrderViaWhatsApp } = require("../lib/cart.ts");
const product = { id: "watch", nombre: "Reloj", precio: 1000, precio_oferta: null, tipo: "normal", disponible: true, stock: 1 };
const productForm = fs.readFileSync(path.join(__dirname, "..", "components", "ProductForm.tsx"), "utf8");
const homePage = fs.readFileSync(path.join(__dirname, "..", "app", "page.tsx"), "utf8");

test("only visible products with stock can be ordered through WhatsApp", () => {
  assert.equal(canOrderViaWhatsApp(product), true);
  assert.equal(canOrderViaWhatsApp({ ...product, stock: 0 }), false);
  assert.equal(canOrderViaWhatsApp({ ...product, disponible: false }), false);
});

test("admin exposes editable normal and offer prices", () => {
  assert.match(productForm, /Precio normal \(RD\$\)/);
  assert.match(productForm, /Precio de oferta \(RD\$\)/);
  assert.match(productForm, /precio_oferta:/);
  assert.match(productForm, /\s+tipo,/);
});

test("the category links are below the testimonials section", () => {
  assert.ok(homePage.indexOf('id="categorias"') > homePage.indexOf('testimonios-title'));
});
