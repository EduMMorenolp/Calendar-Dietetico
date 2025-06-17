// Archivo: src/components/WeekNavigator.tsx

interface WeekNavigatorProps {
    weekIndex: number;
    setWeekIndex: (index: number) => void;
}

export default function WeekNavigator({ weekIndex, setWeekIndex }: WeekNavigatorProps) {
    return (
        <div className="flex justify-between items-center mb-4 px-2">
            <button
                onClick={() => setWeekIndex(Math.max(0, weekIndex - 1))}
                disabled={weekIndex === 0}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-colors ${weekIndex === 0
                        ? "bg-gray-300 text-gray-500"
                        : "bg-indigo-500 hover:bg-indigo-600 text-white"
                    }`}
            >
                ← <span className="hidden sm:inline">Anterior</span>
            </button>

            <h2 className="text-lg sm:text-xl font-bold text-gray-700">
                Semana {weekIndex + 1} / 4
            </h2>

            <button
                onClick={() => setWeekIndex(Math.min(3, weekIndex + 1))} 
                disabled={weekIndex === 3}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-colors ${weekIndex === 3
                        ? "bg-gray-300 text-gray-500"
                        : "bg-indigo-500 hover:bg-indigo-600 text-white"
                    }`}
            >
                <span className="hidden sm:inline">Siguiente</span> →
            </button>
        </div>
    );
}
  