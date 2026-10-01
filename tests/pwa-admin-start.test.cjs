const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "public", "manifest.json"), "utf8"));
const serviceWorker = fs.readFileSync(path.join(root, "public", "sw.js"), "utf8");

assert.equal(
  manifest.start_url,
  "/admin/login",
  "La app instalada debe abrir el acceso de administrador"
);
assert.match(
  serviceWorker,
  /"\/admin\/login"/,
  "El acceso de administrador debe estar disponible en la caché inicial de la app instalada"
);

console.log("PWA inicia en el acceso de administrador y lo incluye en la caché inicial.");
