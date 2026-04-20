const renderizarProductos = (lista) => {
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = "";
  lista.forEach((producto) => {
    const article = document.createElement("article");
    article.className = "tarjeta-producto";
    article.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" />
      <div class="tarjeta-producto__contenido">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio"><strong>$${producto.precio.toLocaleString("es-AR")}</strong></p>
        <div class="tarjeta-producto__botones">
          <button>Ver Detalles</button>
          <button class="btn-agregar">Agregar</button>
        </div>
      </div>
    `;
    article.querySelector(".btn-agregar").addEventListener("click", () => {
      alert(producto.nombre);
    });
    contenedor.appendChild(article);
  });
};

const marcarCategoriaActiva = (enlace) => {
  document.querySelectorAll("#lista-categorias a").forEach((a) => a.classList.remove("categoria-activa"));
  enlace.classList.add("categoria-activa");
};

const cargarCategorias = () => {
  const lista = document.getElementById("lista-categorias");

  const liTodas = document.createElement("li");
  liTodas.innerHTML = `<a href="#">Todas</a>`;
  liTodas.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    marcarCategoriaActiva(e.currentTarget);
    renderizarProductos(productos);
  });
  lista.appendChild(liTodas);

  categorias.forEach((categoria) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = categoria;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      marcarCategoriaActiva(e.currentTarget);
      const filtrados = productos.filter((p) => p.categoria === categoria);
      renderizarProductos(filtrados);
    });
    li.appendChild(a);
    lista.appendChild(li);
  });

  marcarCategoriaActiva(lista.querySelector("a"));
};

const cargarProductos = () => {
  renderizarProductos(productos);
};

const formularioBusqueda = document.querySelector(".seccion-busqueda form");
formularioBusqueda.addEventListener("submit", (e) => {
  e.preventDefault();
  const termino = document.getElementById("buscar").value.trim().toLowerCase();
  marcarCategoriaActiva(document.querySelector("#lista-categorias a"));
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
cargarProductos();
