const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

test("admin page loads all reviews newest first and passes them to moderation", () => {
  const source = fs.readFileSync(path.join(root, "app", "admin", "page.tsx"), "utf8");
  assert.match(source, /\.from\("resenas"\)\s*\.select\("\*"\)\s*\.order\("created_at",\s*\{\s*ascending:\s*false\s*\}\)/);
  assert.match(source, /<AdminResenas\s+resenasIniciales=\{resenas\}/);
});

test("pending reviews can be approved by id and successful updates change local state", () => {
  const source = fs.readFileSync(path.join(root, "components", "AdminResenas.tsx"), "utf8");
  assert.match(source, /estado\s*===\s*"pendiente"[\s\S]*?Aprobar/);
  assert.match(source, /\.from\("resenas"\)\.update\(\{\s*estado:\s*"aprobada"\s*\}\)\.eq\("id",\s*resena\.id\)/);
  assert.match(source, /if\s*\(error\)\s*throw error;[\s\S]*?setResenas\(/);
});

test("every review can be deleted by id and failures show feedback", () => {
  const source = fs.readFileSync(path.join(root, "components", "AdminResenas.tsx"), "utf8");
  assert.match(source, /\.from\("resenas"\)\.delete\(\)\.eq\("id",\s*resena\.id\)/);
  assert.match(source, /if\s*\(error\)\s*throw error;[\s\S]*?setResenas\(/);
  assert.match(source, /Eliminar/);
  assert.match(source, /role="alert"/);
  for (const field of ["nombre", "calificacion", "comentario", "estado", "created_at"]) {
    assert.match(source, new RegExp(`resena\\.${field}`));
  }
});
