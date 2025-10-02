/**
 * ResizableAppointmentCard (Grid Based) - HeyData Mobile
 * ------------------------------------------------------
 * Tarjeta interactiva que representa una cita en el calendario diario.
 * El grid temporal se modela en "slots" (intervalos fijos en minutos).
 *
 * REGLAS BÁSICAS DE POSICIONAMIENTO:
 *  - Cada slot representa intervalMinutes (p.ej. 15 min).
 *  - Altura (height)  = durationSlots * slotHeight.
 *  - Posición Y (top) = startSlot * slotHeight.
 *  - Posición X (left)= workerIndex * columnWidth.
 *
 * INTERACCIONES SOPORTADAS:
 *  - Drag (largo + mover): Cambia de columna (trabajadora) y horario.
 *  - Resize superior: Ajusta hora de inicio (startTime).
 *  - Resize inferior: Ajusta hora de fin (endTime).
 *
 * ESTRATEGIA DE GESTOS:
 *  - Se usa un long press (380ms) antes de activar el modo drag real.
 *  - Durante el drag continuo (continuousDrag=true) el eje vertical es libre
 *    y el horizontal hace snap animado a columnas.
 *  - Al soltar se calculan start/end definitivos y se envían via onMove / onResize.
 *
 * SINCRONIZACIÓN EXTERNA:
 *  - Si el padre cambia start/end/worker desde afuera, un efecto reactualiza animaciones.
 *
 * NOTA: La lógica se ha mantenido en un solo componente (con dependencias
 *       extraídas a utilidades y estilos) para equilibrar legibilidad y número de archivos.
 */

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Animated, PanResponder, Text, View } from 'react-native';
import { timeToSlots as baseTimeToSlots, slotsToTime as baseSlotsToTime, clamp } from './Calendar/utils/timeSlot';
import { appointmentCardStyles as styles } from './Calendar/components/appointment/ResizableAppointmentCard.styles';
import { ResizableCardProps as CardProps } from './Calendar/types/appointmentCard.types';

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
  // ======================================================
  // Conversión tiempo ↔ slots (usa helpers reutilizables)
  // ======================================================
  const timeToSlots = (time: string) => baseTimeToSlots(time, startHour, intervalMinutes);
  const slotsToTime = (slots: number) => baseSlotsToTime(slots, startHour, intervalMinutes);

  const startSlot = useMemo(() => timeToSlots(event.startTime), [event.startTime]);
  const endSlot = useMemo(() => timeToSlots(event.endTime), [event.endTime]);
  const durationSlots = Math.max(1, endSlot - startSlot);
  const maxSlots = (endHour - startHour) * (60/intervalMinutes);

  // ======================================================
  // Animated Values (posición y tamaño) y estados derivados
  // x: posición horizontal (columna) | y: posición vertical | hA: altura dinámica
  // ======================================================
  const x = useRef(new Animated.Value(workerIndex * columnWidth)).current;
  const y = useRef(new Animated.Value(startSlot * slotHeight)).current;
  const hA = useRef(new Animated.Value(durationSlots * slotHeight)).current;

  // Referencias mutables (no causan re-render) para la lógica interna
  const currentStartSlotRef = useRef(startSlot);
  const currentDurationRef = useRef(durationSlots);
  const currentWorkerRef = useRef(workerIndex);

  // Vista previa de horario mientras se mueve o se redimensiona
  const [preview, setPreview] = useState<string | null>(null);
  // Texto horario persistente (actualizado tras soltar / terminar resize)
  const [displayedTime, setDisplayedTime] = useState(`${event.startTime} - ${event.endTime}`);
  const [dragging, setDragging] = useState(false);
  const [resizingTop, setResizingTop] = useState(false);
  const [resizingBottom, setResizingBottom] = useState(false);
  const movedDuringGestureRef = useRef(false);
  const longPressReadyRef = useRef(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const LONG_PRESS_MS = 380;

  // Recalcula la cadena "HH:MM - HH:MM" para mostrar mientras se manipula la tarjeta
  const updatePreview = (startS: number, durS: number) => {
    const st = slotsToTime(startS);
    const et = slotsToTime(startS + durS);
    setPreview(`${st} - ${et}`);
  };

  // ======================================================
  // DRAG PRINCIPAL (PanResponder)
  // - Gestiona long press, movimiento, auto-scroll y snapping horizontal.
  // - Llama a onMove al soltar si hubo desplazamiento real.
  // ======================================================
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

  // ======================================================
  // AUTO-SCROLL LOOP
  // Mientras la tarjeta se arrastra cerca de los bordes verticales se
  // solicita desplazamiento al contenedor padre usando onAutoScroll.
  // El loop usa requestAnimationFrame para suavizar.
  // ======================================================
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

  // ======================================================
  // RESIZE SUPERIOR
  // Ajusta hora de inicio (startTime) manteniendo el fin original.
  // ======================================================
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

  // ======================================================
  // RESIZE INFERIOR
  // Ajusta la duración extendiendo o reduciendo la hora de fin (endTime).
  // ======================================================
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

  // ======================================================
  // SINCRONIZACIÓN EXTERNA
  // Si el evento padre cambia tiempo o columna, se anima la transición
  // para evitar saltos bruscos visuales.
  // ======================================================
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

export default ResizableAppointmentCard;
