/**
 * ResizableAppointmentCard (Grid Based) - HeyData Mobile
 * Tarjeta de cita basada en celdas (slots) de tamaño fijo.
 * - Cada slot = intervalMinutes
 * - Altura = durationSlots * slotHeight
 * - Posición vertical = startSlot * slotHeight
 * - Posición horizontal = workerIndex * columnWidth
 * Soporta: mover (drag), resize top, resize bottom.
 */

import React, { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  onMove: (newWorkerIndex: number, newTopPx: number, newHeightPx: number) => void;
  onResize: (newStartTime: string, newEndTime: string) => void;
  widthOffset?: number;     // margen interno opcional
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

  // Vista previa
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [resizingTop, setResizingTop] = useState(false);
  const [resizingBottom, setResizingBottom] = useState(false);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const updatePreview = (startS: number, durS: number) => {
    const st = slotsToTime(startS);
    const et = slotsToTime(startS + durS);
    setPreview(`${st} - ${et}`);
  };

  // ---- Drag principal ----
  const moveResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !resizingTop && !resizingBottom,
      onPanResponderGrant: () => {
        setDragging(true);
        updatePreview(currentStartSlotRef.current, currentDurationRef.current);
      },
      onPanResponderMove: (_, g) => {
        const dCols = Math.round(g.dx / columnWidth);
        const dRows = Math.round(g.dy / slotHeight);
        const targetWorker = clamp(currentWorkerRef.current + dCols, 0, totalColumns - 1);
        const targetStart = clamp(currentStartSlotRef.current + dRows, 0, maxSlots - currentDurationRef.current);
        x.setValue(targetWorker * columnWidth);
        y.setValue(targetStart * slotHeight);
        updatePreview(targetStart, currentDurationRef.current);
      },
      onPanResponderRelease: (_, g) => {
        const dCols = Math.round(g.dx / columnWidth);
        const dRows = Math.round(g.dy / slotHeight);
        const finalWorker = clamp(currentWorkerRef.current + dCols, 0, totalColumns - 1);
        const finalStart = clamp(currentStartSlotRef.current + dRows, 0, maxSlots - currentDurationRef.current);
        currentWorkerRef.current = finalWorker;
        currentStartSlotRef.current = finalStart;
        Animated.parallel([
          Animated.timing(x, { toValue: finalWorker * columnWidth, duration: 110, useNativeDriver: false }),
          Animated.timing(y, { toValue: finalStart * slotHeight, duration: 110, useNativeDriver: false })
        ]).start(() => {
          setDragging(false);
          setPreview(null);
          onMove(finalWorker, finalStart * slotHeight, currentDurationRef.current * slotHeight);
        });
      },
      onPanResponderTerminate: () => { setDragging(false); setPreview(null); }
    })
  ).current;

  // ---- Resize top ----
  const topResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { setResizingTop(true); updatePreview(currentStartSlotRef.current, currentDurationRef.current); },
      onPanResponderMove: (_, g) => {
        const dSlots = Math.round(g.dy / slotHeight);
        // nuevo inicio no puede pasar el final-1
        let newStart = clamp(startSlot + dSlots, 0, startSlot + currentDurationRef.current - 1);
        let newDur = (startSlot + currentDurationRef.current) - newStart;
        if (newDur < 1) { newDur = 1; newStart = startSlot + currentDurationRef.current - 1; }
        y.setValue(newStart * slotHeight);
        hA.setValue(newDur * slotHeight);
        updatePreview(newStart, newDur);
      },
      onPanResponderRelease: (_, g) => {
        const dSlots = Math.round(g.dy / slotHeight);
        let newStart = clamp(startSlot + dSlots, 0, startSlot + currentDurationRef.current - 1);
        let newDur = (startSlot + currentDurationRef.current) - newStart;
        if (newDur < 1) { newDur = 1; newStart = startSlot + currentDurationRef.current - 1; }
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
          setPreview(null);
        });
      },
      onPanResponderTerminate: () => { setResizingTop(false); setPreview(null); }
    })
  ).current;

  // ---- Resize bottom ----
  const bottomResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { setResizingBottom(true); updatePreview(currentStartSlotRef.current, currentDurationRef.current); },
      onPanResponderMove: (_, g) => {
        const dSlots = Math.round(g.dy / slotHeight);
        let newDur = clamp(durationSlots + dSlots, 1, maxSlots - currentStartSlotRef.current);
        hA.setValue(newDur * slotHeight);
        updatePreview(currentStartSlotRef.current, newDur);
      },
      onPanResponderRelease: (_, g) => {
        const dSlots = Math.round(g.dy / slotHeight);
        let newDur = clamp(durationSlots + dSlots, 1, maxSlots - currentStartSlotRef.current);
        currentDurationRef.current = newDur;
        Animated.timing(hA, { toValue: newDur * slotHeight, duration: 90, useNativeDriver: false }).start(() => {
          setResizingBottom(false);
          const st = slotsToTime(currentStartSlotRef.current);
          const et = slotsToTime(currentStartSlotRef.current + newDur);
            onResize(st, et);
            setPreview(null);
        });
      },
      onPanResponderTerminate: () => { setResizingBottom(false); setPreview(null); }
    })
  ).current;

  const width = columnWidth - widthOffset; // dejar margen lateral

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
      {/* Handle superior */}
      <View style={styles.handleTop} {...topResponder.panHandlers}>
        <View style={styles.handleBar} />
      </View>
      {/* Contenido */}
      <TouchableOpacity style={styles.content} activeOpacity={0.8} onPress={onPress}>
        <Text style={styles.time} numberOfLines={1}>{preview || `${event.startTime} - ${event.endTime}`}</Text>
        <Text style={styles.title} numberOfLines={1}>{event.cliente?.nombre}</Text>
        <View style={styles.services}>
          {event.detalles.slice(0,2).map((d,i)=> (
            <Text key={i} style={styles.service} numberOfLines={1}>• {d.servicio.nombre}</Text>
          ))}
          {event.detalles.length > 2 && <Text style={styles.more}>+{event.detalles.length - 2} más</Text>}
        </View>
      </TouchableOpacity>
      {/* Handle inferior */}
      <View style={styles.handleBottom} {...bottomResponder.panHandlers}>
        <View style={styles.handleBar} />
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
    overflow: 'visible'
  },
  active: {
    elevation: 10,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#fff'
  },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 10, paddingBottom: 10 },
  time: { fontSize: 11, fontWeight: '700', color: '#fff', marginBottom: 2 },
  title: { fontSize: 12, fontWeight: '600', color: '#fff', marginBottom: 2 },
  services: { width: '100%' },
  service: { fontSize: 10, color: 'rgba(255,255,255,0.85)' },
  more: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' },
  handleTop: { position: 'absolute', top: -10, left: 0, right: 0, height: 16, alignItems: 'center', justifyContent: 'center' },
  handleBottom: { position: 'absolute', bottom: -10, left: 0, right: 0, height: 16, alignItems: 'center', justifyContent: 'center' },
  handleBar: { width: 34, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.9)' }
});

export default ResizableAppointmentCard;
