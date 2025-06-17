import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [view, setView] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (view === 'login') {
            // --- Lógica de Login (simulada) ---
            console.log('Iniciando sesión con:', { email, password });
            // Aquí iría la llamada a tu API de backend
            // Si el login es exitoso:
            alert('¡Inicio de sesión exitoso!');
            onClose(); // Cierra el modal
            navigate('/dashboard-pro'); // Navega al nuevo dashboard
        } else {
            // --- Lógica de Registro (simulada) ---
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            console.log('Registrando usuario:', { email, password });
            // Aquí iría la llamada a tu API para crear el usuario
            // Si el registro es exitoso:
            alert('¡Registro exitoso! Ahora inicia sesión.');
            setView('login'); // Cambia a la vista de login
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
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => setView('register')}
                        className={`flex-1 py-2 font-semibold text-center transition-colors ${view === 'register'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-500 hover:text-indigo-500'
                            }`}
                    >
                        Registrarse
                    </button>
                </div>

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
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                        {view === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                    </button>
                </form>
            </div>
        </div>
    );
}