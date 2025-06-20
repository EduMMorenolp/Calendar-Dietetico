import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear(); // Obtiene el año actual dinámicamente

    return (
        <footer className="bg-gray-800 text-white py-6 mt-8 rounded-t-xl shadow-inner">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
                {/* Información de Copyright */}
                <p className="mb-2">
                    &copy; {currentYear} **NutriControl**. Todos los derechos reservados.
                </p>

                {/* Datos del Desarrollador */}
                <p className="mb-2">
                    Desarrollado por Eduardo M Moreno
                </p>

                {/* Enlaces de Contacto/Portafolio */}
                <div className="flex justify-center space-x-4">
                    <a
                        href="mailto:e.m.morenolp@gmail.com"
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                        aria-label="Enviar correo electrónico"
                    >
                        📧 Correo Electrónico
                    </a>
                    <a
                        href="https://github.com/EduMMorenolp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                        aria-label="Perfil de GitHub"
                    >
                        🐙 GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/eduardo-m-moreno-programador/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                        aria-label="Perfil de LinkedIn"
                    >
                        🔗 LinkedIn
                    </a>
                </div>

                {/* Mensaje de Agradecimiento (Opcional) */}
                <p className="mt-2 text-gray-400">
                    ¡Gracias por usar NutriControl!
                </p>
            </div>
        </footer>
    );
};

export default Footer;