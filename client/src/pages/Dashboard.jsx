import { useState } from "react";

const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const categories = [
  { name: "Desayuno", color: "bg-amber-50 border-amber-200", icon: "🌅" },
  { name: "Almuerzo", color: "bg-orange-50 border-orange-200", icon: "☀️" },
  { name: "Merienda", color: "bg-pink-50 border-pink-200", icon: "☕" },
  { name: "Cena", color: "bg-purple-50 border-purple-200", icon: "🌙" },
  {
    name: "Actividad física",
    color: "bg-green-50 border-green-200",
    icon: "💪",
  },
  { name: "Cuota de placer", color: "bg-blue-50 border-blue-200", icon: "✨" },
];

export default function Dashboard() {
  const [calendar, setCalendar] = useState(
    categories.map((cat) =>
      days.map(() => ({ image: null, text: "", complete: false }))
    )
  );
  const allComplete = calendar.every((row) =>
    row.every((cell) => cell.complete)
  );

  const handleImageChange = (catIndex, dayIndex, file) => {
    if (!file) return;
    const updated = [...calendar];
    updated[catIndex][dayIndex].image = URL.createObjectURL(file);
    updated[catIndex][dayIndex].complete =
      !!updated[catIndex][dayIndex].text || !!file;
    setCalendar(updated);
  };

  const handleTextChange = (catIndex, dayIndex, value) => {
    const updated = [...calendar];
    updated[catIndex][dayIndex].text = value;
    updated[catIndex][dayIndex].complete =
      !!value || !!updated[catIndex][dayIndex].image;
    setCalendar(updated);
  };

  const removeImage = (catIndex, dayIndex) => {
    const updated = [...calendar];
    if (updated[catIndex][dayIndex].image) {
      URL.revokeObjectURL(updated[catIndex][dayIndex].image);
    }
    updated[catIndex][dayIndex].image = null;
    updated[catIndex][dayIndex].complete = !!updated[catIndex][dayIndex].text;
    setCalendar(updated);
  };

  const generarResumen = () => {
    let resumen = "📅 Resumen semanal\n\n";

    categories.forEach((category, catIndex) => {
      resumen += `🗂️ ${category.name}\n`;
      days.forEach((day, dayIndex) => {
        const cell = calendar[catIndex][dayIndex];
        resumen += `- ${day}: ${cell.text || "Sin comentario"}\n`;
      });
      resumen += "\n";
    });

    navigator.clipboard.writeText(resumen);
    alert(
      "Resumen copiado al portapapeles. ¡Listo para pegar en WhatsApp o correo!"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">📅</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Calendario Semanal
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Organiza tu semana con estilo y mantén el control de tus actividades
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Days Header */}
          <div className="grid grid-cols-8 bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="p-4 text-white font-semibold text-center border-r border-indigo-400">
              <span className="text-sm uppercase tracking-wide">Categoría</span>
            </div>
            {days.map((day, index) => (
              <div
                key={day}
                className={`p-4 text-center border-r border-indigo-400 last:border-r-0 ${
                  index === 5 || index === 6 ? "bg-indigo-600" : ""
                }`}
              >
                <span className="text-white font-semibold text-sm uppercase tracking-wide">
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          {categories.map((category, catIndex) => (
            <div
              key={category.name}
              className="grid grid-cols-8 border-b border-gray-100 last:border-b-0"
            >
              {/* Category Header */}
              <div
                className={`p-4 ${category.color} border-r border-gray-200 flex items-center gap-3`}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  {category.name}
                </span>
              </div>

              {/* Calendar Cells */}
              {days.map((day, dayIndex) => {
                const cell = calendar[catIndex][dayIndex];
                const isWeekend = dayIndex === 5 || dayIndex === 6;

                return (
                  <div
                    key={dayIndex}
                    className={`relative p-3 border-r border-gray-200 last:border-r-0 min-h-[180px] transition-all duration-200 ${
                      cell.complete
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-400"
                        : isWeekend
                        ? "bg-gray-50"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {/* Complete indicator */}
                    {cell.complete && (
                      <div className="absolute top-2 right-2 group relative">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            ✓
                          </span>
                        </div>
                        <span className="absolute -top-7 right-0 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          ¡Completado!
                        </span>
                      </div>
                    )}

                    {/* File input */}
                    <div className="mb-3">
                      <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-2 text-xs font-medium text-gray-700">
                        <div className="w-4 h-4 bg-gray-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs">📷</span>
                        </div>
                        <span>
                          {cell.image ? "Cambiar foto" : "Subir foto"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageChange(
                              catIndex,
                              dayIndex,
                              e.target.files[0]
                            )
                          }
                        />
                      </label>
                    </div>

                    {/* Image preview */}
                    {cell.image && (
                      <div className="relative mb-3 group">
                        <img
                          src={cell.image}
                          alt="preview"
                          className="w-full h-20 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                        />
                        <button
                          onClick={() => removeImage(catIndex, dayIndex)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {/* Text area */}
                    <textarea
                      rows={3}
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                      value={cell.text}
                      onChange={(e) =>
                        handleTextChange(catIndex, dayIndex, e.target.value)
                      }
                      placeholder="Añade tus comentarios aquí..."
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Progreso semanal
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, catIndex) => {
              const completed = calendar[catIndex].filter(
                (cell) => cell.complete
              ).length;
              const total = days.length;
              const percentage = (completed / total) * 100;

              return (
                <div key={category.name} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {category.name}
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 mb-1">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">
                    {completed}/{total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón de mandar información */}
        {allComplete && (
          <div className="mt-8 text-center">
            <button
              onClick={generarResumen}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300"
            >
              ✅ Mandar Información
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Resumen copiado al portapapeles para enviar por WhatsApp o Email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
