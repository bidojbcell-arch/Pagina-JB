const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  module._compile(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText, filename);
};

const { addToCart, setCartQuantity, cartTotal, cartMessage } = require("../lib/cart.ts");
const { whatsappLink } = require("../lib/whatsapp.ts");
const phone = { id: "phone", nombre: "Teléfono & funda", precio: 1500, precio_oferta: 1200, tipo: "oferta", disponible: true, stock: 3 };
const cable = { id: "cable", nombre: "Cable", precio: 250, precio_oferta: null, tipo: "normal", disponible: true, stock: 5 };

test("repeated additions use one line and honor the available stock", () => {
  let cart = [];
  for (let i = 0; i < 5; i++) cart = addToCart(cart, phone);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 3);
});

test("quantities can decrease and a zero quantity removes the item", () => {
  const cart = setCartQuantity(addToCart([], phone), "phone", 2);
  assert.equal(setCartQuantity(cart, "phone", 1)[0].quantity, 1);
  assert.deepEqual(setCartQuantity(cart, "phone", 0), []);
});

test("unavailable products and missing prices cannot produce a misleading cart total", () => {
  for (const product of [{ ...phone, stock: 0 }, { ...phone, disponible: false }, { ...cable, precio: null }]) {
    assert.deepEqual(addToCart([], product), []);
  }
});

test("the total uses offer prices, quantities and normal prices", () => {
  const cart = addToCart(setCartQuantity(addToCart([], phone), "phone", 2), cable);
  assert.equal(cartTotal(cart), 2650);
});

test("WhatsApp checkout retains each item, quantity, subtotal and the order total", () => {
  const cart = addToCart(setCartQuantity(addToCart([], phone), "phone", 2), cable);
  const url = new URL(whatsappLink(cartMessage(cart)));
  assert.equal(url.hostname, "wa.me");
  const message = url.searchParams.get("text");
  assert.match(message, /2 × Teléfono & funda.*RD\$1,200.*RD\$2,400/);
  assert.match(message, /1 × Cable.*RD\$250.*RD\$250/);
  assert.match(message, /Total: RD\$2,650/);
});
