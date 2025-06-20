interface HeaderProps {
    onLoginClick: () => void;
  }

export default function Header({ onLoginClick }: HeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm rounded-lg mb-4">
            <div className="px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    {/* Logo/Brand */}
                    <div className="flex items-center gap-3">
                        {/* Logo */}
                        <img src="public/img/NCLogo.png" alt="NutriControl" className="h-10 w-auto sm:h-12 rounded-lg object-contain"/>
                    </div>

                    {/* Login Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                        <p className="text-gray-600 text-xs sm:text-sm text-center">
                            Inicia sesión para guardar tus cambios
                        </p>
                        <button onClick={onLoginClick}  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-sm">
                            Iniciar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}