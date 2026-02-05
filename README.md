# E-commerce API & Fullstack

Este es un proyecto de comercio electrónico robusto construido con una arquitectura limpia y modular. El sistema está diseñado para ser escalable, utilizando Node.js en el backend y una futura integración con React en el frontend.

## 🚀 Tecnologías Utilizadas

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
- **Autenticación:** [JWT (JSON Web Tokens)](https://jwt.io/) & [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Validación:** [Zod](https://zod.dev/)

## 🏗️ Arquitectura y Estándares

El proyecto sigue un **Patrón de Capas** para asegurar la separación de responsabilidades:

- **Routes:** Definición de endpoints y ruteo.
- **Controllers:** Manejo de la interfaz HTTP (peticiones y respuestas).
- **Services:** Contiene la lógica de negocio pura.
- **Middlewares:** Manejo de errores centralizado y validaciones de seguridad.

## 🛠️ Configuración Local

### Prerrequisitos
- Node.js (v18 o superior recomendado)
- PostgreSQL
- NPM o Yarn

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd e-commerce
   ```

2. **Configurar el Backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Variables de Entorno:**
   Crea un archivo `.env` en la carpeta `backend/` basado en el siguiente ejemplo:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ecommerce_db?schema=public"
   JWT_SECRET="tu_secreto_super_seguro"
   PORT=3000
   ```

4. **Configuración de la Base de Datos (Prisma):**
   ```bash
   npx prisma generate
   # Para ejecutar migraciones una vez definidos los modelos
   # npx prisma migrate dev --name init
   ```

### Ejecutar en Desarrollo
Actualmente el proyecto utiliza `tsx` para la ejecución de TypeScript:
```bash
npm run dev # (Asegúrate de tener definido este script en package.json o usa npx tsx src/server.ts)
```

## 📂 Estructura del Proyecto

```text
e-commerce/
├── backend/            # Lógica del servidor, API y base de datos
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── ...
│   └── prisma/         # Esquemas de base de datos
├── frontend/           # Aplicación cliente (Próximamente)
└── README.md
```

## 👤 Autor
- **Santiago Aranda** - *Backend/Fullstack Developer*

---
Desarrollado con enfoque en código modular y tipado fuerte.
