# Proyecto Backend - Node.js

## Descripción

API REST desarrollada con Node.js, Express y MongoDB para gestionar usuarios y publicaciones.

El proyecto incluye autenticación mediante JWT, diferentes roles de usuario, operaciones CRUD y gestión de imágenes mediante Cloudinary.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- Bcryptjs
- Multer
- Cloudinary
- Dotenv
- CORS

## Instalación

1. Clonar o descargar el proyecto.
2. Instalar las dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en la raíz del proyecto.
4. Configurar las variables de entorno:

```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## Ejecución

Iniciar el servidor:

```bash
npm start
```

Ejecutar la semilla de datos:

```bash
npm run seed
```

## Modelos

### User

Gestiona los usuarios con nombre, correo electrónico, contraseña, rol y publicaciones relacionadas.

### Post

Gestiona las publicaciones con título, contenido, autor e imagen.

Los modelos están relacionados mediante referencias de Mongoose.

## Endpoints

### Usuarios

| Método | Ruta | Descripción |
|---|---|---|
| POST | /users/register | Registrar usuario |
| POST | /users/login | Iniciar sesión |
| GET | /users | Obtener todos los usuarios (administrador) |
| GET | /users/:id | Consultar un usuario |
| PUT | /users/:id | Actualizar un usuario |
| DELETE | /users/:id | Eliminar un usuario |

### Publicaciones

| Método | Ruta | Descripción |
|---|---|---|
| GET | /posts | Obtener todas las publicaciones |
| GET | /posts/:id | Obtener una publicación |
| POST | /posts | Crear una publicación |
| PUT | /posts/:id | Actualizar una publicación |
| DELETE | /posts/:id | Eliminar una publicación |

Las operaciones protegidas requieren un token JWT en la cabecera Authorization con formato:

`Bearer token`

La creación y actualización de publicaciones permiten enviar imágenes mediante `multipart/form-data`.

## Ejemplos de uso

### Registrar usuario

**POST /users/register**

```json
{
  "name": "Usuario Prueba",
  "email": "usuario@email.com",
  "password": "Prueba123"
}
```

### Iniciar sesión

**POST /users/login**

```json
{
  "email": "usuario@email.com",
  "password": "Prueba123"
}
```

La respuesta devuelve un token JWT que debe utilizarse para acceder a las rutas protegidas.

### Crear publicación

**POST /posts**

Enviar los campos `title` y `content`, y opcionalmente una imagen con el campo `image`.

## Roles y permisos

- Los usuarios normales pueden gestionar sus propias publicaciones.
- Los administradores pueden gestionar publicaciones de otros usuarios.
- Los usuarios solo pueden consultar, modificar y eliminar su propia cuenta.
- Los administradores pueden consultar y gestionar otros usuarios.

## Imágenes

Las imágenes se almacenan en Cloudinary.

Cuando se actualiza o elimina una publicación, también se gestiona la imagen asociada.

## Semilla

El proyecto incluye una semilla para insertar publicaciones de ejemplo evitando duplicados.

Las publicaciones se asocian a un usuario existente.

## Seguridad

- Las contraseñas se almacenan cifradas mediante bcryptjs.
- La autenticación se realiza mediante JWT.
- Las rutas protegidas verifican los permisos del usuario.
- El archivo `.env` contiene información privada y no debe subirse a GitHub.

## Autor

Proyecto Backend desarrollado como práctica de aprendizaje de Node.js, Express y MongoDB.