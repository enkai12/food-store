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
const categorias = ["Hamburguesas", "Lomos", "Pizzas", "Papas Fritas", "Bebidas"];

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
const formatearPrecio = (precio) => precio.toLocaleString("es-AR");

// ------------------------------------------------------------
// PRODUCTOS
// Array de objetos: cada elemento es un producto con sus
// propiedades. Un Objeto agrupa datos relacionados en pares
// clave: valor. Se declara con {}.
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
const productos = [
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
