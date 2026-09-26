const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.join(__dirname, "..");
const modal = fs.readFileSync(path.join(root, "components", "ProductModal.tsx"), "utf8");
const homepage = fs.readFileSync(path.join(root, "app", "page.tsx"), "utf8");
const mapsUrl = "https://www.google.com/maps/place/JBCELL/@18.4784719,-69.9721019,16z/data=!4m6!3m5!1s0x8eaf8b5410336c79:0xb03ff606be46cd48!8m2!3d18.4784716!4d-69.969499!16s%2Fg%2F11wpp554tk?entry=ttu";

test("gallery shows labeled previous and next controls only with multiple images", () => {
  assert.match(modal, /imagenes\.length > 1[\s\S]*aria-label="Foto anterior"[\s\S]*aria-label="Foto siguiente"/);
  assert.match(modal, /onClick=\{\(\) => setActiva\(i\)\}/);
});

test("gallery navigation wraps at both ends", () => {
  const filename = path.join(root, "lib", "gallery.ts");
  const source = fs.readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const galleryModule = { exports: {} };
  new Function("module", "exports", compiled)(galleryModule, galleryModule.exports);
  const { previousImageIndex, nextImageIndex } = galleryModule.exports;

  assert.equal(previousImageIndex(0, 3), 2);
  assert.equal(previousImageIndex(2, 3), 1);
  assert.equal(nextImageIndex(2, 3), 0);
  assert.equal(nextImageIndex(0, 3), 1);
});

test("catalog is the first section after the storefront header", () => {
  const afterHeader = homepage.slice(homepage.indexOf("</header>") + "</header>".length);
  assert.match(afterHeader, /^\s*<section id="productos"/);
  assert.ok(homepage.indexOf('id="productos"') < homepage.indexOf('id="ofertas"'));
});

test("footer shows accessible social and map icons, exact address, and secure external links", () => {
  const footer = homepage.slice(homepage.indexOf("<footer"));
  assert.match(footer, /Plaza Fermín, Santo Domingo Oeste KM9 de la Autop\. Juan Pablo Duarte, Santo Domingo 10110/);
  assert.ok(footer.includes(mapsUrl));
  for (const label of ["Instagram", "Facebook", "Cómo llegar"]) {
    assert.match(footer, new RegExp(`aria-label="${label}"[\\s\\S]*?<svg`));
  }
  assert.equal((footer.match(/target="_blank" rel="noopener noreferrer"/g) ?? []).length, 3);
});
