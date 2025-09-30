/**
 * Calendar Types - HeyData Mobile
 * Tipos e interfaces para el sistema de calendario
 * 
 * @format
 */

export interface Cliente {
  id: string;
  nombre: string;
  telefono?: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracionMinutos: number;
}

export interface Worker {
  id: string;
  name: string;
  color: string;
}

export interface DetalleCita {
  id: string;
  servicioId: string;
  servicio: Servicio;
  empleadoId: string;
  empleado: Worker;
  inicioServicio: string; // HH:MM
  duracionMinutos: number;
  precio: number;
}

export interface CalendarEvent {
  id: string;
  clienteId: string;
  cliente: Cliente;
  startTime: string; // Inicio de toda la cita
  endTime: string;   // Fin de toda la cita
  date: string; // YYYY-MM-DD format
  detalles: DetalleCita[]; // Array de servicios/empleados
  estado: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';
  total: number;
  // Para compatibilidad con el código actual
  title?: string;
  color?: string;
  worker?: string;
}

export type ViewMode = 'day' | 'week' | 'month';

export interface TimeSlot {
  time: string;
  isMainHour: boolean;
}

export interface CalendarViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedWorkers: string[];
  workers: Worker[];
  onEventPress: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
}

export interface FloatingButtonAnimations {
  leftButtonAnimation: any;
  centerButtonAnimation: any;
  rightButtonAnimation: any;
  buttonOpacityAnimation: any;
}

export interface CalendarHeaderProps {
  viewMode: ViewMode;
  currentDate: Date;
  showMonthPicker: boolean;
  onNavigateDate: (direction: 'prev' | 'next') => void;
  onViewModeChange: (mode: ViewMode) => void;
  onMonthPickerToggle: (show: boolean) => void;
  onFilterPress: () => void;
}

export interface CalendarFilterProps {
  visible: boolean;
  workers: Worker[];
  selectedWorkers: string[];
  onWorkerToggle: (workerId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onApply: () => void;
  onClose: () => void;
}

export interface CalendarEventDetailsProps {
  visible: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPayment: () => void;
}

export interface ResizeableAppointmentProps {
  event: CalendarEvent;
  cardStyle: any;
  onPress: () => void;
  onResize: (newStartTime: string, newEndTime: string) => void;
  onMove: (newWorkerIndex: number, newTimePosition?: number) => void;
  onResizeModeChange: (isResizing: boolean) => void;
  timeSlotHeight: number;
  columnWidth: number;
  totalColumns: number;
  containerHeight: number;
}
