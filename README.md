# JB Catálogo — Tecnología y Accesorios

Catálogo de productos con panel administrador, subida de fotos, PWA (instalable en
celular y PC) y pedidos directos por WhatsApp al **849-636-8091**.

Tecnologías: **Next.js 14 + Supabase (base de datos, autenticación y storage) + Vercel**.

---

## 1. Categorías incluidas

Relojes, Audífonos, Celulares, Cargadores, Powerbanks, Soportes, Tablets, Palos Selfie, Otros.
(Se pueden editar en `lib/types.ts`, arreglo `CATEGORIAS`).

---

## 2. Configurar Supabase (una sola vez)

1. Entra a https://supabase.com y crea un proyecto nuevo (gratis).
2. Ve a **SQL Editor > New query**, pega TODO el contenido del archivo
   `supabase/schema.sql` de este proyecto y dale **Run**.
   Esto crea la tabla `productos`, sus permisos de seguridad (RLS) y el bucket
   de imágenes `productos-imagenes`.
3. Ve a **Authentication > Users > Add user** y crea tu usuario administrador
   (el correo y contraseña con los que entrarás al panel `/admin`).
4. Ve a **Project Settings > API** y copia:
   - `Project URL` → será `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → será `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 3. Configurar el proyecto localmente (opcional, para probar en tu PC)

```bash
npm install
cp .env.local.example .env.local
# Edita .env.local y pega tu URL y anon key de Supabase
npm run dev
```

Abre http://localhost:3000 para el catálogo y http://localhost:3000/admin para el panel.

---

## 4. Subir el código a tu repositorio de GitHub

Si el repo `Pagina-JB` está vacío, desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Catálogo JB: panel admin, PWA, Supabase"
git branch -M main
git remote add origin https://github.com/bidojbcell-arch/Pagina-JB.git
git push -u origin main
```

---

## 5. Desplegar en Vercel

1. Entra a https://vercel.com, inicia sesión y da clic en **Add New > Project**.
2. Selecciona el repositorio `Pagina-JB`.
3. En **Environment Variables** agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` = `18496368091`
4. Presiona **Deploy**. En 1-2 minutos tendrás tu página en línea (ej. `pagina-jb.vercel.app`).
5. Cada vez que hagas `git push`, Vercel actualiza la página automáticamente.

---

## 6. Instalar la app como PWA (en el teléfono o la PC)

- **Android/Chrome:** entra a tu página, toca el menú (⋮) → "Instalar app" o
  "Agregar a pantalla de inicio".
- **iPhone/Safari:** toca el botón compartir → "Agregar a pantalla de inicio".
- **PC (Chrome/Edge):** aparecerá un ícono de instalación (⊕) en la barra de
  direcciones → "Instalar".

---

## 7. Cómo usar el panel administrador

1. Ve a `tu-pagina.vercel.app/admin` (o el link "Acceso administrador" al pie
   de la página principal).
2. Inicia sesión con el correo y contraseña que creaste en Supabase.
3. **Nuevo producto:** nombre, descripción, precio (opcional), categoría,
   varias fotos, y si quieres marcarlo como "Destacado" (aparece primero).
4. **Editar / Ocultar / Eliminar:** desde la tabla de productos puedes editar,
   ocultar temporalmente (sin borrarlo) o eliminar definitivamente un producto.

---

## 8. Cambiar el número de WhatsApp

Edita la variable `NEXT_PUBLIC_WHATSAPP_NUMBER` en Vercel (Project Settings >
Environment Variables) con el formato `[código de país][número]`, sin `+`,
espacios ni guiones. Ejemplo actual: `18496368091` (República Dominicana).

---

## 9. Estructura del proyecto

```
app/
  page.tsx                      → Página principal (catálogo público)
  admin/
    login/page.tsx              → Login del administrador
    page.tsx                    → Dashboard: lista de productos
    productos/nuevo/page.tsx    → Crear producto
    productos/[id]/editar/page.tsx → Editar producto
components/                     → Componentes de UI reutilizables
lib/
  supabase/                     → Clientes de Supabase (navegador y servidor)
  types.ts                      → Categorías y tipo Producto
  whatsapp.ts                   → Generador de enlaces de WhatsApp
supabase/schema.sql             → Script de base de datos y permisos
public/manifest.json, sw.js     → Configuración PWA
middleware.ts                   → Protege las rutas /admin/*
```

---

## Soporte

Si necesitas agregar más categorías, cambiar colores/estilo, o agregar más
administradores, solo pide el ajuste y se actualiza el código.
