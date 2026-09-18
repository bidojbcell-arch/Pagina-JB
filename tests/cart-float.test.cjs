
const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

require.extensions[".tsx"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  module._compile(ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2017,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText, filename);
};

const CartFloat = require("../components/CartFloat.tsx").default;

test("the floating cart exposes the current product count to shoppers", () => {
  const html = renderToStaticMarkup(React.createElement(CartFloat, { count: 3, onOpen: () => {} }));

  assert.match(html, /aria-label="Abrir carrito, 3 productos"/);
  assert.match(html, />3<\/span>/);
});

