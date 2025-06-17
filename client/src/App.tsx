import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import DashboardPro from "./pages/DashboardPro.tsx";
import AuthModal from "./components/AuthModal.tsx"; 
import { AuthProvider } from "./context/AuthContext.tsx"; 
import PrivateRoute from "./components/PrivateRoute.tsx"; 
import { useState } from 'react'; 

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthProvider>
      <BrowserRouter basename="/calendar-dietetico/">
        <Routes>
          {/* Dashboard principal, accesible sin login (o con login) */}
          <Route path="/" element={<Dashboard onOpenAuthModal={handleOpenAuthModal} />} />

          {/* Ruta Protegida para Dashboard Pro */}
          <Route
            path="/dashboard-pro"
            element={
              <PrivateRoute>
                <DashboardPro />
              </PrivateRoute>
            }
          />
          {/* RUTA CATCH-ALL / 404 */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
          {/* Alternativa: Podrías crear un componente <NotFoundPage />
          <Route path="*" element={<NotFoundPage />} />
          */}
        </Routes>
      {/* Renderiza el AuthModal, controlado por su estado */}
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
