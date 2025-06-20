import { useState, useMemo, useCallback, useRef} from "react";
import type { WeekData } from "../types/calendar";
import { categories, days } from "../constants/data";
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

// Importa los nuevos componentes
import Header from "../components/Header";
// import WeekNavigator from "../components/WeekNavigator";
import CalendarTable from "../components/CalendarTable";
import ProgressTracker from "../components/ProgressTracker";
import SubmitButton from "../components/SubmitButton";
import Footer from "../components/Footer";
import WelcomeModal from "../components/WelcomeModal";

// La semana inicial se calcula una sola vez
const initialWeek = categories.map(() =>
  days.map(() => ({ image: null, text: "", complete: false }))
);

interface DashboardProps {
  onOpenAuthModal: () => void;
}

export default function Dashboard({ onOpenAuthModal }: DashboardProps) {
  const [weeks, setWeeks] = useState<WeekData[]>([
    JSON.parse(JSON.stringify(initialWeek)),
    JSON.parse(JSON.stringify(initialWeek)),
    JSON.parse(JSON.stringify(initialWeek)),
    JSON.parse(JSON.stringify(initialWeek)),
  ]);
  const weekIndex = 0
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);

  const generarPDF = useCallback(async () => {
    const input = pdfRef.current;
    if (input) {
      try {
        // Crea un canvas a partir del elemento HTML
        const canvas = await html2canvas(input, {
          scale: 2,
          useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210;
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`Resumen_Semana_${weekIndex + 1}.pdf`);
        alert('PDF generado y descargado!');

      } catch (error) {
        console.error("Error al generar el PDF:", error);
        alert("Ocurrió un error al generar el PDF.");
      }
    } else {
      alert("No se encontró el contenido para generar el PDF.");
    }
  }, [weekIndex]);

  // Derivamos el estado para no recalcularlo en cada render
  const currentWeek: WeekData = useMemo(() => weeks[weekIndex], [weeks, weekIndex]);

  const handleImageChange = useCallback((catIndex: number, dayIndex: number, file: File) => {
    // Si el archivo no es una imagen, o es demasiado grande (opcional, para prevenir problemas)
    if (!file.type.startsWith('image/')) {
      alert("Por favor, selecciona un archivo de imagen.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          console.error("No se pudo obtener el contexto 2D del canvas.");
          alert("Error interno al procesar la imagen. Inténtalo de nuevo.");
          return;
        }

        const MAX_DIMENSION = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            setWeeks((prevWeeks) => {
              const updated = JSON.parse(JSON.stringify(prevWeeks));
              const cell = updated[weekIndex][catIndex][dayIndex];

              // Revoca la URL anterior si existe
              if (cell.image) URL.revokeObjectURL(cell.image);

              cell.image = URL.createObjectURL(blob);
              cell.complete = !!cell.text || !!blob; // 

              return updated;
            });
          } else {
            console.error("No se pudo crear el Blob de la imagen.");
            alert("Error al procesar la imagen para guardar.");
          }
        }, 'image/jpeg', 0.7);

      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [weekIndex]);

  const handleTextChange = useCallback((catIndex: number, dayIndex: number, value: string) => {
    setWeeks((prevWeeks) => {
      const updated = JSON.parse(JSON.stringify(prevWeeks));
      const cell = updated[weekIndex][catIndex][dayIndex];
      cell.text = value;
      cell.complete = !!value || !!cell.image;
      return updated;
    });
  }, [weekIndex]);

  const removeImage = useCallback((catIndex: number, dayIndex: number) => {
    setWeeks((prevWeeks) => {
      const updated = JSON.parse(JSON.stringify(prevWeeks));
      const cell = updated[weekIndex][catIndex][dayIndex];
      if (cell.image) URL.revokeObjectURL(cell.image);
      cell.image = null;
      cell.complete = !!cell.text;
      return updated;
    });
  }, [weekIndex]);

  const handleCloseWelcomeModal = useCallback(() => {
    setIsWelcomeModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-1 sm:px-2">
        <Header onLoginClick={onOpenAuthModal} />

        <div className="text-center py-2 sm:py-3">
          <p className="text-gray-600 text-sm sm:text-lg">
            Organiza tu semana con estilo y mantén el control de tus actividades
          </p>
        </div>


        <div ref={pdfRef} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-center gap-3 m-2">
            {/* Logo */}
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-bold">
                📅
              </span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-800">
              Calendario Semanal
            </span>
          </div>

          <CalendarTable
            currentWeek={currentWeek}
            categories={categories}
            handleImageChange={handleImageChange}
            handleTextChange={handleTextChange}
            removeImage={removeImage}
          />

          <ProgressTracker currentWeek={currentWeek} categories={categories} />
        </div>

        <SubmitButton
          generarResumen={generarPDF}
        />

        <Footer />

        <WelcomeModal
          isOpen={isWelcomeModalOpen}
          onClose={handleCloseWelcomeModal}
        />
      </div>
    </div>
  );
}