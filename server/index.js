// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Puerto del servidor, toma de .env o 3000 por defecto

// Middleware para habilitar CORS
// Es importante configurar CORS correctamente para tu frontend
// En desarrollo, puedes permitir todo (*), pero en producción, especifica tus dominios.
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // Permite solicitudes desde tu frontend de Vite
    methods: ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// --- 1. Endpoint de Health Check ---
// Este endpoint es el que tu frontend llamará para verificar si el servidor está activo.
app.head('/health', (req, res) => {
    // Un simple HEAD request que responde 200 OK si el servidor está corriendo
    // No necesita enviar ningún cuerpo de respuesta para HEAD
    res.sendStatus(200);
});

// También puedes añadir un GET /health para depuración si lo necesitas
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is up and running!' });
});


// --- 2. Endpoint de Login (simulado) ---
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Lógica de autenticación muy básica y simulada
    if (email === 'user@example.com' && password === 'password123') {
        // En un caso real, aquí generarías un token JWT
        return res.status(200).json({ message: 'Login successful', token: 'fake-jwt-token-123' });
    } else if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    } else {
        // Si las credenciales no coinciden con las simuladas
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

// --- 3. Endpoint de Registro (simulado) ---
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Lógica de registro muy básica y simulada
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Simula que el usuario ya existe para un email específico
    if (email === 'existing@example.com') {
        return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Simula un registro exitoso
    console.log(`User registered: ${email}`);
    res.status(201).json({ message: 'User registered successfully!' });
});

// Manejador de errores general (opcional, pero buena práctica)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access at http://localhost:${PORT}`);
});