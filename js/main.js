const contenedor = document.getElementById("contenedor-productos");
const listaCategorias = document.getElementById("lista-categorias");

const renderizarProductos = (lista) => {
  contenedor.innerHTML = "";
  lista.forEach((producto) => {
    const article = document.createElement("article");
    article.className = "tarjeta-producto";
    article.dataset.id = producto.id;
    article.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" />
      <div class="tarjeta-producto__contenido">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio"><strong>$${formatearPrecio(producto.precio)}</strong></p>
        <div class="tarjeta-producto__botones">
          <button>Ver Detalles</button>
          <button class="btn-agregar">Agregar</button>
        </div>
      </div>
    `;
    contenedor.appendChild(article);
  });
};

contenedor.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-agregar")) return;
  const id = Number(e.target.closest("article").dataset.id);
  const producto = productos.find((p) => p.id === id);
  if (producto) alert(producto.nombre);
});

const marcarCategoriaActiva = (enlace) => {
  listaCategorias.querySelectorAll("a").forEach((a) => a.classList.remove("categoria-activa"));
  enlace.classList.add("categoria-activa");
};

const crearItemCategoria = (texto, alHacerClick) => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = "#";
  a.textContent = texto;
  a.addEventListener("click", (e) => {
    e.preventDefault();
    marcarCategoriaActiva(e.currentTarget);
    alHacerClick();
  });
  li.appendChild(a);
  return li;
};

const cargarCategorias = () => {
  listaCategorias.appendChild(
    crearItemCategoria("Todas", () => renderizarProductos(productos))
  );
  categorias.forEach((categoria) => {
    listaCategorias.appendChild(
      crearItemCategoria(categoria, () =>
        renderizarProductos(productos.filter((p) => p.categoria === categoria))
      )
    );
  });
  marcarCategoriaActiva(listaCategorias.querySelector("a"));
};

const formularioBusqueda = document.querySelector(".seccion-busqueda form");
formularioBusqueda.addEventListener("submit", (e) => {
  e.preventDefault();
  const termino = document.getElementById("buscar").value.trim().toLowerCase();
  marcarCategoriaActiva(listaCategorias.querySelector("a"));
  const filtrados = termino === ""
    ? productos
    : productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(termino) ||
          p.descripcion.toLowerCase().includes(termino)
      );
  renderizarProductos(filtrados);
});

cargarCategorias();
renderizarProductos(productos);
