import React from 'react';

interface WelcomeModalProps {
    isOpen: boolean; 
    onClose: () => void; 
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        // Overlay oscuro para el fondo del modal
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            {/* Contenedor del modal */}
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-auto transform transition-all duration-300 scale-100 opacity-100">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 text-center">
                    ¡Bienvenido a NutriControl! 🥗
                </h2>
                <p className="text-gray-700 mb-6 text-center text-base sm:text-lg leading-relaxed">
                    Aquí podrás organizar y controlar tu semana nutricional de forma visual y sencilla.
                    Añade tus comidas, actividades y notas día a día.
                </p>
                <p className="text-gray-600 mb-8 text-center text-sm sm:text-base">
                    ¡No olvides generar tu resumen en PDF para llevar un registro completo!
                </p>
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 text-lg"
                    >
                        ¡Entendido! Empezar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;