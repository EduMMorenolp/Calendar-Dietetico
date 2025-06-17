import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { WeekData } from "../types/calendar";
import { categories, days } from "../constants/data";
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

// Importa los nuevos componentes
import Header from "../components/Header";
import WeekNavigator from "../components/WeekNavigator";
import CalendarTable from "../components/CalendarTable";
import ProgressTracker from "../components/ProgressTracker";
import SubmitButton from "../components/SubmitButton";

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

  const [weekIndex, setWeekIndex] = useState<number>(0);
  const pdfRef = useRef<HTMLDivElement>(null);

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

        pdf.save(`Resumen_Semana_${weekIndex + 1}.pdf`); // Nombre del archivo PDF
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
  const allCompleteInCurrentWeek = useMemo(
    () => currentWeek.every((row) => row.every((cell) => cell.complete)),
    [currentWeek]
  );

  // Limpiamos los Object URLs para prevenir memory leaks
  useEffect(() => {
    return () => {
      weeks.flat(2).forEach(cell => {
        if (cell.image) {
          URL.revokeObjectURL(cell.image);
        }
      });
    };
  }, [weeks]);

  // Envolvemos los handlers en useCallback para optimizar el rendimiento,
  // evitando que los componentes hijos se re-rendericen innecesariamente.
  const handleImageChange = useCallback((catIndex: number, dayIndex: number, file: File) => {
    setWeeks((prevWeeks) => {
      const updated = JSON.parse(JSON.stringify(prevWeeks)); // Deep copy
      const cell = updated[weekIndex][catIndex][dayIndex];
      if (cell.image) URL.revokeObjectURL(cell.image);
      cell.image = URL.createObjectURL(file);
      cell.complete = !!cell.text || !!file;
      return updated;
    });
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

  // const generarResumen = useCallback(() => {
  //   let resumen = `📅 Resumen Semana ${weekIndex + 1}\n\n`;
  //   categories.forEach((category, catIndex) => {
  //     resumen += `🗂️ ${category.name}\n`;
  //     days.forEach((day, dayIndex) => {
  //       const cell = currentWeek[catIndex][dayIndex];
  //       const imageStatus = cell.image ? " (📸 con foto)" : ""; 
  //       resumen += `- ${day}: ${cell.text || "Sin comentario"}${imageStatus}\n`;
  //     });
  //     resumen += "\n";
  //   });

  //   navigator.clipboard.writeText(resumen);
  //   alert(
  //     "Resumen copiado al portapapeles. ¡Listo para pegar en WhatsApp o correo!"
  //   );
  // }, [weekIndex, currentWeek]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
        <Header onLoginClick={onOpenAuthModal} />

        <div className="text-center py-2 sm:py-3">
          <p className="text-gray-600 text-sm sm:text-lg">
            Organiza tu semana con estilo y mantén el control de tus actividades
          </p>
        </div>

        <div ref={pdfRef} className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Resumen Semanal - Semana {weekIndex + 1}
          </h2>
          <WeekNavigator weekIndex={weekIndex} setWeekIndex={setWeekIndex} totalWeeks={4} />

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
          allCompleteInCurrentWeek={allCompleteInCurrentWeek}
          generarResumen={generarPDF}
        />
      </div>
    </div>
  );
}