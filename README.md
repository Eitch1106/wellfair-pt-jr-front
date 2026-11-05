# Well Fair TMDb — Frontend

Aplicación web de consulta de películas construida con **Angular 21** y **Angular Material**, que consume el backend propio (Spring Boot 4.1.2) como proxy hacia la API pública de [The Movie Database (TMDb)](https://www.themoviedb.org/).

---

## Tecnologías

| Tecnología | Versión | Rol |
|------------|---------|-----|
| Angular | 21 | Framework SPA principal |
| Angular Material | 21 | Componentes UI (cards, dialogs, paginator, chips) |
| Angular CLI | 21.2.29 | Scaffolding, servidor de desarrollo y build |

No se usa ninguna librería de terceros más allá del ecosistema Angular. Sin Redux, sin NgRx, sin librerías de componentes externas.

---
## Arquitectura del proyecto

El proyecto sigue la guía de estilos oficial de Angular con una estructura **feature-based**:

```
src/app/
├── core/                   ← Singletons globales
│   ├── interceptors/       ← Manejo centralizado de errores HTTP
│   ├── models/             ← Interfaces TypeScript
│   └── services/           ← Lógica de negocio y llamadas HTTP
│
├── shared/                 ← Componentes y pipes reutilizables
│   ├── components/
│   │   ├── movie-card/            ← Tarjeta de película
│   │   ├── movie-detail-modal/    ← Modal de detalle completo
│   │   ├── loading-skeleton/      ← Skeleton animado de carga
│   │   └── empty-state/           ← Pantalla de "sin resultados"
│   └── pipes/
│       └── rating-color.pipe.ts   ← Color dinámico por calificación(como en sitios de películas)
│
├── features/               ← Pantallas (lazy loaded)
│   ├── home/               ← Popular + búsqueda + filtro por género
│   ├── top-rated/          ← Mejor calificadas
│   └── favorites/          ← Favoritos (localStorage)
│
├── layout/                 ← Navbar y footer globales
│   ├── navbar/
│   └── footer/
│
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```
---

## Requisitos previos

- **Node.js 20+** — [descargar](https://nodejs.org/)
- **npm 10+** (incluido con Node)
- **Angular CLI 21**
- **Backend corriendo** en `http://localhost:8080`

Verifica versiones:
```bash
node -v   # >= 20
npm -v    # >= 10
ng version
```

---

## Instalación y ejecución

### 1. Clona e instala dependencias

```bash
git clone
npm install
```

### 2. Configura la URL del backend

El archivo `src/environments/environment.dev.ts` apunta al backend por defecto:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/v1'
};
```

Si tu backend corre en otro puerto, edita `apiBaseUrl` antes de levantar.

### 3. Levanta el servidor de desarrollo

```bash
ng serve
```

Abre el navegador en `http://localhost:4200/`.  
La app recarga automáticamente al guardar cualquier archivo.

> ⚠️ **El backend debe estar corriendo antes de levantar el frontend.** Si el backend no responde, la app mostrará un snackbar de error de conexión.

---

## Conexión con el backend

Toda comunicación HTTP pasa por `MovieService` (`core/services/movie.service.ts`). La URL base se toma del archivo `environment.ts`, por lo que cambiar de ambiente no requiere modificar ningún servicio.

| Variable | Desarrollo |
|----------|-----------|
| `apiBaseUrl` | `http://localhost:8080/v1` 

No hay tokens ni credenciales en el frontend — la autenticación hacia TMDb es responsabilidad exclusiva del backend.

---

*Desarrollado por [Irvin G.C.] — Prueba técnica Well Fair, noviembre 2026.*
