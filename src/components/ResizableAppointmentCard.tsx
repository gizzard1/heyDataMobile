/**
 * ResizableAppointmentCard (Grid Based) - HeyData Mobile
 * Tarjeta de cita basada en celdas (slots) de tamaño fijo.
 * - Cada slot = intervalMinutes
 * - Altura = durationSlots * slotHeight
 * - Posición vertical = startSlot * slotHeight
 * - Posición horizontal = workerIndex * columnWidth
 * Soporta: mover (drag), resize top, resize bottom.
 */

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';

interface CalendarEventLite {
  id: string;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  cliente: { id: string; nombre: string };
  detalles: Array<{ servicio: { nombre: string } }>;
  color?: string;
  worker?: string;
}

interface CardProps {
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
}

const ResizableAppointmentCard: React.FC<CardProps> = ({
  event,
  workerIndex,
  totalColumns,
  columnWidth,
  slotHeight,
  startHour,
  endHour,
  intervalMinutes,
  onPress,
  onMove,
  onResize,
  widthOffset = 12,
  continuousDrag = true,
  onDragStateChange,
  onAutoScroll,
  viewportHeight,
  autoScrollEdgeThreshold = 60,
  autoScrollSpeed = 24,
  currentScrollY = 0,
}) => {
  // ---- Utilidades tiempo ↔ slots ----
  const timeToSlots = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return ((h - startHour) * 60 + m) / intervalMinutes;
  };
  const slotsToTime = (slots: number) => {
    const totalMins = slots * intervalMinutes + startHour * 60;
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
  };

  const startSlot = useMemo(() => timeToSlots(event.startTime), [event.startTime]);
  const endSlot = useMemo(() => timeToSlots(event.endTime), [event.endTime]);
  const durationSlots = Math.max(1, endSlot - startSlot);
  const maxSlots = (endHour - startHour) * (60/intervalMinutes);

  // ---- Estado animado ----
  const x = useRef(new Animated.Value(workerIndex * columnWidth)).current;
  const y = useRef(new Animated.Value(startSlot * slotHeight)).current;
  const hA = useRef(new Animated.Value(durationSlots * slotHeight)).current;

  // Ref mutables de estado lógico
  const currentStartSlotRef = useRef(startSlot);
  const currentDurationRef = useRef(durationSlots);
  const currentWorkerRef = useRef(workerIndex);

  // Vista previa (durante drag/resize)
  const [preview, setPreview] = useState<string | null>(null);
  // Texto horario en reposo (actualizado al soltar)
  const [displayedTime, setDisplayedTime] = useState(`${event.startTime} - ${event.endTime}`);
  const [dragging, setDragging] = useState(false);
  const [resizingTop, setResizingTop] = useState(false);
  const [resizingBottom, setResizingBottom] = useState(false);
  const movedDuringGestureRef = useRef(false);
  const longPressReadyRef = useRef(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const LONG_PRESS_MS = 380;

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const updatePreview = (startS: number, durS: number) => {
    const st = slotsToTime(startS);
    const et = slotsToTime(startS + durS);
    setPreview(`${st} - ${et}`);
  };

  // ---- Drag principal ----
  const dragInitialXRef = useRef(0);
  const dragInitialYRef = useRef(0);
  const scrollAtDragStartRef = useRef(0);
  const lastGestureDyRef = useRef(0);
  const edgeDirectionRef = useRef<0 | 1 | -1>(0);
  const autoScrollLoopRunningRef = useRef(false);
  const resizeInitialStartRef = useRef(0);
  const resizeInitialDurationRef = useRef(0);
  // Columna animada temporal durante el drag (antes de confirmar onRelease)
  const draggingWorkerRef = useRef(workerIndex);
  const horizontalAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  const lastHeightRef = useRef(durationSlots * slotHeight);
  useEffect(() => {
    lastHeightRef.current = (hA as any)._value ?? durationSlots * slotHeight;
  }, [durationSlots, slotHeight, hA]);

  const moveResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        if (resizingTop || resizingBottom) return false;
        const yLoc = evt.nativeEvent.locationY;
        const topZone = 56;
        const bottomZone = 56;
        const cardH = currentDurationRef.current * slotHeight;
        if (yLoc <= topZone || yLoc >= cardH - bottomZone) return false;
        return true;
      },
      onMoveShouldSetPanResponder: (evt, g) => {
        if (resizingTop || resizingBottom) return false;
        const yLoc = evt.nativeEvent.locationY;
        const topZone = 56;
        const bottomZone = 56;
        const cardH = currentDurationRef.current * slotHeight;
        if (yLoc <= topZone || yLoc >= cardH - bottomZone) return false;
        return (Math.abs(g.dx) > 2 || Math.abs(g.dy) > 2);
      },
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: () => {
        movedDuringGestureRef.current = false;
        longPressReadyRef.current = false;
        holdTimerRef.current && clearTimeout(holdTimerRef.current);
        holdTimerRef.current = setTimeout(() => {
          longPressReadyRef.current = true;
            setDragging(true);
            // Bloquear scroll solo ahora que inicia drag real
            onDragStateChange?.(true);
            dragInitialXRef.current = (x as any)._value ?? workerIndex * columnWidth;
            dragInitialYRef.current = (y as any)._value ?? startSlot * slotHeight;
            scrollAtDragStartRef.current = currentScrollY;
            updatePreview(currentStartSlotRef.current, currentDurationRef.current);
        }, LONG_PRESS_MS);
      },
      onPanResponderMove: (_, g) => {
        if (Math.abs(g.dx) > 1 || Math.abs(g.dy) > 1) movedDuringGestureRef.current = true;
        lastGestureDyRef.current = g.dy;
        if (!longPressReadyRef.current) {
          if (Math.abs(g.dx) > 10 || Math.abs(g.dy) > 10) {
            // Detectamos intención de scroll normal: cancelar long press y NO bloquear scroll
            holdTimerRef.current && clearTimeout(holdTimerRef.current);
          }
          return;
        }
        if (continuousDrag) {
          // Movimiento vertical libre; horizontal snapea progresivamente a columnas con animación.
          const rawX = clamp(dragInitialXRef.current + g.dx, 0, (totalColumns - 1) * columnWidth);
          const colFloat = rawX / columnWidth;
          const nextCol = clamp(Math.round(colFloat), 0, totalColumns - 1);
          if (nextCol !== draggingWorkerRef.current) {
            // Iniciar animación hacia la nueva columna
            horizontalAnimRef.current && (horizontalAnimRef.current as any).stop?.();
            const targetX = nextCol * columnWidth;
            horizontalAnimRef.current = Animated.timing(x, { toValue: targetX, duration: 140, useNativeDriver: false });
            horizontalAnimRef.current.start(() => { horizontalAnimRef.current = null; });
            draggingWorkerRef.current = nextCol;
          }
          const maxTopPx = (maxSlots - currentDurationRef.current) * slotHeight;
          const scrollDeltaSinceStart = currentScrollY - scrollAtDragStartRef.current;
          let tentativeY = dragInitialYRef.current + g.dy + scrollDeltaSinceStart;
          if (!resizingTop && !resizingBottom && viewportHeight && onAutoScroll) {
            if (tentativeY < 0) {
              onAutoScroll(tentativeY);
              tentativeY = 0;
              edgeDirectionRef.current = -1;
            } else if (tentativeY > maxTopPx) {
              const extra = tentativeY - maxTopPx;
              onAutoScroll(extra);
              tentativeY = maxTopPx;
              edgeDirectionRef.current = 1;
            } else {
              const edge = autoScrollEdgeThreshold;
              const cardBottom = tentativeY + currentDurationRef.current * slotHeight;
              const distanceTop = tentativeY;
              if (distanceTop < edge) {
                const factor = 1 - distanceTop / edge;
                onAutoScroll(-autoScrollSpeed * factor);
                edgeDirectionRef.current = -1;
              } else if ((cardBottom) > (maxTopPx + currentDurationRef.current * slotHeight - edge)) {
                const overlap = cardBottom - (maxTopPx + currentDurationRef.current * slotHeight - edge);
                const factor = Math.min(1, overlap / edge);
                onAutoScroll(autoScrollSpeed * factor);
                edgeDirectionRef.current = 1;
              } else {
                edgeDirectionRef.current = 0;
              }
            }
          }
          const finalY = clamp(tentativeY, 0, maxTopPx);
          y.setValue(finalY);
          const provisionalStartSlot = Math.round(finalY / slotHeight);
          updatePreview(provisionalStartSlot, currentDurationRef.current);
        } else {
          const dCols = Math.round(g.dx / columnWidth);
          const dRows = Math.round(g.dy / slotHeight);
          const targetWorker = clamp(currentWorkerRef.current + dCols, 0, totalColumns - 1);
          const targetStart = clamp(currentStartSlotRef.current + dRows, 0, maxSlots - currentDurationRef.current);
          x.setValue(targetWorker * columnWidth);
          y.setValue(targetStart * slotHeight);
          updatePreview(targetStart, currentDurationRef.current);
        }
      },
      onPanResponderRelease: (_, g) => {
        holdTimerRef.current && clearTimeout(holdTimerRef.current);
        // Ajuste: considerar drag válido si el longPress se completó aunque 'dragging' no se haya activado correctamente.
        const dragExecuted = longPressReadyRef.current; // Eliminamos la dependencia de 'dragging'
        const wasMove = movedDuringGestureRef.current && dragExecuted;
        edgeDirectionRef.current = 0;
        autoScrollLoopRunningRef.current = false;
        let finalWorker: number;
        let finalStart: number;
        // (debug logs removed)
        if (continuousDrag && dragExecuted) {
          const currentY = (y as any)._value ?? startSlot * slotHeight;
          // Usar la última columna snapeada
          finalWorker = draggingWorkerRef.current;
          finalStart = clamp(Math.round(currentY / slotHeight), 0, maxSlots - currentDurationRef.current);
          // (debug logs removed)
          Animated.parallel([
            Animated.timing(x, { toValue: finalWorker * columnWidth, duration: 110, useNativeDriver: false }),
            Animated.timing(y, { toValue: finalStart * slotHeight, duration: 110, useNativeDriver: false })
          ]).start(() => {
            currentWorkerRef.current = finalWorker;
            currentStartSlotRef.current = finalStart;
            setDragging(false);
            setPreview(null);
            const st = slotsToTime(finalStart);
            const et = slotsToTime(finalStart + currentDurationRef.current);
            setDisplayedTime(`${st} - ${et}`);
            if (wasMove) {
              const st = slotsToTime(finalStart);
              const et = slotsToTime(finalStart + currentDurationRef.current);
              onMove(finalWorker, finalStart * slotHeight, currentDurationRef.current * slotHeight, st, et);
            } else {
              onPress();
            }
            onDragStateChange?.(false);
          });
        } else if (!continuousDrag && dragExecuted) {
          const dCols = Math.round(g.dx / columnWidth);
          const dRows = Math.round(g.dy / slotHeight);
          finalWorker = clamp(currentWorkerRef.current + dCols, 0, totalColumns - 1);
          draggingWorkerRef.current = finalWorker;
          finalStart = clamp(currentStartSlotRef.current + dRows, 0, maxSlots - currentDurationRef.current);
          // (debug logs removed)
          if (true) {
            // (debug logs removed)
          }
          currentWorkerRef.current = finalWorker;
          currentStartSlotRef.current = finalStart;
          Animated.parallel([
            Animated.timing(x, { toValue: finalWorker * columnWidth, duration: 110, useNativeDriver: false }),
            Animated.timing(y, { toValue: finalStart * slotHeight, duration: 110, useNativeDriver: false })
          ]).start(() => {
            setDragging(false);
            setPreview(null);
            const st = slotsToTime(finalStart);
            const et = slotsToTime(finalStart + currentDurationRef.current);
            setDisplayedTime(`${st} - ${et}`);
            if (wasMove) {
              const st = slotsToTime(finalStart);
              const et = slotsToTime(finalStart + currentDurationRef.current);
              onMove(finalWorker, finalStart * slotHeight, currentDurationRef.current * slotHeight, st, et);
            } else {
              onPress();
            }
            onDragStateChange?.(false);
          });
        } else {
          // (debug logs removed)
          const moved = Math.abs(g.dx) > 2 || Math.abs(g.dy) > 2 || movedDuringGestureRef.current;
          setDragging(false);
          setPreview(null);
          if (!moved) {
            onPress();
          }
          onDragStateChange?.(false);
        }
        // Asegurar liberar scroll si se había bloqueado temprano
      },
      onPanResponderTerminate: () => {
        holdTimerRef.current && clearTimeout(holdTimerRef.current);
        setDragging(false);
        setPreview(null);
        onDragStateChange?.(false);
      }
    })
  ).current;

  // Auto-scroll loop
  useEffect(() => {
    if (!dragging || resizingTop || resizingBottom) {
      autoScrollLoopRunningRef.current = false;
      edgeDirectionRef.current = 0;
      return;
    }
    if (autoScrollLoopRunningRef.current) return;
    if (edgeDirectionRef.current === 0) return;
    autoScrollLoopRunningRef.current = true;
    const loop = () => {
      if (!dragging || edgeDirectionRef.current === 0) {
        autoScrollLoopRunningRef.current = false;
        return;
      }
      if (onAutoScroll && viewportHeight) {
        onAutoScroll(edgeDirectionRef.current * autoScrollSpeed);
        const maxTopPx = (maxSlots - currentDurationRef.current) * slotHeight;
        const scrollDeltaSinceStart = currentScrollY - scrollAtDragStartRef.current;
        let tentativeY = dragInitialYRef.current + lastGestureDyRef.current + scrollDeltaSinceStart;
        tentativeY = clamp(tentativeY, 0, maxTopPx);
        y.setValue(tentativeY);
        const provisionalStartSlot = Math.round(tentativeY / slotHeight);
        updatePreview(provisionalStartSlot, currentDurationRef.current);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }, [dragging, resizingTop, resizingBottom, currentScrollY, autoScrollSpeed, viewportHeight]);

  // ---- Resize top ----
  const topResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setResizingTop(true);
        onDragStateChange?.(true);
        updatePreview(currentStartSlotRef.current, currentDurationRef.current);
        holdTimerRef.current && clearTimeout(holdTimerRef.current);
        resizeInitialStartRef.current = currentStartSlotRef.current;
        resizeInitialDurationRef.current = currentDurationRef.current;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, g) => {
        const dSlots = Math.round(g.dy / slotHeight);
        const baseStart = resizeInitialStartRef.current;
        const baseDur = resizeInitialDurationRef.current;
        let newStart = clamp(baseStart + dSlots, 0, baseStart + baseDur - 1);
        let newDur = (baseStart + baseDur) - newStart;
        if (newDur < 1) { newDur = 1; newStart = baseStart + baseDur - 1; }
        y.setValue(newStart * slotHeight);
        hA.setValue(newDur * slotHeight);
        updatePreview(newStart, newDur);
      },
      onPanResponderRelease: (_, g) => {
        const dSlots = Math.round(g.dy / slotHeight);
        const baseStart = resizeInitialStartRef.current;
        const baseDur = resizeInitialDurationRef.current;
        let newStart = clamp(baseStart + dSlots, 0, baseStart + baseDur - 1);
        let newDur = (baseStart + baseDur) - newStart;
        if (newDur < 1) { newDur = 1; newStart = baseStart + baseDur - 1; }
        currentStartSlotRef.current = newStart;
        currentDurationRef.current = newDur;
        Animated.parallel([
          Animated.timing(y, { toValue: newStart * slotHeight, duration: 90, useNativeDriver: false }),
          Animated.timing(hA, { toValue: newDur * slotHeight, duration: 90, useNativeDriver: false })
        ]).start(() => {
          setResizingTop(false);
          const st = slotsToTime(newStart);
          const et = slotsToTime(newStart + newDur);
          onResize(st, et);
          setDisplayedTime(`${st} - ${et}`);
          setPreview(null);
          onDragStateChange?.(false);
        });
      },
      onPanResponderTerminate: () => { setResizingTop(false); setPreview(null); onDragStateChange?.(false); }
    })
  ).current;

  // ---- Resize bottom ----
  const bottomResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setResizingBottom(true);
        onDragStateChange?.(true);
        updatePreview(currentStartSlotRef.current, currentDurationRef.current);
        holdTimerRef.current && clearTimeout(holdTimerRef.current);
        resizeInitialStartRef.current = currentStartSlotRef.current;
        resizeInitialDurationRef.current = currentDurationRef.current;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, g) => {
        const dSlots = Math.round(g.dy / slotHeight);
        const baseDur = resizeInitialDurationRef.current;
        const baseStart = resizeInitialStartRef.current;
        let newDur = clamp(baseDur + dSlots, 1, maxSlots - baseStart);
        hA.setValue(newDur * slotHeight);
        updatePreview(currentStartSlotRef.current, newDur);
      },
      onPanResponderRelease: (_, g) => {
        const dSlots = Math.round(g.dy / slotHeight);
        const baseDur = resizeInitialDurationRef.current;
        const baseStart = resizeInitialStartRef.current;
        let newDur = clamp(baseDur + dSlots, 1, maxSlots - baseStart);
        currentDurationRef.current = newDur;
        Animated.timing(hA, { toValue: newDur * slotHeight, duration: 90, useNativeDriver: false }).start(() => {
          setResizingBottom(false);
          const st = slotsToTime(currentStartSlotRef.current);
          const et = slotsToTime(currentStartSlotRef.current + newDur);
          onResize(st, et);
          setDisplayedTime(`${st} - ${et}`);
          setPreview(null);
          onDragStateChange?.(false);
        });
      },
      onPanResponderTerminate: () => { setResizingBottom(false); setPreview(null); onDragStateChange?.(false); }
    })
  ).current;

  const width = columnWidth - widthOffset; // dejar margen lateral

  // ---- Sincronizar cambios externos (por ejemplo, colisión que ajusta horario) ----
  useEffect(() => {
    // Recalcular slots con props actuales
    const extStart = timeToSlots(event.startTime);
    const extEnd = timeToSlots(event.endTime);
    const extDuration = Math.max(1, extEnd - extStart);
    let needsAnim = false;
    const anims: Animated.CompositeAnimation[] = [];
    if (extStart !== currentStartSlotRef.current) {
      currentStartSlotRef.current = extStart;
      anims.push(Animated.timing(y, { toValue: extStart * slotHeight, duration: 140, useNativeDriver: false }));
      needsAnim = true;
    }
    if (extDuration !== currentDurationRef.current) {
      currentDurationRef.current = extDuration;
      anims.push(Animated.timing(hA, { toValue: extDuration * slotHeight, duration: 140, useNativeDriver: false }));
      needsAnim = true;
    }
    if (workerIndex !== currentWorkerRef.current) {
      currentWorkerRef.current = workerIndex;
      anims.push(Animated.timing(x, { toValue: workerIndex * columnWidth, duration: 140, useNativeDriver: false }));
      needsAnim = true;
    }
    if (needsAnim) Animated.parallel(anims).start();
    setDisplayedTime(`${event.startTime} - ${event.endTime}`);
  }, [event.startTime, event.endTime, workerIndex]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          left: x,
          top: y,
          height: hA,
          width,
          backgroundColor: event.color || '#1976D2',
          borderLeftColor: event.color || '#1976D2'
        },
        (dragging || resizingTop || resizingBottom) && styles.active
      ]}
      {...moveResponder.panHandlers}
    >
      {/* Línea superior (resize start) - zona verde ampliada */}
      <View style={styles.internalHandleTop} {...topResponder.panHandlers}>
        <View style={styles.internalLine} />
      </View>
      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.time} numberOfLines={1} selectable={false}>{preview || displayedTime}</Text>
        <Text style={styles.title} numberOfLines={1} selectable={false}>{event.cliente?.nombre}</Text>
        <View style={styles.services}>
          {event.detalles.slice(0,2).map((d,i)=> (
            <Text key={i} style={styles.service} numberOfLines={1} selectable={false}>• {d.servicio.nombre}</Text>
          ))}
          {event.detalles.length > 2 && <Text style={styles.more} selectable={false}>+{event.detalles.length - 2} más</Text>}
        </View>
      </View>
      {/* Línea inferior (resize end) - zona verde ampliada */}
      <View style={styles.internalHandleBottom} {...bottomResponder.panHandlers}>
        <View style={styles.internalLine} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    borderRadius: 8,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    borderLeftWidth: 4,
    overflow: 'visible',
    // Evitar selección de texto en web
    userSelect: 'none' as any,
  },
  active: {
    // Mantener estilos sutiles sin elevar sobre otras tarjetas
    shadowOpacity: 0.28,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)'
  },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 10, paddingBottom: 10 },
  time: { fontSize: 11, fontWeight: '700', color: '#fff', marginBottom: 2 },
  title: { fontSize: 12, fontWeight: '600', color: '#fff', marginBottom: 2 },
  services: { width: '100%' },
  service: { fontSize: 10, color: 'rgba(255,255,255,0.85)' },
  more: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' },
  internalHandleTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', zIndex: 10, pointerEvents: 'box-only' as any },
  internalHandleBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', zIndex: 10, pointerEvents: 'box-only' as any },
  internalLine: { height: 5, borderRadius: 3, backgroundColor: '#FFFFFF', width: '55%', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 2, shadowOffset: { width:0, height:1 } },
});

export default ResizableAppointmentCard;
