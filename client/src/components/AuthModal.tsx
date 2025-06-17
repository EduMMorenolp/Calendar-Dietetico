import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type FormStatus = 'idle' | 'checking' | 'active' | 'inactive' | 'submitting';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// URL de tu backend. ¡CAMBIA ESTA URL POR LA DE TU SERVIDOR!
// En un proyecto real, esto debería venir de variables de entorno (ej: import.meta.env.VITE_API_URL)
const API_BASE_URL = 'http://localhost:3000';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [view, setView] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    // --- Estados para manejar la lógica de conexión y reintentos ---
    const [serverStatus, setServerStatus] = useState<FormStatus>('checking');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const healthCheckIntervalRef = useRef<number | null>(null);

    // Función para comprobar la salud del servidor
    const checkServerHealth = async () => {
        try {
            // Intenta acceder a un endpoint de salud o incluso a la ruta base para ver si el servidor responde
            const response = await fetch(`${API_BASE_URL}/health`);

            if (response.ok) {
                console.log('Servidor activo.');
                return true; // Servidor activo
            } else {
                console.warn('Servidor respondió, pero no con estado OK:', response.status);
                return false; 
            }
        } catch (error) {
            console.error('Error al comprobar la salud del servidor:', error);
            // Esto captura errores de red (servidor caído, CORS no configurado, etc.)
            return false;
        }
    };

    // Efecto para iniciar la comprobación de salud y reintentos
    useEffect(() => {
        if (!isOpen) {
            // Si el modal está cerrado, limpiar cualquier intervalo y resetear estado
            if (healthCheckIntervalRef.current) {
                clearInterval(healthCheckIntervalRef.current);
                healthCheckIntervalRef.current = null;
            }
            setServerStatus('idle'); // O el estado que consideres apropiado cuando no está abierto
            return;
        }

        const initiateHealthCheck = async () => {
            setServerStatus('checking');
            const isActive = await checkServerHealth();
            if (isActive) {
                setServerStatus('active');
                if (healthCheckIntervalRef.current) {
                    clearInterval(healthCheckIntervalRef.current); // Limpiar si ya estaba reintentando
                    healthCheckIntervalRef.current = null;
                }
            } else {
                setServerStatus('inactive');
                // Si no está activo, empezar los reintentos
                if (!healthCheckIntervalRef.current) { // Solo si no hay un intervalo ya corriendo
                    healthCheckIntervalRef.current = setInterval(async () => {
                        console.log('Reintentando conexión...');
                        const retryIsActive = await checkServerHealth();
                        if (retryIsActive) {
                            setServerStatus('active');
                            if (healthCheckIntervalRef.current) {
                                clearInterval(healthCheckIntervalRef.current);
                                healthCheckIntervalRef.current = null;
                            }
                        } else {
                            setServerStatus('inactive');
                        }
                    }, 5000);
                }
            }
        };

        initiateHealthCheck();

        // Función de limpieza al desmontar el componente o cerrar el modal
        return () => {
            if (healthCheckIntervalRef.current) {
                clearInterval(healthCheckIntervalRef.current);
            }
        };
    }, [isOpen]); // Dependencia del `isOpen` para reiniciar cuando el modal se abre/cierra

    const isFormDisabled = serverStatus !== 'active' || isSubmitting;

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (serverStatus !== 'active') {
            setErrorMessage('El servidor no está disponible. Por favor, espera mientras se restablece la conexión.');
            return; // No intentar enviar el formulario si el servidor no está activo
        }
        setServerStatus('submitting');

        try {
            if (view === 'login') {
                console.log('Iniciando sesión con:', { email, password });
                // --- Lógica de Login (simulada o real) ---
                // Simulación de una llamada a API de login
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    // const data = await response.json();
                    alert('¡Inicio de sesión exitoso!');
                    authLogin(data.token);
                    onClose(); // Cierra el modal
                    navigate('/dashboard-pro'); // Navega al nuevo dashboard
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || 'Error al iniciar sesión.');
                }
            } else { // view === 'register'
                // --- Lógica de Registro (simulada o real) ---
                if (password !== confirmPassword) {
                    setErrorMessage('Las contraseñas no coinciden.');
                    return;
                }
                console.log('Registrando usuario:', { email, password });

                // Simulación de una llamada a API de registro
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    alert('¡Registro exitoso! Ahora inicia sesión.');
                    setView('login'); // Cambia a la vista de login
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || 'Error al registrar el usuario.');
                }
            }
        } catch (error) {
            console.error('Error en la operación:', error);
            setErrorMessage('Error de red o el servidor no responde. Inténtalo de nuevo más tarde.');
        } finally {
            // Vuelve al estado activo o inactivo dependiendo de si el servidor sigue disponible
            setIsSubmitting(false);
            const isActiveAfterSubmit = await checkServerHealth();
            setServerStatus(isActiveAfterSubmit ? 'active' : 'inactive');
        }
    };

    // Si el modal no está abierto, no renderizar nada
    if (!isOpen) {
        return null;
    }

    return (
        // Fondo oscuro del modal (overlay)
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center"
            onClick={onClose}
        >
            {/* Contenido del modal */}
            <div
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón de cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl"
                >
                    &times;
                </button>

                {/* Pestañas para cambiar de vista */}
                <div className="flex border-b mb-6">
                    <button
                        onClick={() => setView('login')}
                        className={`flex-1 py-2 font-semibold text-center transition-colors ${view === 'login'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-500 hover:text-indigo-500'
                            }`}
                        disabled={isFormDisabled} // Deshabilitar pestañas también
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => setView('register')}
                        className={`flex-1 py-2 font-semibold text-center transition-colors ${view === 'register'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-500 hover:text-indigo-500'
                            }`}
                        disabled={isFormDisabled} // Deshabilitar pestañas también
                    >
                        Registrarse
                    </button>
                </div>

                {/* Mensajes de estado del servidor */}
                {serverStatus === 'checking' && (
                    <p className="text-center text-blue-600 mb-4 flex items-center justify-center">
                        <span className="animate-spin mr-2 text-xl">🌀</span> Conectando al servidor...
                    </p>
                )}
                {serverStatus === 'inactive' && (
                    <p className="text-center text-red-600 mb-4 flex items-center justify-center">
                        <span className="mr-2 text-xl">⚠️</span> Servidor no disponible. 🌀 Reintentando...
                    </p>
                )}
                {serverStatus === 'active' && (
                    <p className="text-center text-green-600 mb-4 flex items-center justify-center">
                        <span className="mr-2 text-xl">✅</span> Servidor conectado.
                    </p>
                )}

                {/* Formulario */}
                <form onSubmit={handleFormSubmit}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        {view === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                    </h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                            disabled={isFormDisabled}
                            placeholder='user@example.com'
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                            disabled={isFormDisabled}
                            placeholder='password123'
                        />
                    </div>

                    {view === 'register' && (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                                disabled={isFormDisabled}
                                placeholder='password123'
                            />
                        </div>
                    )}

                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
                    )}

                    <button
                        className={`w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform
                            ${isFormDisabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:from-indigo-600 hover:to-purple-700 hover:scale-105'
                            }`}
                        disabled={isFormDisabled}
                    >
                        {serverStatus === 'submitting'
                            ? 'Enviando...'
                            : view === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                    </button>
                </form>
            </div>
        </div>
    );
}