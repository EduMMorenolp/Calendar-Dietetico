import type { WeekData, Category } from '../types/calendar';
import { days } from '../constants/data';

interface ProgressTrackerProps {
    currentWeek: WeekData;
    categories: Category[];
}

export default function ProgressTracker({ currentWeek, categories }: ProgressTrackerProps) {
    const totalDays = days.length;

    return (
        <div className="mt-8 bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Progreso semanal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {categories.map((category, catIndex) => {
                    const completed = currentWeek[catIndex].filter((cell) => cell.complete).length;
                    const percentage = (completed / totalDays) * 100;
                    return (
                        <div key={category.name} className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-lg">{category.icon}</span>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">
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
                                {completed}/{totalDays}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}