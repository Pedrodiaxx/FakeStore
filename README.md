# Mini Desk Store — Mobile Technical Assessment

Aplicación móvil de catálogo y carrito de compras desarrollada con **React Native**, **Expo** y **TypeScript**, consumiendo la API pública [Fake Store API](https://fakestoreapi.com/).

---

## Evidencia Visual del Flujo

| 1. Catálogo sincronizado | 2. Detalle dinámico | 3. Resumen del Carrito | 4. Confirmación de Pago |
| :---: | :---: | :---: | :---: |
| [./assets/screenshots/01-catalogo.jpg] | [./assets/screenshots/02-detalle.jpg] | [./assets/screenshots/03-carrito.jpg] | [./assets/screenshots/04-pago-exito.jpg] |

---

## Tecnologías y Versiones

* **Node.js:** v20+ / v22 (LTS)
* **Expo SDK:** 57 (Expo Router v4)
* **React Native:** 0.76+
* **Gestor de Estado:** Zustand
* **Lenguaje:** TypeScript (strict mode)

---

## Cómo Instalar y Correr el Proyecto

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Pedrodiaxx/FakeStore.git
   cd FakeStore
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   * Modo túnel (Recomendado para Expo Go en red externa o cortafuegos):
     ```bash
     npx expo start --tunnel
     ```
   * Modo local LAN:
     ```bash
     npx expo start
     ```

4. **Visualizar la aplicación:**
   * Escanea el código QR desde la aplicación Expo Go en un dispositivo físico iOS o Android.
   * Alternativamente, presiona `w` en la consola para previsualizar en el navegador web.

---

## Arquitectura y Organización del Proyecto

El proyecto implementa los principios de Clean Architecture adaptados al patrón MVVM (Model-View-ViewModel) en el frontend móvil:

```plaintext
mini-desk-store/
├── assets/
│   └── screenshots/         # Evidencia visual del flujo en dispositivo real
├── src/
│   ├── app/                 # [VIEW: Rutas y stacks de Expo Router]
│   │   ├── _layout.tsx      # Stack raíz y cabecera con CartBadge persistente
│   │   ├── index.tsx        # Pantalla 1: Catálogo y estados de carga/error
│   │   ├── product/
│   │   │   └── [id].tsx     # Pantalla 2: Detalle dinámico
│   │   ├── cart.tsx         # Pantalla 3: Resumen del carrito y subtotales
│   │   └── checkout.tsx     # Pantalla 4: Checkout mock y pantalla de éxito
│   ├── models/              # [MODEL: Contratos estrictos de TypeScript]
│   │   ├── product.model.ts # Tipos de la API (Product, Rating)
│   │   └── cart.model.ts    # Modelo indexado de carrito (CartItem, CartMap)
│   ├── services/            # [DATA LAYER: Consumo de API y Caché]
│   │   └── api.service.ts   # Cliente HTTP fetch y caché en memoria con TTL
│   ├── store/               # [DOMAIN LAYER: Estado centralizado]
│   │   └── cart.store.ts    # Store de Zustand con mutaciones inmutables O(1)
│   ├── hooks/               # [VIEWMODEL: Lógica de negocio y selectores]
│   │   ├── useProducts.ts   # Ciclo de vida y reintentos del catálogo
│   │   └── useCart.ts       # Cálculos derivados, totales y selectores atómicos
│   └── components/          # [VIEW: Componentes desacoplados]
│       ├── ProductCard.tsx     # Tarjeta memoizada para rendimiento de lista
│       ├── QuantityControl.tsx # Controles sincronizados (+ / −)
│       └── CartBadge.tsx       # Indicador persistente del carrito
```

---

## Justificación de Decisiones Técnicas

### 4.1 Manejo de Estado Global: Zustand vs. Redux

* **Elección:** Se eligió Zustand.
* **Por qué Zustand:**
  * **Cero boilerplate:** No requiere envolver el árbol de componentes en Providers anidados (`<Provider store={store}>`), ni definir actions, reducers o slices extensos.
  * **Ligereza en el bundle:** Zustand añade ~1.5 KB al peso de la app, frente a los más de 30 KB que agrega el ecosistema Redux Toolkit + React-Redux.
  * **Suscripciones atómicas por selector:** Permite que un componente escuche exclusivamente una propiedad del store (`state.items[productId]?.quantity`), evitando renderizados innecesarios en componentes hermanos.
* **Bajo qué circunstancias habría elegido Redux (RTK):**
  * En equipos grandes con múltiples squads donde se necesita forzar una convención arquitectónica estricta y predecible.
  * En aplicaciones que requieran auditoría exhaustiva o depuración avanzada (time-travel debugging) con Redux DevTools y middlewares complejos.
* **Qué información vive en el estado global y qué no:**
  * **En el estado global:** Exclusivamente las líneas del carrito (`items: Record<number, CartItem>`) y sus acciones mutadoras (`addItem`, `decrementItem`, `removeItem`, `clearCart`). Esta información debe sincronizarse en tiempo real entre el catálogo, el detalle, la cabecera y el resumen de compra.
  * **Fuera del estado global:** El catálogo de productos pertenece al Server State (gestionado en la capa de servicios con caché). Los estados efímeros de UI (campos de texto del checkout, modales o indicadores de carga locales) residen en el estado local (`useState`) de cada pantalla para evitar re-renders en vistas ajenas.
* **Consideraciones de rendimiento con controles repartidos en 3 pantallas:**
  * **Estructura tipo Hash Map:** El carrito se modeló como un diccionario indexado por ID (`Record<number, CartItem>`). Esto permite consultar y actualizar cantidades en tiempo constante $O(1)$ sin recorrer listas con `.find()` en cada render.
  * **Memoización con React.memo:** La tarjeta `ProductCard` está envuelta en `React.memo`. Al pulsar + o − en un producto, solo se re-renderiza esa tarjeta en la `FlatList`, manteniendo las demás intactas.
  * **Selectores atómicos:** El indicador de cabecera (`CartBadge`) solo se suscribe al número total acumulado, sin reaccionar a cambios internos de las descripciones o imágenes de los productos.

### 4.2 Navegación y Rutas Dinámicas: Expo Router vs. React Navigation Legacy

* **Elección:** Se implementó Expo Router (sistema de rutas basado en archivos).
* **Justificación:**
  * **Deep Linking nativo:** Cumple de forma inmediata el requisito 3.3 ("La ruta debe funcionar correctamente aunque se abra directamente sin pasar por el listado"). Con React Navigation tradicional, esto habría requerido registrar manualmente un esquema de URLs imperativo (`linking: { prefixes: [...], config: { ... } }`).
  * **Estructura declarativa:** La estructura de carpetas define directamente la jerarquía de rutas (`/product/[id]`, `/cart`, `/checkout`), eliminando archivos masivos de configuración de stacks.
* **Manejo de parámetros y flujo de navegación:**
  * La pantalla de detalle consume el parámetro dinámico mediante `useLocalSearchParams<{ id: string }>()`. Si el usuario accede directo a `product/5`, el hook `useProductDetail` consulta la API o la caché de forma autónoma.
  * Al confirmar el pago en `/checkout`, se utiliza `router.dismissAll()` y se añade un listener a `BackHandler` en Android. Esto vacía por completo el historial de navegación hacia la raíz (`/`), impidiendo que el botón o gesto de volver atrás regrese a una orden ya procesada.

### 4.3 Caché del Lado del Cliente

* **Estrategia configurada:** Se implementó una caché en memoria con TTL (Time-To-Live) de 5 minutos (300,000 ms) en `api.service.ts`.
* **Por qué esos valores:** Un catálogo de comercio electrónico es de lectura intensiva y no cambia cada segundo. 5 minutos es un tiempo suficiente para evitar peticiones redundantes mientras el usuario navega entre pantallas, sin arriesgarse a mostrar precios obsoletos.
* **Pre-alimentación de detalles:** Al consultar el catálogo general (`getProducts`), el servicio puebla simultáneamente la caché de detalles individuales (`productDetailCache`). Cuando el usuario toca una tarjeta, el detalle abre de forma instantánea sin mostrar pantallas de carga adicionales.
* **Criterio de qué cachear:**
  * **Se cachea:** El catálogo y los detalles devueltos por la API (Server State).
  * **No se cachea:** El estado del carrito y el checkout, ya que son datos transaccionales de alta reactividad en tiempo real.
* **Resiliencia ante fallos:** Si la API pública de Fake Store experimenta caídas intermitentes, el servicio retorna la versión previa en memoria como respaldo (fallback), garantizando disponibilidad.

### 4.4 Custom Hooks (ViewModels)

Se diseñaron dos hooks principales con responsabilidades desacopladas:
* **useProducts y useProductDetail:**
  * **Problema que resuelve:** Desacopla las peticiones de red y la gestión asíncrona de las pantallas. Provee estados reactivos de `loading`, `error`, `data` y una función `refetch` para reintentos en fallos de red.
* **useCart:**
  * **Problema que resuelve:** Centraliza los cálculos de negocio derivados del carrito (conversión a arreglo para `FlatList`, conteo total para el badge y suma monetaria total con dos decimales). Evita duplicar matemáticas en 3 pantallas distintas y previene cálculos redundantes mediante `useMemo`.

### 4.5 Capa de Datos y Peticiones a la API

* **Elección:** API nativa `fetch` de JavaScript.
* **Justificación:** Para consumir una API REST pública basada en GET, `fetch` es suficiente, viene integrado en el runtime de React Native y no agrega peso extra al paquete final (0 KB adicionales).
* **Manejo de errores:** Centralizado en `api.service.ts` mediante bloques `try/catch` que evalúan el código de respuesta HTTP (`response.ok`) y transforman fallos de red o errores de servidor en mensajes descriptivos para el usuario, integrados con una UI de reintento.

### 4.6 Calidad General

* **TypeScript en modo estricto:** Interfaces dedicadas para cada entidad (`Product`, `CartItem`, `CartMap`).
* **Clean Code:** Eliminación total de código de plantilla no utilizado (dead code), sin advertencias ni errores en el compilador.
* **UX móvil cuidada:** Manejo de estados de carga (`ActivityIndicator`), estados vacíos informativos, botones táctiles con opacidad activa y bloqueo del botón físico de retroceso tras finalizar la compra.

---

## Qué se Dejó Fuera y Mejoras Futuras

* **Persistencia offline permanente:** Almacenar el carrito en el dispositivo usando `@react-native-async-storage/async-storage` o `react-native-mmkv` para conservar los productos seleccionados si el usuario cierra la aplicación.
* **Filtrado y ordenamiento:** Búsqueda en tiempo real por texto y filtrado por categorías de la Fake Store API (electrónica, joyería, ropa).
* **Pruebas automatizadas:** Cobertura de pruebas unitarias para el store de Zustand y los custom hooks usando Jest y `@testing-library/react-native`.
* **Skeletons de carga:** Reemplazar el `ActivityIndicator` por pantallas de carga tipo skeleton para una experiencia visual aún más fluida.
