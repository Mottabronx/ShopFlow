# ShopFlow 🛍

Tienda de ropa online full stack construida con React y Node.js. Incluye catálogo con filtros, carrito de compras, página de detalle de producto y checkout con guardado de pedidos.

## Stack

**Frontend:** React 18 · Vite · React Router · CSS Modules  
**Backend:** Node.js · Express · JSON (persistencia)

## Funcionalidades

- Catálogo de productos con filtros por categoría, precio y colección
- Página de detalle con galería de imágenes, selección de talla y color
- Carrito de compras con control de cantidades (Context API + useReducer)
- Checkout con formulario de pago y pantalla de confirmación
- Pedidos guardados automáticamente en el servidor
- Productos relacionados en la página de detalle
- Diseño responsive

## Estructura del proyecto

```
shopflow/
├── frontend/           ← React + Vite
│   └── src/
│       ├── components/ ← Navbar, ProductCard
│       ├── context/    ← CartContext
│       ├── pages/      ← Catalog, ProductDetail, Cart, Checkout
│       └── services/   ← api.js
└── backend/            ← Node.js + Express
    ├── data/
    │   ├── products.json
    │   └── orders.json  ← se genera automáticamente
    └── server.js
```

## Cómo correr el proyecto

### Requisitos
- Node.js v18 o superior

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

El servidor queda corriendo en `http://localhost:3001`

### 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`

> El frontend hace proxy automático al backend, así que no necesitas configurar nada extra.

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Todos los productos |
| GET | `/api/products?category=x&maxPrice=y&sort=z` | Productos con filtros |
| GET | `/api/products/:id` | Producto por ID + relacionados |
| GET | `/api/categories` | Categorías disponibles |
| GET | `/api/orders` | Todos los pedidos guardados |
| GET | `/api/orders/:id` | Pedido por ID |
| POST | `/api/checkout` | Procesar y guardar pedido |

## Notas

- El checkout es una simulación — no se procesa ningún pago real. Para producción se puede integrar Flow, Transbank o Stripe.
- Los pedidos se guardan en `backend/data/orders.json` y persisten entre reinicios del servidor.
- Las imágenes de los productos vienen de Unsplash y requieren conexión a internet.
