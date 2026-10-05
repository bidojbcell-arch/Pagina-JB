const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  module._compile(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2017,
      },
    }).outputText,
    filename,
  );
};

const {
  cantidadInicialMayoreo,
  totalMayoreo,
  whatsappLinkMayoreo,
  totalCarritoMayoreo,
  mensajeCarritoMayoreo,
  productosMayoreoPorPagina,
} = require("../lib/mayoreo.ts");

test("un pedido mayorista inicia en el mínimo configurado y calcula su total", () => {
  const producto = {
    nombre: "Smart Watch K52",
    precio_mayoreo: 850,
    minimo_mayoreo: 3,
  };

  assert.equal(cantidadInicialMayoreo(producto), 3);
  assert.equal(totalMayoreo(producto, 5), 4250);
});

test("el enlace mayorista de WhatsApp incluye producto, cantidad, mínimo y total", () => {
  const enlace = whatsappLinkMayoreo(
    { nombre: "Smart Watch K52", precio_mayoreo: 850, minimo_mayoreo: 3 },
    4,
  );

  const mensaje = decodeURIComponent(enlace.split("text=")[1]);
  assert.match(mensaje, /Smart Watch K52/);
  assert.match(mensaje, /Cantidad: 4/);
  assert.match(mensaje, /Mínimo mayorista: 3/);
  assert.match(mensaje, /Total: RD\$3,400/);
});

test("el carrito mayorista conserva los mínimos y suma todos los productos", () => {
  const items = [
    { producto: { nombre: "Smart Watch K52", precio_mayoreo: 850, minimo_mayoreo: 3 }, cantidad: 1 },
    { producto: { nombre: "AirPods IA18", precio_mayoreo: 500, minimo_mayoreo: 2 }, cantidad: 4 },
  ];

  assert.equal(totalCarritoMayoreo(items), 4550);
  assert.match(mensajeCarritoMayoreo(items), /Smart Watch K52 × 3/);
  assert.match(mensajeCarritoMayoreo(items), /AirPods IA18 × 4/);
  assert.match(mensajeCarritoMayoreo(items), /Total general: RD\$4,550/);
});

test("el catálogo mayorista muestra diez productos por página", () => {
  const productos = Array.from({ length: 23 }, (_, index) => `Producto ${index + 1}`);
  const resultado = productosMayoreoPorPagina(productos, 2);

  assert.equal(resultado.totalPaginas, 3);
  assert.deepEqual(resultado.productos, productos.slice(10, 20));
});

