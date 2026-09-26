const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const homepage = fs.readFileSync(path.join(root, "app", "page.tsx"), "utf8");
const componentPath = path.join(root, "components", "ResenasPublicas.tsx");

test("homepage loads at most six newest approved reviews for the public section", () => {
  assert.match(homepage, /\.from\("resenas"\)[\s\S]*?\.eq\("estado", "aprobada"\)[\s\S]*?\.order\("created_at", \{ ascending: false \}\)[\s\S]*?\.limit\(6\)/);
  assert.match(homepage, /<ResenasPublicas\s+resenas=\{resenas\}/);
});

test("public review form validates and submits pending reviews", () => {
  const source = fs.readFileSync(componentPath, "utf8");
  assert.match(source, /^"use client";/);
  assert.match(source, /useState\(""\)/);
  assert.match(source, /calificacion/);
  assert.match(source, /comentario/);
  assert.match(source, /\.from\("resenas"\)\.insert\(/);
  assert.match(source, /estado: "pendiente"/);
  assert.match(source, /Tu reseña será publicada después de revisión\./);
  assert.match(source, /disabled=\{enviando\}/);
});

test("public section renders approved cards and a secure Google review link", () => {
  const source = fs.readFileSync(componentPath, "utf8");
  assert.match(source, /resenas\.map\(/);
  assert.match(source, /Ver o dejar reseña en Google/);
  assert.match(source, /https:\/\/www\.google\.com\/maps\/place\/JBCELL\//);
  assert.match(source, /target="_blank"/);
  assert.match(source, /rel="noopener noreferrer"/);
});
