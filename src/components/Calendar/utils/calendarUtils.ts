/**
 * Calendar Utils - HeyData Mobile
 * Funciones utilitarias para el calendario
 * 
 * @format
 */

import { CalendarEvent, Worker } from '../types';

// Funciones para manejar fechas
export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('es-ES', options);
};

export const formatMonthYear = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
  };
  return date.toLocaleDateString('es-ES', options);
};

export const formatEventDate = (dateString: string): string => {
  if (!dateString) return 'Fecha no disponible';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha no disponible';
  
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Funciones para verificar fechas
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isSelected = (date: Date, selectedDate: Date): boolean => {
  return date.toDateString() === selectedDate.toDateString();
};

export const isCurrentMonth = (date: Date, currentDate: Date): boolean => {
  return date.getMonth() === currentDate.getMonth();
};

// Funciones para manejar horarios
export const calculateDuration = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return '1 hora';
  
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '1 hora';
  
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}min`;
  } else if (hours > 0) {
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} min`;
  }
  
  return '30 min';
};

export const timePositionToTime = (position: number): string => {
  const totalMinutes = (position / 60) * 60; // 60px por hora, 60 minutos por hora
  const hours = Math.floor(totalMinutes / 60) + 8; // Comenzamos a las 8:00
  const minutes = Math.round((totalMinutes % 60) / 15) * 15; // Redondear a múltiplos de 15 minutos
  
  const adjustedHours = hours + Math.floor(minutes / 60);
  const adjustedMinutes = minutes % 60;
  
  return `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
};

export const getEventDuration = (startTime: string, endTime: string): number => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  return endTotalMinutes - startTotalMinutes;
};

export const addMinutesToTime = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
};

// Funciones para trabajadoras
export const getVisibleWorkers = (workers: Worker[], selectedWorkers: string[]): Worker[] => {
  if (selectedWorkers.length === 0) {
    return workers; // Si no hay trabajadoras seleccionadas, mostrar todas
  }
  return workers.filter(worker => selectedWorkers.includes(worker.id));
};

export const getColumnWidth = (visibleWorkers: Worker[], screenWidth: number): number => {
  const minWidth = 200; // Ancho mínimo
  const maxWidth = 280; // Ancho máximo
  const availableWidth = screenWidth - 80; // Restamos espacio para la columna de tiempo
  
  if (visibleWorkers.length === 0) return minWidth;
  
  const calculatedWidth = availableWidth / visibleWorkers.length;
  return Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
};

// Funciones para eventos
export const getEventsForDate = (
  date: Date,
  events: CalendarEvent[],
  selectedWorkers: string[],
  workers: Worker[]
): CalendarEvent[] => {
  const dateString = date.toISOString().split('T')[0];
  return events.filter(event => {
    // Filtrar por fecha
    if (event.date !== dateString) return false;
    
    // Aplicar filtros de trabajadoras
    if (selectedWorkers.length > 0) {
      const workerName = event.worker;
      const workerId = workers.find(w => w.name === workerName)?.id;
      if (workerId && !selectedWorkers.includes(workerId)) {
        return false;
      }
    }
    
    return true;
  });
};

export const getEventForWorkerAtTime = (
  events: CalendarEvent[],
  workerName: string,
  time: string
): CalendarEvent | undefined => {
  return events.find(event => {
    if (event.worker !== workerName) return false;
    
    // Convertir horarios a minutos para comparación más precisa
    const [eventStartHour, eventStartMin] = event.startTime.split(':').map(Number);
    const [eventEndHour, eventEndMin] = event.endTime.split(':').map(Number);
    const [slotHour, slotMin] = time.split(':').map(Number);
    
    const eventStartTotal = eventStartHour * 60 + eventStartMin;
    const eventEndTotal = eventEndHour * 60 + eventEndMin;
    const slotTotal = slotHour * 60 + slotMin;
    
    // El evento se muestra si el slot está dentro del rango del evento
    return slotTotal >= eventStartTotal && slotTotal < eventEndTotal;
  });
};

export const isEventStart = (event: CalendarEvent, time: string): boolean => {
  return event.startTime === time;
};

// Funciones para calcular posiciones y tamaños de eventos
export const getEventHeight = (startTime: string, endTime: string): number => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startTotalMin = startHour * 60 + startMin;
  const endTotalMin = endHour * 60 + endMin;
  const durationMin = endTotalMin - startTotalMin;
  
  // Cada slot de 15 min = 35px, así que cada minuto = 35/15 ≈ 2.33px
  const heightPerMinute = 35 / 15;
  return Math.max(durationMin * heightPerMinute - 4, 30); // Mínimo 30px, restar 4px para el margen
};

export const getEventTopPosition = (startTime: string, timeSlots: any[]): number => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  
  // Encontrar el índice del slot de la hora de inicio
  const startHourSlotIndex = timeSlots.findIndex(slot => 
    slot.isMainHour && slot.time === `${startHour}:00`
  );
  
  if (startHourSlotIndex === -1) return 0;
  
  // Calcular los minutos adicionales después de la hora
  const additionalMinutes = startMin;
  const rowHeight = 35;
  
  // Cada 15 minutos = 1 fila, así que dividimos los minutos adicionales entre 15
  const additionalRows = Math.floor(additionalMinutes / 15);
  const pixelsPerMinute = rowHeight / 15;
  const remainingMinutes = additionalMinutes % 15;
  
  return (startHourSlotIndex + additionalRows) * rowHeight + (remainingMinutes * pixelsPerMinute);
};

// Función para obtener información del mes
export const getMonthInfo = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(day);
  }
  
  return { firstDay, lastDay, days };
};

// Funciones de navegación
export const navigateDate = (
  currentDate: Date,
  direction: 'prev' | 'next',
  viewMode: 'day' | 'week' | 'month'
): Date => {
  const newDate = new Date(currentDate);
  switch (viewMode) {
    case 'day':
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
      break;
    case 'week':
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      break;
    case 'month':
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      break;
  }
  return newDate;
};
