const claseDeStock = (stock) => (stock === 0 ? "stock-cero" : "stock-ok");

const cargarTabla = (lista) => {
  const cuerpo = document.getElementById("cuerpo-tabla");
  cuerpo.innerHTML = "";
  lista.forEach((producto) => {
    const tr = document.createElement("tr");
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
    cuerpo.appendChild(tr);
  });
};

const cargarSelectCategorias = () => {
  const select = document.getElementById("select-categoria");
  select.innerHTML = `<option value="">Seleccione una opción...</option>`;
  categorias.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    select.appendChild(option);
  });
};

const formularioAdmin = document.querySelector(".form-producto");
formularioAdmin.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre-producto").value.trim();
  const categoria = document.getElementById("select-categoria").value;
  const precio = Number(document.getElementById("precio").value);
  const stock = Number(document.getElementById("stock").value);
  const descripcion = document.getElementById("descripcion").value.trim();
  const iniciales = nombre.slice(0, 2).toUpperCase();
  const id = Math.max(...productos.map((p) => p.id)) + 1;

  const nuevoProducto = {
    id,
    nombre,
    descripcion,
    precio,
    imagen: `https://placehold.co/50x50/FF6347/white?text=${encodeURIComponent(iniciales)}`,
    categoria,
    stock,
  };

  productos.push(nuevoProducto);
  cargarTabla(productos);
  formularioAdmin.reset();
  document.querySelector(".seccion-formulario details").removeAttribute("open");
  alert(`Producto "${nombre}" agregado correctamente.`);
});

cargarSelectCategorias();
cargarTabla(productos);
