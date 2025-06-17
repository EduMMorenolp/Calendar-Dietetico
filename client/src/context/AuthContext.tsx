// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

// Define el tipo para el contexto de autenticación
interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    authToken: string | null; // Para almacenar el token JWT
}

// Crea el contexto con un valor por defecto (que nunca se usará directamente)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props para el proveedor de autenticación
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // Inicializa el estado de autenticación leyendo del localStorage
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('authToken') ? true : false;
    });
    const [authToken, setAuthToken] = useState<string | null>(() => {
        return localStorage.getItem('authToken');
    });

    // Función para simular el login
    const login = (token: string) => {
        localStorage.setItem('authToken', token);
        setAuthToken(token);
        setIsAuthenticated(true);
    };

    // Función para simular el logout
    const logout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setIsAuthenticated(false);
    };

    // Puedes añadir un efecto para revalidar el token o manejar su expiración
    useEffect(() => {
        // Ejemplo: podrías decodificar el token aquí y verificar su fecha de expiración
        // Si el token expira, llamar a logout()
        const token = localStorage.getItem('authToken');
        if (token) {
            // Lógica para verificar validez/expiración del token
            // Por ahora, solo asumimos que es válido si existe
            setIsAuthenticated(true);
            setAuthToken(token);
        } else {
            setIsAuthenticated(false);
            setAuthToken(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, authToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};