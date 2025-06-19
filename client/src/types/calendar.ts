// Archivo: src/types/calendar.ts

export interface CalendarCell {
  image: string | null;
  text: string;
  complete: boolean;
}

export interface Category {
  name: string;
  color: string;
  icon: string;
}

export type WeekData = CalendarCell[][];
