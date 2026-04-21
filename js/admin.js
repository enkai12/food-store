// ============================================================
// ADMIN.JS — Lógica del panel de administración (admin.html)
// ============================================================
// Este archivo maneja tres responsabilidades:
//   1. Renderizar la tabla de productos desde el array de datos.
//   2. Poblar el select de categorías dinámicamente.
//   3. Procesar el formulario para agregar productos nuevos
//      y el botón para eliminarlos.
// Al igual que main.js, lee los datos de data.js (que se carga
// primero gracias al orden de los <script> en el HTML).
// ============================================================

// ------------------------------------------------------------
// CLASEDESTOCK — devuelve la clase CSS según el stock
// Si el stock es 0 devuelve "stock-cero" (rojo en la tabla),
// si hay cualquier cantidad devuelve "stock-ok" (verde).
// Separarlo como función evita repetir el ternario en cada
// lugar donde necesitemos mostrar el stock.
// El operador ternario es una forma corta de un if/else:
//   condicion ? valor_si_true : valor_si_false
// ------------------------------------------------------------
const claseDeStock = (stock) => (stock === 0 ? "stock-cero" : "stock-ok");

// ------------------------------------------------------------
// CARGARTABLA — renderiza todas las filas de la tabla
// Recibe "lista", que puede ser el array completo o uno
// modificado (después de agregar o eliminar un producto).
// Limpia el tbody y lo vuelve a generar desde cero para que
// refleje siempre el estado actual del array.
// ------------------------------------------------------------
const cargarTabla = (lista) => {
  const cuerpo = document.getElementById("cuerpo-tabla");

  // Vaciamos el tbody antes de re-renderizar para no duplicar filas
  cuerpo.innerHTML = "";

  // DocumentFragment: acumulamos todas las filas en memoria
  // y las insertamos al DOM de una sola vez al final.
  // (ver explicación completa en main.js)
  const fragmento = document.createDocumentFragment();

  lista.forEach((producto) => {
    const tr = document.createElement("tr");

    // claseDeStock decide si el número de stock se ve en rojo o verde
    tr.innerHTML = `
      <td>${producto.id}</td>
      <td><img src="${producto.imagen}" width="50" alt="${producto.nombre}" loading="lazy" /></td>
      <td>${producto.nombre}</td>
      <td>${producto.categoria}</td>
      <td>$${formatearPrecio(producto.precio)}</td>
      <td class="${claseDeStock(producto.stock)}">${producto.stock}</td>
      <td>
        <a class="accion-editar" href="#">Editar</a>
        <span class="separador-accion">|</span>
        <a class="accion-eliminar" href="#">Eliminar</a>
      </td>
    `;

    fragmento.appendChild(tr);
  });

  cuerpo.appendChild(fragmento);
};

// ------------------------------------------------------------
// CARGARSELECTCATEGORIAS — puebla el <select> del formulario
// Lee el array "categorias" de data.js y genera un <option>
// por cada una. Así si mañana agregamos una categoría en
// data.js, el select se actualiza solo sin tocar el HTML.
// Resetea el select al inicio para evitar duplicados si la
// función se llama más de una vez.
// ------------------------------------------------------------
const cargarSelectCategorias = () => {
  const select = document.getElementById("select-categoria");

  // Reseteamos el select con solo la opción por defecto.
  // Si no hiciéramos esto y la función se llamara dos veces,
  // veríamos cada categoría duplicada en el menú.
  select.innerHTML = `<option value="">Seleccione una opción...</option>`;

  const fragmento = document.createDocumentFragment();

  categorias.forEach((categoria) => {
    const option = document.createElement("option");
    // value es lo que llega al JS cuando el usuario elige
    // textContent es lo que el usuario ve en pantalla
    option.value = categoria;
    option.textContent = categoria;
    fragmento.appendChild(option);
  });

  select.appendChild(fragmento);
};

// ------------------------------------------------------------
// ELIMINAR PRODUCTO — event delegation en la tabla
// Ponemos un listener en el tbody en vez de en cada link
// "Eliminar". Cuando el usuario hace click en cualquier parte
// de la tabla, el evento burbujea hasta acá.
// Si el click no fue en un .accion-eliminar, ignoramos.
// ------------------------------------------------------------
document.getElementById("cuerpo-tabla").addEventListener("click", (e) => {
  if (!e.target.classList.contains("accion-eliminar")) return;

  // Evitamos que el href="#" haga scroll arriba
  e.preventDefault();

  // closest("tr") sube por el DOM buscando la fila <tr> que
  // contiene al link clickeado — así sabemos qué fila eliminar.
  const tr = e.target.closest("tr");

  // Leemos el nombre desde la tercera celda de la fila para
  // mostrarlo en el mensaje de confirmación (más amigable).
  const nombre = tr.querySelector("td:nth-child(3)").textContent;

  // confirm() muestra un diálogo nativo del navegador con
  // Aceptar y Cancelar. Devuelve true si el usuario acepta.
  // Si cancela, cortamos la ejecución con return.
  if (!confirm(`¿Eliminar "${nombre}"?`)) return;

  // Leemos el id de la primera celda para encontrar el producto
  // en el array. Number() lo convierte de string a número porque
  // textContent siempre devuelve un string.
  const id = Number(tr.querySelector("td:first-child").textContent);

  // findIndex devuelve la posición del primer elemento que cumple
  // la condición, o -1 si no lo encuentra.
  const index = productos.findIndex((p) => p.id === id);

  // splice(index, 1) elimina 1 elemento en la posición "index"
  // modificando el array original. Distinto de filter que
  // devuelve una copia nueva sin modificar el original.
  if (index !== -1) productos.splice(index, 1);

  // Re-renderizamos la tabla para reflejar el cambio
  cargarTabla(productos);
});

// ------------------------------------------------------------
// FORMULARIO — agregar producto nuevo
// Lee los valores de los inputs, construye un objeto producto
// y lo agrega al array. Luego re-renderiza la tabla.
// ------------------------------------------------------------
const formularioAdmin = document.querySelector(".form-producto");

formularioAdmin.addEventListener("submit", (e) => {
  // Evitamos el comportamiento por defecto del form (recargar
  // la página al hacer submit)
  e.preventDefault();

  // Leemos y limpiamos cada campo del formulario.
  // .value devuelve el contenido del input como string.
  // .trim() elimina espacios al inicio y al final.
  // Number() convierte strings a números para precio y stock.
  const nombre = document.getElementById("nombre-producto").value.trim();
  const categoria = document.getElementById("select-categoria").value;
  const precio = Number(document.getElementById("precio").value);
  const stock = Number(document.getElementById("stock").value);
  const descripcion = document.getElementById("descripcion").value.trim();

  // Tomamos las dos primeras letras del nombre para generar una
  // imagen placeholder con las iniciales del producto.
  // slice(0, 2) extrae caracteres del índice 0 al 1 (el segundo
  // parámetro es exclusivo). toUpperCase() los pone en mayúscula.
  const iniciales = nombre.slice(0, 2).toUpperCase();

  // Math.max(...array) con spread operator (...) expande el array
  // como argumentos separados. Así obtenemos el id más alto actual.
  // Sumarle 1 garantiza que el nuevo id sea único aunque hayamos
  // eliminado productos — es más seguro que usar productos.length + 1,
  // que podría repetir un id si se eliminó algún elemento.
  const id = Math.max(...productos.map((p) => p.id)) + 1;

  // Creamos el objeto con la misma estructura que los de data.js
  const nuevoProducto = {
    id,
    nombre,
    descripcion,
    precio,
    // encodeURIComponent convierte caracteres especiales para
    // que sean válidos dentro de una URL (ej: espacios → %20)
    imagen: `https://placehold.co/50x50/FF6347/white?text=${encodeURIComponent(iniciales)}`,
    categoria,
    stock,
  };

  // push() agrega el nuevo objeto al final del array.
  // Como "productos" es una const, no podemos reasignarla
  // (productos = otraLista daría error), pero sí podemos
  // modificar su contenido con métodos como push o splice.
  productos.push(nuevoProducto);

  // Re-renderizamos la tabla con el array actualizado
  cargarTabla(productos);

  // reset() limpia todos los campos del formulario de una vez
  formularioAdmin.reset();

  // Cerramos el <details> quitando el atributo "open".
  // El elemento <details> nativo del HTML muestra u oculta
  // su contenido según tenga o no el atributo "open".
  document.querySelector(".seccion-formulario details").removeAttribute("open");

  alert(`Producto "${nombre}" agregado correctamente.`);
});

// ------------------------------------------------------------
// INICIALIZACIÓN
// Llamamos a las funciones de carga al inicio.
// cargarSelectCategorias primero para que el select esté listo
// antes de que el usuario abra el formulario.
// ------------------------------------------------------------
cargarSelectCategorias();
cargarTabla(productos);
