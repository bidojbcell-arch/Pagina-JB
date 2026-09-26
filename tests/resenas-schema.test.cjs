const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");

const schemaPath = path.join(__dirname, "..", "supabase", "resenas.sql");
const typesPath = path.join(__dirname, "..", "lib", "types.ts");

test("review schema defines constraints and moderated row-level access", () => {
  const schema = fs.readFileSync(schemaPath, "utf8");
  const types = fs.readFileSync(typesPath, "utf8");

  assert.match(schema, /create table(?:\s+if not exists)?\s+(?:public\.)?resenas/i);
  assert.match(schema, /id\s+uuid\s+primary key/i);
  assert.match(schema, /char_length\(btrim\(nombre\)\)\s+between\s+2\s+and\s+80/i);
  assert.match(schema, /calificacion\s+between\s+1\s+and\s+5/i);
  assert.match(schema, /char_length\(btrim\(comentario\)\)\s+between\s+5\s+and\s+500/i);
  assert.match(schema, /estado\s+in\s*\('pendiente',\s*'aprobada'\)/i);
  assert.match(schema, /estado\s+[^,;]*default\s+'pendiente'/i);
  assert.match(schema, /created_at\s+timestamptz/i);
  assert.match(schema, /enable row level security/i);
  assert.match(schema, /for select[^;]*estado\s*=\s*'aprobada'/is);
  assert.match(schema, /for insert[^;]*with check[^;]*estado\s*=\s*'pendiente'/is);
  assert.match(schema, /authenticated[^;]*for select/is);
  assert.match(schema, /authenticated[^;]*for update/is);
  assert.match(schema, /authenticated[^;]*for delete/is);
  assert.doesNotMatch(schema, /security\s+definer|service_role/i);
  assert.match(types, /export type EstadoResena\s*=\s*"pendiente"\s*\|\s*"aprobada"/);
  assert.match(types, /export interface Resena\s*\{/);
});

test("signed-in visitors can insert only pending reviews", () => {
  const schema = fs.readFileSync(schemaPath, "utf8");
  const authenticatedGrants = [...schema.matchAll(/grant\s+([^;]+?)\s+on\s+public\.resenas\s+to\s+authenticated\s*;/gi)]
    .flatMap((match) => match[1].split(",").map((privilege) => privilege.trim().toLowerCase()));

  assert.ok(authenticatedGrants.includes("insert"), "authenticated role needs INSERT privilege");
  assert.match(schema, /create policy [^;]*?on public\.resenas\s+for insert\s+to authenticated\s+with check\s*\(estado\s*=\s*'pendiente'\)/is);
});
