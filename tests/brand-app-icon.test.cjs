const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "public", "manifest.json"), "utf8"));
const layout = fs.readFileSync(path.join(root, "app", "layout.tsx"), "utf8");

const brandedIcons = ["/icons/jbcell-app-192.png", "/icons/jbcell-app-512.png"];

for (const icon of brandedIcons) {
  assert.ok(manifest.icons.some((entry) => entry.src === icon), `${icon} debe ser un ícono de instalación`);
  assert.ok(layout.includes(icon), `${icon} debe estar declarado para navegador o Apple`);
  assert.ok(fs.existsSync(path.join(root, "public", icon)), `${icon} debe existir`);
}

console.log("La instalación y la web exponen los íconos JBCELL de marca.");
