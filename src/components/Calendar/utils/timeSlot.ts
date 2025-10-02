/**
 * timeSlot.ts
 * --------------------------------------------------
 * Utilidades de conversión entre horas (HH:MM) y "slots" discretos.
 * Un slot es una unidad uniforme de tiempo = intervalMinutes minutos.
 * Se usa para:
 *  - Calcular posición vertical (top) de eventos.
 *  - Derivar altura basada en duración.
 *  - Evitar cálculos repetidos repartidos por el código.
 */

/** Convierte una hora HH:MM a número de slots desde startHour */
export function timeToSlots(time: string, startHour: number, intervalMinutes: number): number {
  const [h, m] = time.split(':').map(Number);
  return ((h - startHour) * 60 + m) / intervalMinutes;
}

/** Convierte un número de slots a hora HH:MM considerando startHour */
export function slotsToTime(slots: number, startHour: number, intervalMinutes: number): string {
  const totalMins = slots * intervalMinutes + startHour * 60;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
}

/** Limita un valor entre un mínimo y máximo */
/**
 * clamp: Restringe un valor entre un mínimo y máximo.
 * Útil para asegurar que un drag/resize no salga de los límites del día.
 */
export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
