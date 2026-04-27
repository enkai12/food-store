// ============================================================
// MAIN.JS — Lógica de la tienda (index.html)
// ============================================================
// import trae exactamente los valores que necesitamos de data.js.
// La ruta debe incluir la extensión ".js" cuando se usan ES Modules
// en el navegador (a diferencia de Node.js o bundlers que la
// infieren). Solo importamos lo que este módulo realmente usa —
// guardarProductos no se importa porque main.js nunca modifica datos.
import { categorias, formatearPrecio, productos } from "./data.js";

// Importamos solo escaparHTML porque main.js nunca valida ni escribe datos.
import { escaparHTML } from "./utils.js";
// Este archivo se encarga de "pintar" los datos de data.js
// en la pantalla. Nunca modifica los datos directamente —
// solo los lee y genera el HTML correspondiente.
// Flujo general:
//   1. Al cargar la página se ejecutan cargarCategorias() y
//      renderizarProductos(productos).
//   2. El usuario interactúa (click en categoría o búsqueda).
//   3. Se filtra el array y se vuelve a llamar
//      renderizarProductos() con la lista filtrada.
// ============================================================

// ------------------------------------------------------------
// REFERENCIAS AL DOM — guardadas al inicio, fuera de funciones
// document.getElementById busca un elemento por su id y lo
// devuelve. Al guardarlo en una const evitamos tener que
// buscarlo en el DOM cada vez que lo necesitamos — el DOM es
// como un árbol de nodos y recorrerlo tiene un costo pequeño
// pero acumulable si se hace muchas veces.
// ------------------------------------------------------------
const contenedor = document.getElementById("contenedor-productos");
const listaCategorias = document.getElementById("lista-categorias");

// ------------------------------------------------------------
// RENDERIZARPRODUCTOS — dibuja las tarjetas en la grilla
// Recibe "lista", que puede ser el array completo o uno
// filtrado. Siempre limpia la grilla antes de dibujar para
// no acumular tarjetas duplicadas.
// ------------------------------------------------------------
const renderizarProductos = (lista) => {
  // Vaciamos el contenedor antes de pintar.
  // innerHTML = "" borra todos los elementos hijos de golpe,
  // que es más rápido que eliminarlos uno por uno.
  contenedor.innerHTML = "";

  // Estado vacío: si no hay productos que mostrar, informamos
  // al usuario en vez de dejar la grilla en blanco sin aviso.
  // La clase "sin-resultados" en el CSS le da estilos centrados.
  if (lista.length === 0) {
    contenedor.innerHTML = `<p class="sin-resultados">No se encontraron productos.</p>`;
    return; // "return" corta la ejecución de la función acá
  }

  // DocumentFragment: es un "contenedor invisible" que existe
  // solo en memoria, no en el DOM real. Acumulamos todos los
  // artículos ahí adentro y al final hacemos UN SOLO appendChild
  // al DOM real. Esto es más eficiente porque cada vez que
  // modificás el DOM el navegador puede recalcular estilos y
  // reposicionar elementos; haciéndolo una vez evitamos ese
  // trabajo innecesario.
  const fragmento = document.createDocumentFragment();

  // forEach recorre cada elemento del array "lista".
  // En cada iteración "producto" toma el valor del elemento actual.
  lista.forEach((producto) => {
    // Creamos el nodo <article> con JavaScript puro.
    // createElement crea el elemento en memoria sin agregarlo
    // al DOM todavía — primero lo configuramos y después lo
    // insertamos de una sola vez.
    const article = document.createElement("article");

    // Asignamos la clase CSS para que tome los estilos
    // de .tarjeta-producto definidos en index.css
    article.className = "tarjeta-producto";

    // dataset.id guarda el id del producto como atributo HTML
    // personalizado: <article data-id="1">
    // Lo usamos después en el listener de "Agregar" para saber
    // qué producto clickeó el usuario sin necesidad de guardar
    // una referencia en cada tarjeta.
    article.dataset.id = producto.id;

    // Template string (comillas invertidas ``): permite insertar
    // variables de JS dentro de texto HTML con ${expresion}.
    // Construimos el HTML interno de la tarjeta de una vez.
    // escaparHTML se aplica a los campos de texto antes de interpolarlos
    // en el template. Precio es un número formateado — no necesita escape.
    const nombre      = escaparHTML(producto.nombre);
    const descripcion = escaparHTML(producto.descripcion);
    const imagen      = escaparHTML(producto.imagen);

    article.innerHTML = `
      <img src="${imagen}" alt="${nombre}" loading="lazy" />
      <div class="tarjeta-producto__contenido">
        <h3>${nombre}</h3>
        <p>${descripcion}</p>
        <p class="precio"><strong>$${formatearPrecio(producto.precio)}</strong></p>
        <div class="tarjeta-producto__botones">
          <button>Ver Detalles</button>
          <button class="btn-agregar">Agregar</button>
        </div>
      </div>
    `;

    // Agregamos el article al fragmento (memoria), no al DOM aún
    fragmento.appendChild(article);
  });

  // Ahora sí insertamos todos los artículos al DOM de una vez.
  // Un solo "reflow" del navegador en lugar de N (uno por tarjeta).
  contenedor.appendChild(fragmento);
};

// ------------------------------------------------------------
// EVENT DELEGATION — un solo listener para todos los botones
// En vez de agregar addEventListener a cada botón "Agregar"
// (que se crean y destruyen con cada render), ponemos UN SOLO
// listener en el contenedor padre. Cuando el usuario hace click
// en cualquier elemento dentro del contenedor, el evento
// "burbujea" hasta acá.
// Luego verificamos si el click fue en un .btn-agregar;
// si no, ignoramos el evento con "return".
// Ventaja: el listener sobrevive aunque reemplacemos las
// tarjetas — no necesitamos re-asignarlo después de cada render.
// ------------------------------------------------------------
contenedor.addEventListener("click", (e) => {
  // e.target es el elemento exacto donde hizo click el usuario.
  // Si no tiene la clase "btn-agregar", salimos sin hacer nada.
  if (!e.target.classList.contains("btn-agregar")) return;

  // closest("article") sube por el árbol del DOM buscando el
  // <article> más cercano que contiene al botón clickeado.
  // De ahí leemos el data-id que guardamos al renderizar.
  const id = Number(e.target.closest("article").dataset.id);

  // find recorre el array y devuelve el primer elemento que
  // cumple la condición. Si no encuentra nada devuelve undefined.
  const producto = productos.find((p) => p.id === id);

  if (producto) alert(producto.nombre);
});

// ------------------------------------------------------------
// MARCARCATEGORIAACTIVA — resalta el link de categoría activo
// Primero le saca la clase a todos los links (por si alguno
// la tenía), y después se la pone solo al que recibe.
// Así garantizamos que siempre haya exactamente uno activo.
// ------------------------------------------------------------
const marcarCategoriaActiva = (enlace) => {
  // querySelectorAll devuelve una NodeList (lista de nodos).
  // forEach la recorre para limpiar la clase en todos.
  listaCategorias.querySelectorAll("a").forEach((a) => a.classList.remove("categoria-activa"));
  enlace.classList.add("categoria-activa");
};

// ------------------------------------------------------------
// CREARITEMCATEGORIA — factory de items del aside
// Recibe el texto a mostrar y una función "alHacerClick" que
// se ejecutará cuando el usuario haga click.
// Pasar funciones como parámetros se llama "callback" —
// es una técnica muy usada en JS para personalizar el
// comportamiento de una función sin duplicarla.
// Devuelve el <li> listo para insertar en el DOM.
// ------------------------------------------------------------
const crearItemCategoria = (texto, alHacerClick) => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = "#";
  a.textContent = texto;

  a.addEventListener("click", (e) => {
    // preventDefault evita que el href="#" haga scroll al
    // inicio de la página, que es el comportamiento por defecto
    // de un enlace con "#" como destino.
    e.preventDefault();

    // e.currentTarget es el elemento al que le pusimos el
    // listener (el <a>), a diferencia de e.target que podría
    // ser un hijo interno si el usuario clickea adentro.
    marcarCategoriaActiva(e.currentTarget);

    // Ejecutamos la función que nos pasaron como parámetro.
    // Gracias a esto "Todas" llama a renderizarProductos(productos)
    // y cada categoría llama a renderizarProductos con su filtro.
    alHacerClick();
  });

  li.appendChild(a);
  return li;
};

// ------------------------------------------------------------
// CARGARCATEGORIAS — genera los items del aside
// Agrega "Todas" primero (hardcoded) y luego itera el array
// categorias para agregar el resto dinámicamente.
// Usa DocumentFragment por la misma razón que renderizarProductos:
// hace un solo acceso al DOM al final en vez de N.
// ------------------------------------------------------------
const cargarCategorias = () => {
  const fragmento = document.createDocumentFragment();

  // "Todas" es un caso especial: muestra el array completo sin filtro
  fragmento.appendChild(
    crearItemCategoria("Todas", () => renderizarProductos(productos))
  );

  // Arrow function en forEach: por cada categoría creamos un item
  // cuyo callback filtra los productos por esa categoría.
  // filter devuelve un nuevo array con los elementos que cumplen
  // la condición — no modifica el array original "productos".
  categorias.forEach((categoria) => {
    fragmento.appendChild(
      crearItemCategoria(categoria, () =>
        renderizarProductos(productos.filter((p) => p.categoria === categoria))
      )
    );
  });

  listaCategorias.appendChild(fragmento);

  // Marcamos "Todas" como activa por defecto al cargar la página.
  // querySelector devuelve el PRIMER elemento que coincide —
  // como "Todas" fue el primero que agregamos, lo selecciona.
  marcarCategoriaActiva(listaCategorias.querySelector("a"));
};

// ------------------------------------------------------------
// BUSCADOR — listener del formulario de búsqueda
// querySelector busca por selector CSS, igual que en CSS mismo.
// ".seccion-busqueda form" = el <form> dentro de .seccion-busqueda
// ------------------------------------------------------------
const formularioBusqueda = document.querySelector(".seccion-busqueda form");

formularioBusqueda.addEventListener("submit", (e) => {
  // Evitamos que el form recargue la página (comportamiento
  // por defecto de un submit sin action).
  e.preventDefault();

  // .value lee el texto del input. trim() elimina espacios
  // al inicio y al final. toLowerCase() convierte a minúsculas
  // para que la búsqueda no sea sensible a mayúsculas.
  const termino = document.getElementById("buscar").value.trim().toLowerCase();

  // Al buscar reseteamos la categoría activa a "Todas" visualmente,
  // porque la búsqueda ignora el filtro de categoría activo.
  marcarCategoriaActiva(listaCategorias.querySelector("a"));

  // Operador ternario: si el término está vacío mostramos todo,
  // si no, filtramos por nombre y descripción.
  // includes() busca una subcadena dentro de un string y devuelve
  // true si la encuentra — "pizza" incluye "izz" → true.
  const filtrados = termino === ""
    ? productos
    : productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(termino) ||
          p.descripcion.toLowerCase().includes(termino)
      );

  renderizarProductos(filtrados);
});

// ------------------------------------------------------------
// INICIALIZACIÓN — se ejecuta cuando el script se carga
// Como los scripts están al final del <body>, el HTML ya está
// parseado y los elementos existen en el DOM cuando llegamos acá.
// ------------------------------------------------------------
cargarCategorias();
renderizarProductos(productos);
