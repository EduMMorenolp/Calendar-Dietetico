import type { Category } from "../types/calendar";

export const categories: Category[] = [
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

export const days: string[] = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
