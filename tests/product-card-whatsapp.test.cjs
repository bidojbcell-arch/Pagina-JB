const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");

const productCard = fs.readFileSync(path.join(__dirname, "..", "components", "ProductCard.tsx"), "utf8");

test("every product card provides a WhatsApp link with the product and its visible price", () => {
  assert.match(productCard, /import \{ whatsappLinkProducto \} from "@\/lib\/whatsapp"/);
  assert.match(productCard, /href=\{whatsappLinkProducto\(producto\.nombre, precioVisible\)\}/);
  assert.match(productCard, />\s*Pedir por WhatsApp\s*<\/a>/);
});
