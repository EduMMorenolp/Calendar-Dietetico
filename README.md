# Calendar-Dietetico

## 🧩 Arquitectura del Proyecto
### 🔐 Autenticación
- Login y registro de usuarios.
- Guardar sesión (tokens o localStorage).

### 🗓️ Calendario Interactivo
1. Grilla por semana: días (Lunes a Domingo) x categorías (Actividad física, Cuota de placer, etc).
2. Cada celda:
- 📸 Subida de foto.
- 📝 Comentario de texto.
- ✅ Marca en verde cuando está completa.

### 📤 Envío de Datos
- Botón “Mandar información” se activa al completar todas las casillas.
1. Se genera resumen con:
- Texto + imagen por celda.
2. Opciones:
- Enviar por WhatsApp Web.
- Enviar por correo electrónico.

### ☁️ Base de datos y backend
- Backend con Node.js + Express.
- Base de datos: MongoDB (flexible para este tipo de datos).
- Almacenamiento de imágenes: Cloudinary (o disco del servidor si es local).

### ⚙️ Stack Tecnológico
| Componente      | Tecnología                          |
| --------------- | ----------------------------------- |
| Frontend        | Vite + React + Tailwind             |
| Autenticación   | JWT + bcrypt                        |
| Backend         | Node.js + Express                   |
| Base de datos   | MongoDB (Mongoose)                  |
| Subida de fotos | Cloudinary (via API)                |
| Envío de correo | Nodemailer (backend)                |
| WhatsApp        | Web API (`https://wa.me/?text=...`) |

### 📁 Estructura de Carpetas
```bash
📦 proyecto-calendario
┣ 📂 client
┃ ┣ 📂 src
┃ ┃ ┣ 📂 components
┃ ┃ ┣ 📂 pages
┃ ┃ ┣ 📂 context
┃ ┃ ┣ 📂 hooks
┃ ┃ ┣ 📂 services (peticiones al backend)
┃ ┃ ┗ App.jsx, main.jsx
┣ 📂 server
┃ ┣ 📂 controllers
┃ ┣ 📂 models
┃ ┣ 📂 routes
┃ ┣ 📂 middlewares
┃ ┣ 📄 app.js, index.js
┣ 📄 .env
┣ 📄 README.md
```