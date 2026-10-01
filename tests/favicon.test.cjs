const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const favicon = path.join(__dirname, "..", "public", "favicon.ico");

assert.ok(fs.existsSync(favicon), "El dominio debe publicar un favicon en /favicon.ico");
const bytes = fs.readFileSync(favicon);
assert.deepEqual([...bytes.subarray(0, 4)], [0, 0, 1, 0], "El favicon debe tener formato ICO válido");
assert.ok(bytes.length > 1000, "El favicon debe contener el emblema JBCELL");

console.log("El favicon JBCELL está disponible para navegadores y buscadores.");
