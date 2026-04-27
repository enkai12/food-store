// ============================================================
// DATA.JS — Base de datos local del proyecto
// ============================================================
// Este archivo simula lo que en una app real sería una base de
// datos o una API. Acá guardamos todos los datos "en crudo":
// las categorías y los productos. Separarlo del resto del código
// tiene una ventaja enorme: si mañana querés agregar un producto
// o cambiar un precio, solo tocás este archivo y el resto del
// sitio se actualiza solo automáticamente.
// ============================================================

// ------------------------------------------------------------
// CATEGORÍAS
// Array de strings: cada elemento es el nombre de una categoría.
// Un Array es una lista ordenada de valores. Se declara con [].
// Usamos const porque esta lista no va a ser reasignada —
// aunque podemos modificar su contenido, la variable siempre
// apunta al mismo array.
// ------------------------------------------------------------
export const categorias = ["Hamburguesas", "Lomos", "Pizzas", "Papas Fritas", "Bebidas"];

// ------------------------------------------------------------
// FORMATEARPRECIO — Utilidad de formato de moneda
// Convierte un número (ej: 25000) a una cadena con formato
// local argentino (ej: "25.000").
// toLocaleString("es-AR") aplica las reglas de Argentina:
//   - punto como separador de miles (25.000)
//   - coma como separador decimal (1.500,50)
// Definirlo como función evita repetir "toLocaleString("es-AR")"
// en cada lugar donde se muestra un precio.
// ------------------------------------------------------------
export const formatearPrecio = (precio) => precio.toLocaleString("es-AR");

// ------------------------------------------------------------
// STORAGE_KEY — clave usada para leer y escribir en localStorage
// Definirla como constante en un solo lugar evita errores de
// tipeo: si escribís mal la clave al guardar y al leer, los
// datos nunca coinciden. Con esta const ambas operaciones usan
// exactamente la misma cadena.
// ------------------------------------------------------------
export const STORAGE_KEY = "food_store_productos";

// ------------------------------------------------------------
// PRODUCTOSINCIALES — datos de fábrica del catálogo
// Este array define el catálogo base que se carga la primera
// vez que el usuario abre la app (cuando localStorage está vacío).
// Lo renombramos para distinguirlo del array "productos" que
// el resto del código usa, que puede venir de localStorage.
// Campos de cada producto:
//   id          → identificador único numérico
//   nombre      → nombre para mostrar en pantalla
//   descripcion → texto descriptivo del producto
//   precio      → número entero en pesos argentinos
//   imagen      → ruta relativa desde index.html hasta la imagen
//   categoria   → debe coincidir EXACTAMENTE con un valor del
//                 array "categorias" para que el filtro funcione
//   stock       → cantidad disponible (0 = sin stock)
// ------------------------------------------------------------
export const productosIniciales = [
  {
    id: 1,
    nombre: "Hamburguesa Triple",
    descripcion: "Hamburguesa triple smash con mucho cheddar.",
    precio: 25000,
    imagen: "./assets/burger_triple.webp",
    categoria: "Hamburguesas",
    stock: 12,
  },
  {
    id: 2,
    nombre: "Hamburguesa Doble",
    descripcion: "Doble medallón de carne con queso y salsa especial.",
    precio: 19000,
    imagen: "./assets/burger_doble.webp",
    categoria: "Hamburguesas",
    stock: 15,
  },
  {
    id: 3,
    nombre: "Lomito Completo",
    descripcion: "Lomito con jamón, queso, lechuga, tomate y huevo.",
    precio: 22000,
    imagen: "./assets/lomo_completo.webp",
    categoria: "Lomos",
    stock: 8,
  },
  {
    id: 4,
    nombre: "Lomito Especial",
    descripcion: "Lomito con bacon, cheddar fundido y cebolla caramelizada.",
    precio: 26000,
    imagen: "./assets/lomo_bacon.webp",
    categoria: "Lomos",
    stock: 6,
  },
  {
    id: 5,
    nombre: "Pizza Muzzarella",
    descripcion: "Salsa de tomate casera y muzzarella abundante.",
    precio: 18000,
    imagen: "./assets/pizza_muza.webp",
    categoria: "Pizzas",
    stock: 5,
  },
  {
    id: 6,
    nombre: "Pizza Napolitana",
    descripcion: "Muzzarella, rodajas de tomate, ajo y aceitunas verdes.",
    precio: 20000,
    imagen: "./assets/pizza_napo.webp",
    categoria: "Pizzas",
    stock: 4,
  },
  {
    id: 7,
    nombre: "Papas con Cheddar",
    descripcion: "Papas fritas crocantes con cheddar derretido y bacon.",
    precio: 8000,
    imagen: "./assets/papas_cheddar.webp",
    categoria: "Papas Fritas",
    stock: 0,
  },
  {
    id: 8,
    nombre: "Papas con Bacon",
    descripcion: "Papas fritas con bacon crocante y salsa barbacoa.",
    precio: 9500,
    imagen: "./assets/papas_bacon.webp",
    categoria: "Papas Fritas",
    stock: 10,
  },
  {
    id: 9,
    nombre: "Gaseosa Cola 500ml",
    descripcion: "Bebida gaseosa sabor cola, botella de 500ml.",
    precio: 3500,
    imagen: "./assets/coca.webp",
    categoria: "Bebidas",
    stock: 24,
  },
  {
    id: 10,
    nombre: "Agua Mineral 500ml",
    descripcion: "Agua mineral sin gas, botella de 500ml.",
    precio: 2000,
    imagen: "./assets/agua_mineral.webp",
    categoria: "Bebidas",
    stock: 30,
  },
  {
    id: 11,
    nombre: "Jugo de Naranja 500ml",
    descripcion: "Jugo de naranja natural exprimido, 500ml.",
    precio: 4500,
    imagen: "./assets/jugo_naranja.webp",
    categoria: "Bebidas",
    stock: 18,
  },
  {
    id: 12,
    nombre: "Limonada Casera 500ml",
    descripcion: "Limonada casera con menta y jengibre, 500ml.",
    precio: 4000,
    imagen: "./assets/limonada_casera.webp",
    categoria: "Bebidas",
    stock: 20,
  },
];

// ------------------------------------------------------------
// PRODUCTOS — array activo que usa toda la app
// Intentamos cargar los datos desde localStorage con getItem().
// Si no hay nada guardado, getItem() devuelve null; en ese caso
// el operador ?? (nullish coalescing) usa el fallback de la
// derecha: una copia del catálogo inicial.
//
// Por qué JSON.parse / JSON.stringify:
//   localStorage solo guarda strings. JSON.stringify convierte
//   el array de objetos a texto para guardarlo; JSON.parse lo
//   convierte de vuelta a array al leerlo.
//
// Por qué [...productosIniciales] y no productosIniciales:
//   El spread operator (...) crea una copia superficial del
//   array. Si usáramos el array original directamente y después
//   lo modificamos (push/splice), estaríamos mutando los datos
//   de fábrica, lo que podría causar bugs difíciles de rastrear.
// ------------------------------------------------------------
export const productos = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [...productosIniciales];

// ------------------------------------------------------------
// GUARDARPRODUCTOS — persiste el array actual en localStorage
// Se llama desde admin.js cada vez que se agrega o elimina un
// producto. Así el estado del catálogo sobrevive recargas de
// página: la próxima vez que cargue, JSON.parse recupera la
// versión guardada en vez del catálogo inicial.
// ------------------------------------------------------------
export const guardarProductos = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
};
