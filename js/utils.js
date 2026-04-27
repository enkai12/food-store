// ============================================================
// UTILS.JS — Utilidades compartidas del proyecto
// ============================================================
// Funciones genéricas sin dependencias que pueden reutilizarse
// desde cualquier módulo. Al concentrarlas acá evitamos repetir
// la misma lógica en main.js y admin.js.
// ============================================================

// ------------------------------------------------------------
// ESCAPARHTML — convierte caracteres especiales en entidades HTML
// Cuando insertamos texto de usuario dentro de un innerHTML,
// el navegador lo parsea como HTML. Si el texto contiene "<",
// ">", "&", etc., el navegador los interpreta como etiquetas
// reales, lo que puede ejecutar código arbitrario (XSS).
//
// Esta función los "neutraliza" reemplazándolos por secuencias
// que el navegador muestra como texto plano sin ejecutar nada:
//
//   & → &amp;   (siempre primero para no escapar las entidades ya escapadas)
//   < → &lt;    (evita abrir etiquetas)
//   > → &gt;    (evita cerrar etiquetas)
//   " → &quot;  (evita romper atributos HTML como src="...")
//   ' → &#39;   (igual que " pero para atributos con comilla simple)
//
// Ejemplo sin escapar:
//   nombre = '<script>alert("xss")</script>'
//   innerHTML = `<td>${nombre}</td>`  → ejecuta el script 
//
// Ejemplo con escapar:
//   innerHTML = `<td>${escaparHTML(nombre)}</td>`
//   → muestra el texto literal sin ejecutarlo ✓
//
// String(str) garantiza que la función no falle si recibe un
// número u otro tipo que no tiene el método .replace().
// ------------------------------------------------------------
export const escaparHTML = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// ------------------------------------------------------------
// VALIDARPRODUCTO — valida los campos del formulario de admin
// Recibe un objeto con los campos del producto y el array de
// categorías válidas. Devuelve un objeto con dos propiedades:
//   - valido: boolean — true si no hay ningún error
//   - errores: string[] — lista de mensajes de error para mostrar
//
// Por qué separarlo de admin.js:
//   La lógica de validación no depende del DOM ni del estado
//   del panel. Al separarla acá es fácil de testear de forma
//   aislada y de reutilizar si en el futuro hay otro formulario.
//
// Reglas que se verifican:
//   nombre     → entre 3 y 100 caracteres, no vacío
//   categoria  → debe ser uno de los valores del array categorias
//   precio     → número finito, mayor a 0, máximo $9.999.999
//   stock      → número entero (sin decimales), mínimo 0, máximo 9999
//
// Number.isFinite(n) devuelve true solo si n es un número real
// (descarta NaN e Infinity, que Number() puede generar con
// entradas vacías o texto).
//
// Number.isInteger(n) devuelve true solo si n no tiene decimales.
// Esto previene que se ingrese "5.7" como stock.
// ------------------------------------------------------------
export const validarProducto = ({ nombre, categoria, precio, stock }, categoriasValidas) => {
  const errores = [];

  if (nombre.length < 3)
    errores.push("El nombre debe tener al menos 3 caracteres.");
  if (nombre.length > 100)
    errores.push("El nombre no puede superar los 100 caracteres.");

  // Array.includes() busca el valor exacto dentro del array.
  // Si la categoría no está en la lista, el formulario fue manipulado.
  if (!categoriasValidas.includes(categoria))
    errores.push("Seleccioná una categoría válida.");

  if (!Number.isFinite(precio) || precio <= 0)
    errores.push("El precio debe ser un número mayor a cero.");
  if (precio > 9_999_999)
    errores.push("El precio no puede superar $9.999.999.");

  if (!Number.isInteger(stock) || stock < 0)
    errores.push("El stock debe ser un número entero no negativo.");
  if (stock > 9_999)
    errores.push("El stock no puede superar las 9.999 unidades.");

  return { valido: errores.length === 0, errores };
};
