import React from 'react';
import type { WeekData, Category } from '../types/calendar';
import { days } from '../constants/data';

interface CalendarTableProps {
    currentWeek: WeekData;
    categories: Category[];
    handleImageChange: (catIndex: number, dayIndex: number, file: File) => void;
    handleTextChange: (catIndex: number, dayIndex: number, value: string) => void;
    removeImage: (catIndex: number, dayIndex: number) => void;
    currentMobileDayIndex: Map<string, number>;
    onMobileDayChange: (categoryId: string, newDayIndex: number) => void;
}

export default function CalendarTable({
    currentWeek,
    categories,
    handleImageChange,
    handleTextChange,
    removeImage,
    currentMobileDayIndex,
    onMobileDayChange,
}: CalendarTableProps) {
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, catIndex: number, dayIndex: number) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageChange(catIndex, dayIndex, file);
        }
        e.target.value = '';
    };

    return (
        <>
            {/* Desktop Version - Table Layout */}
            <div className="hidden lg:block">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="grid grid-cols-8 bg-gradient-to-r from-indigo-500 to-purple-600">
                        <div className="p-4 text-white font-semibold text-center border-r border-indigo-400">
                            <span className="text-sm uppercase tracking-wide">Categoría</span>
                        </div>
                        {days.map((day, index) => (
                            <div key={day} className={`p-4 text-center border-r border-indigo-400 last:border-r-0 ${index === 5 || index === 6 ? "bg-indigo-600" : ""}`}>
                                <span className="text-white font-semibold text-sm uppercase tracking-wide">{day}</span>
                            </div>
                        ))}
                    </div>

                    {categories.map((category, catIndex) => (
                        <div key={category.name} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
                            <div className={`p-4 ${category.color} border-r border-gray-200 flex items-center gap-3`}>
                                <span className="text-2xl">{category.icon}</span>
                                <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{category.name}</span>
                            </div>

                            {days.map((_, dayIndex) => {
                                const cell = currentWeek[catIndex][dayIndex];
                                const isWeekend = dayIndex === 5 || dayIndex === 6;
                                return (
                                    <div key={dayIndex} className={`relative p-3 border-r border-gray-200 last:border-r-0 min-h-[180px] transition-all duration-200 ${cell.complete ? "bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-400" : isWeekend ? "bg-gray-50" : "bg-white hover:bg-gray-50"}`}>
                                        {cell.complete && (
                                            <div className="absolute top-2 right-2 group">
                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">✓</span>
                                                </div>
                                                <span className="absolute -top-7 right-0 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                    ¡Completado!
                                                </span>
                                            </div>
                                        )}
                                        <div className="mb-3">
                                            <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-2 text-xs font-medium text-gray-700">
                                                <div className="w-4 h-4 bg-gray-500 rounded flex items-center justify-center"><span className="text-white text-xs">📷</span></div>
                                                <span>{cell.image ? "Cambiar foto" : "Subir foto"}</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e, catIndex, dayIndex)} />
                                            </label>
                                        </div>
                                        {cell.image && (
                                            <div className="relative mb-3 group">
                                                <img src={cell.image} alt="preview" className="w-full h-full object-cover rounded-lg border-2 border-gray-200 shadow-sm" />
                                                <button onClick={() => removeImage(catIndex, dayIndex)} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">×</button>
                                            </div>
                                        )}
                                        <textarea rows={3} className="w-full text-xs p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white" value={cell.text} onChange={(e) => handleTextChange(catIndex, dayIndex, e.target.value)} placeholder="Añade tus comentarios..." />
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile/Tablet Version - Card Layout */}
            <div className="lg:hidden space-y-6">
                {categories.map((category, catIndex) => {
                    const activeDayIndex = currentMobileDayIndex.get(category.id) || 0;
                    const cell = currentWeek[catIndex][activeDayIndex];
                    const dayName = days[activeDayIndex];
                    const isWeekend = activeDayIndex === 5 || activeDayIndex === 6;

                    return (
                        <div key={category.name} className="bg-white rounded-xl shadow-lg border border-gray-100">
                            <div className={`p-4 ${category.color} rounded-t-xl flex items-center gap-3 border-b border-gray-200`}>
                                <span className="text-2xl">{category.icon}</span>
                                <span className="font-semibold text-gray-800 text-base uppercase tracking-wide">{category.name}</span>
                            </div>
                            <div className="p-4">
                                {/* --- CONTROLES DE NAVEGACIÓN DEL CARRUSEL --- */}
                                <div className="flex justify-between items-center mb-4">
                                    <button
                                        onClick={() => onMobileDayChange(category.id, activeDayIndex - 1)}
                                        disabled={activeDayIndex === 0}
                                        className="px-3 py-1 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Anterior
                                    </button>
                                    <span className="font-bold text-gray-800 text-base">{dayName}</span> {/* Muestra el nombre del día */}
                                    <button
                                        onClick={() => onMobileDayChange(category.id, activeDayIndex + 1)}
                                        disabled={activeDayIndex === days.length - 1}
                                        className="px-3 py-1 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Siguiente
                                    </button>
                                </div>

                                {/* --- CONTENIDO DE LA CELDA DEL DÍA ACTIVO --- */}
                                <div key={activeDayIndex} className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${cell.complete ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-400" : isWeekend ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-gray-800 text-sm">{dayName}</h3>
                                        {cell.complete && (
                                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-2 text-xs font-medium text-gray-700">
                                            <div className="w-4 h-4 bg-gray-500 rounded flex items-center justify-center"><span className="text-white text-xs">📷</span></div>
                                            <span>{cell.image ? "Cambiar foto" : "Subir foto"}</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e, catIndex, activeDayIndex)} />
                                        </label>
                                    </div>
                                    {cell.image && (
                                        <div className="relative mb-3 group">
                                            <img src={cell.image} alt="preview" className="w-full h-full object-cover rounded-lg border-2 border-gray-200 shadow-sm" />
                                            <button onClick={() => removeImage(catIndex, activeDayIndex)} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">×</button>
                                        </div>
                                    )}
                                    {/* IMPORTANT: Cambia dayIndex por activeDayIndex aquí */}
                                    <textarea rows={3} className="w-full text-xs p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white" value={cell.text} onChange={(e) => handleTextChange(catIndex, activeDayIndex, e.target.value)} placeholder="Añade tus comentarios..." />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}