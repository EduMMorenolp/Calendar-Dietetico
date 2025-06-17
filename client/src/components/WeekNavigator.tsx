interface WeekNavigatorProps {
    weekIndex: number;
    setWeekIndex: (update: (prev: number) => number) => void;
    totalWeeks: number;
}

export default function WeekNavigator({ weekIndex, setWeekIndex, totalWeeks }: WeekNavigatorProps) {
    const maxWeekIndex = totalWeeks - 1;

    return (
        <div className="flex justify-between items-center mb-4 px-2">
            <button
                onClick={() => setWeekIndex((prev) => Math.max(0, prev - 1))}
                disabled={weekIndex === 0}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${weekIndex === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-500 hover:bg-indigo-600 text-white"
                    } transition-colors`}
            >
                ← <span className="hidden sm:inline">Anterior</span>
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-gray-700">
                Semana {weekIndex + 1} / {totalWeeks}
            </h2>
            <button
                onClick={() => setWeekIndex((prev) => Math.min(maxWeekIndex, prev + 1))}
                disabled={weekIndex === maxWeekIndex}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${weekIndex === maxWeekIndex
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-500 hover:bg-indigo-600 text-white"
                    } transition-colors`}
            >
                <span className="hidden sm:inline">Siguiente</span> →
            </button>
        </div>
    );
}