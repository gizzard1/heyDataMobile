/**
 * Tipos específicos para la tarjeta de cita redimensionable (ResizableAppointmentCard).
 * Separado para reducir ruido en el componente principal.
 */

/**
 * CalendarEventLite
 * Versión ligera del evento usada por la tarjeta.
 * (Evita acoplar toda la estructura completa del evento principal.)
 */
export interface CalendarEventLite {
  id: string;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  cliente: { id: string; nombre: string };
  detalles: Array<{ servicio: { nombre: string } }>;
  color?: string;
  worker?: string;
}

/**
 * ResizableCardProps
 * Props que el contenedor (vista día) le pasa a la tarjeta.
 * Incluye callbacks para mover y redimensionar + métricas del grid.
 */
export interface ResizableCardProps {
  event: CalendarEventLite;
  workerIndex: number;
  totalColumns: number;
  columnWidth: number;
  slotHeight: number;       // px por slot
  startHour: number;        // ej 9
  endHour: number;          // ej 18
  intervalMinutes: number;  // ej 15
  onPress: () => void;
  onMove: (newWorkerIndex: number, newTopPx: number, newHeightPx: number, newStartTime?: string, newEndTime?: string) => void;
  onResize: (newStartTime: string, newEndTime: string) => void;
  widthOffset?: number;     // margen interno opcional
  /** Si true: durante el drag el movimiento es continuo (px) y solo se snapea al soltar */
  continuousDrag?: boolean;
  onDragStateChange?: (dragging: boolean) => void; // Para desactivar scroll externo
  onAutoScroll?: (deltaY: number) => void; // Solicitud de auto-scroll vertical
  viewportHeight?: number; // Altura visible del área scrollable
  autoScrollEdgeThreshold?: number; // zona sensible en px
  autoScrollSpeed?: number; // px por frame de gesto
  currentScrollY?: number; // offset actual del scroll externo para permitir movimiento más libre
  /** Control externo del modo edición: id de la tarjeta actualmente en edición */
  activeEditingId?: string;
  /** Solicitud para entrar o salir del modo edición desde la tarjeta */
  onRequestEditMode?: (eventId: string, enable: boolean) => void;
}
