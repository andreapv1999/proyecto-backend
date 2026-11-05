# Proyecto Backend - Node.js

## 1. Descripción

API REST desarrollada con Node.js, Express y MongoDB para gestionar usuarios y publicaciones.

El proyecto permite registrar usuarios, iniciar sesión, gestionar publicaciones y subir imágenes a Cloudinary. Incluye autenticación mediante JWT, control de permisos y operaciones CRUD completas.

## 2. Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- Bcryptjs
- Multer
- Cloudinary
- Dotenv
- Cors

## 3. Estructura del proyecto

```text
PROYECTO-BACKEND/
│
├── src/
│   ├── config/
│   │   └── cloudinary.js
│   │
│   ├── controllers/
│   │   ├── postController.js
│   │   └── userController.js
│   │
│   ├── middlewares/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Post.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── postRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── seeds/
│   │   └── postSeed.js
│   │
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 4. Instalación

Clonar el repositorio:

```bash
git clone https://github.com/andreapv1999/proyecto-backend.git
```

Entrar en la carpeta del proyecto:

```bash
cd proyecto-backend
```

Instalar las dependencias:

```bash
npm install
```

## 5. Variables de entorno

Crear un archivo `.env` en la raíz del proyecto y configurar las siguientes variables:

```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

Es necesario introducir las credenciales correspondientes de MongoDB Atlas y Cloudinary.

**Importante:** el archivo `.env` contiene información privada y no debe subirse a GitHub.

## 6. Ejecución del proyecto

Iniciar el servidor:

```bash
npm start
```

El servidor estará disponible en:

```text
http://localhost:3000
```

Ejecutar la semilla para insertar publicaciones de ejemplo:

```bash
npm run seed
```

La semilla comprueba si ya existen publicaciones para evitar insertar duplicados.

## 7. Modelos de datos

### User

El modelo User almacena la información de los usuarios:

- Nombre.
- Correo electrónico.
- Contraseña cifrada.
- Rol (user o admin).
- Array de publicaciones relacionadas.

La contraseña se almacena cifrada mediante Bcryptjs.

### Post

El modelo Post almacena la información de las publicaciones:

- Título.
- Contenido.
- Autor relacionado con User.
- Imagen almacenada en Cloudinary.
- Fecha de creación y actualización.

Los modelos User y Post están relacionados mediante referencias de Mongoose.

## 8. Endpoints de la API

### Usuarios

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/users/register` | Registrar usuario | Público |
| POST | `/users/login` | Iniciar sesión | Público |
| GET | `/users` | Obtener todos los usuarios | Administrador |
| GET | `/users/:id` | Obtener un usuario | Autenticado |
| PUT | `/users/:id` | Actualizar un usuario | Propietario o administrador |
| DELETE | `/users/:id` | Eliminar un usuario | Propietario o administrador |

### Publicaciones

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/posts` | Obtener todas las publicaciones | Público |
| GET | `/posts/:id` | Obtener una publicación | Público |
| POST | `/posts` | Crear una publicación | Autenticado |
| PUT | `/posts/:id` | Actualizar una publicación | Autor o administrador |
| DELETE | `/posts/:id` | Eliminar una publicación | Autor o administrador |

## 9. Ejemplos de uso

### Registrar un usuario

**POST** `/users/register`

```json
{
  "name": "Usuario de prueba",
  "email": "usuario@example.com",
  "password": "Password123"
}
```

### Iniciar sesión

**POST** `/users/login`

```json
{
  "email": "usuario@example.com",
  "password": "Password123"
}
```

La respuesta devuelve un token JWT que permite acceder a las rutas protegidas.

### Crear una publicación

**POST** `/posts`

La petición debe incluir:

- Título.
- Contenido.
- Imagen opcional.

La imagen se envía mediante `multipart/form-data`, utilizando el campo `image`.

Para las rutas protegidas se debe incluir el token en la cabecera:

```text
Authorization: Bearer TOKEN
```

## 10. Autenticación y permisos

La API utiliza JWT para autenticar a los usuarios.

Los permisos se organizan mediante dos roles:

- **User:** puede gestionar su