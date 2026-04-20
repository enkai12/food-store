const cargarCategorias = () => {
  const lista = document.getElementById("lista-categorias");
  categorias.forEach((categoria) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#">${categoria}</a>`;
    lista.appendChild(li);
  });
};

const cargarProductos = () => {
  const contenedor = document.getElementById("contenedor-productos");
  productos.forEach((producto) => {
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
          <button onclick="alert('${producto.nombre}')">Agregar</button>
        </div>
      </div>
    `;
    contenedor.appendChild(article);
  });
};

cargarCategorias();
cargarProductos();
