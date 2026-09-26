# Reseñas moderadas y galería de producto

## Objetivo

Permitir que visitantes de JBCELL envíen reseñas desde la tienda, mostrar solo las que apruebe el administrador y facilitar la navegación entre las fotos de un producto abierto.

## Reseñas propias

Se agregará una tabla `public.resenas` con nombre visible, calificación de una a cinco estrellas, comentario, fecha y estado `pendiente` o `aprobada`.

El formulario público validará los datos requeridos y creará únicamente reseñas pendientes. Las políticas de Supabase permitirán a visitantes insertar una reseña pendiente y leer solo las aprobadas. El administrador autenticado podrá listar todas, aprobarlas y eliminarlas desde un módulo de `/admin`.

La página principal mostrará una sección de reseñas aprobadas y un formulario breve. El texto explicará que la publicación depende de revisión.

## Google Maps

El pie y la sección de reseñas incluirán un enlace a la ficha de JBCELL en Google Maps. La tienda no intentará importar reseñas de Google ni pedirá acceso a la cuenta de Google Business Profile. El visitante podrá abrir la ficha y usar las opciones de Google para consultar o publicar una reseña.

La dirección visible será: “Plaza Fermín, Santo Domingo Oeste KM9 de la Autop. Juan Pablo Duarte, Santo Domingo 10110”.

## Fotos de productos

La ficha emergente de producto conservará las miniaturas existentes y añadirá controles anterior y siguiente. Al pulsar una miniatura o los controles, cambiará la foto principal sin cerrar la ficha. Los controles se ocultarán cuando exista una sola foto.

## Seguridad y errores

RLS se habilitará en `public.resenas`. Los visitantes no podrán aprobar, editar ni borrar reseñas. El formulario comunicará errores de validación o envío y evitará envíos duplicados mientras procesa la solicitud. El administrador podrá eliminar una reseña pendiente o aprobada.

## Verificación

Las pruebas cubrirán que una reseña pública se cree en estado pendiente, que solo las aprobadas se muestren en el catálogo público, que las acciones del administrador funcionen con sesión y que la galería cambie entre fotos disponibles. También se verificará el esquema y las políticas mediante consultas de Supabase antes de publicar.
