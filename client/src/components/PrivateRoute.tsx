// src/components/PrivateRoute.tsx
import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Si el usuario no está autenticado, redirige a la página principal
        // o a tu página de login específica si tienes una
        return <Navigate to="/" replace />;
    }

    // Si el usuario está autenticado, renderiza los hijos (el componente protegido)
    return <>{children}</>;
};

export default PrivateRoute;