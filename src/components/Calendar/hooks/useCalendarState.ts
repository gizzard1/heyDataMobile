/**
 * Calendar State Hook - HeyData Mobile
 * Hook personalizado para manejar el estado del calendario
 * 
 * @format
 */

import { useState, useRef } from 'react';
import { Animated } from 'react-native';
import { CalendarEvent, ViewMode, FloatingButtonAnimations } from '../types';
import { WORKERS, SAMPLE_EVENTS } from '../utils/constants';
import { navigateDate } from '../utils/calendarUtils';

export const useCalendarState = () => {
  // Estados principales
  const [activeTab, setActiveTab] = useState('Agenda');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  // Estados para filtro
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);
  
  // Estados para detalles de cita
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  
  // Estados para pantallas modales
  const [showClientsScreen, setShowClientsScreen] = useState(false);
  const [showSettingsScreen, setShowSettingsScreen] = useState(false);
  const [showNotificationsScreen, setShowNotificationsScreen] = useState(false);
  const [showCreateAppointmentScreen, setShowCreateAppointmentScreen] = useState(false);
  const [showCreateSaleScreen, setShowCreateSaleScreen] = useState(false);
  const [showProductsScreen, setShowProductsScreen] = useState(false);
  
  // Estados para botones flotantes
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);
  
  // Estados para resize de tarjetas
  const [anyCardInResizeMode, setAnyCardInResizeMode] = useState(false);
  const resizingCardRef = useRef<string | null>(null);
  
  // Estado de eventos
  const [events, setEvents] = useState<CalendarEvent[]>(SAMPLE_EVENTS);

  // Animaciones para botones flotantes
  const floatingAnimations: FloatingButtonAnimations = {
    leftButtonAnimation: useRef(new Animated.Value(0)).current,
    centerButtonAnimation: useRef(new Animated.Value(0)).current,
    rightButtonAnimation: useRef(new Animated.Value(0)).current,
    buttonOpacityAnimation: useRef(new Animated.Value(0)).current,
  };

  // Funciones para navegación de fechas
  const handleNavigateDate = (direction: 'prev' | 'next') => {
    const newDate = navigateDate(currentDate, direction, viewMode);
    setCurrentDate(newDate);
  };

  const handleNavigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Funciones para filtros
  const handleWorkerToggle = (workerId: string) => {
    setSelectedWorkers(prev => 
      prev.includes(workerId) 
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  const setAllWorkers = () => {
    setSelectedWorkers(WORKERS.map(w => w.id));
  };

  const clearAllWorkers = () => {
    setSelectedWorkers([]);
  };

  const applyFilters = () => {
    if (selectedWorkers.length === 0) {
      setSelectedWorkers(WORKERS.map(w => w.id));
    }
    setShowFilterModal(false);
  };

  // Funciones para eventos
  const openEventDetails = (event: CalendarEvent) => {
    const validEvent = {
      ...event,
      title: event.title || 'Sin título',
      worker: event.worker || 'Sin asignar',
      startTime: event.startTime || '00:00',
      endTime: event.endTime || '01:00',
      date: event.date || '2025-09-21'
    };
    setSelectedEvent(validEvent);
    setShowEventModal(true);
  };

  const closeEventDetails = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  // Funciones para eliminar cita
  const handleDeleteAppointment = () => {
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteAppointment = () => {
    if (selectedEvent) {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== selectedEvent.id));
      setShowDeleteConfirmModal(false);
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };

  const cancelDeleteAppointment = () => {
    setShowDeleteConfirmModal(false);
  };

  // Funciones para redimensionar citas
  const handleAppointmentResize = (eventId: string, newStartTime: string, newEndTime: string) => {
    setEvents(prevEvents => {
      const startHourBase = 9;
      const endHourLimit = 18;
      const intervalMinutes = 15;

      const timeToMin = (t: string) => { const [h,m] = t.split(':').map(Number); return h*60+m; };
      const minToTime = (mTotal: number) => {
        const h = Math.floor(mTotal/60); const m = mTotal%60; const pad=(n:number)=>n.toString().padStart(2,'0');
        return `${pad(h)}:${pad(m)}`;
      };

      return prevEvents.map(event => {
        if (event.id !== eventId) return event;
        const workerName = event.worker;
        let desiredStart = timeToMin(newStartTime);
        let desiredEnd = timeToMin(newEndTime);
        const duration = desiredEnd - desiredStart;

        // Asegurar límites día
        desiredStart = Math.max(startHourBase*60, desiredStart);
        desiredEnd = desiredStart + duration;
        if (desiredEnd > endHourLimit*60) desiredEnd = endHourLimit*60;
        let adjusted = true;
        const others = prevEvents.filter(ev => ev.id !== eventId && ev.worker === workerName)
          .map(ev => ({
            start: timeToMin(ev.startTime),
            end: timeToMin(ev.endTime)
          }))
          .sort((a,b)=>a.start-b.start);

        const overlaps = (s:number,e:number,oS:number,oE:number)=> s < oE && e > oS;
        let guard = 0;
        while (adjusted && guard < 100) {
          guard++;
          const conflict = others.find(o => overlaps(desiredStart, desiredEnd, o.start, o.end));
          if (!conflict) {
            adjusted = false; // libre
          } else {
            // Mover justo después del conflicto
            desiredStart = conflict.end;
            // Snap a intervalo
            const mod = (desiredStart - startHourBase*60) % intervalMinutes;
            if (mod !== 0) desiredStart += (intervalMinutes - mod);
            desiredEnd = desiredStart + duration;
            if (desiredEnd > endHourLimit*60) {
              // No cabe, revertimos a tiempos originales
              return event; 
            }
          }
        }
        return {
          ...event,
          startTime: minToTime(desiredStart),
          endTime: minToTime(desiredEnd)
        };
      });
    });
  };

  const handleResizeModeChange = (eventId: string, isResizing: boolean) => {
    if (isResizing) {
      setAnyCardInResizeMode(true);
      resizingCardRef.current = eventId;
    } else {
      setAnyCardInResizeMode(false);
      resizingCardRef.current = null;
    }
  };

  const cancelAllResizeModes = () => {
    setAnyCardInResizeMode(false);
    resizingCardRef.current = null;
  };

  // Funciones para mover citas
  const handleAppointmentMove = (eventId: string, newWorkerIndex: number, newTimePosition?: number, newHeightPx?: number) => {
    // Nueva lógica: slotHeight = 35px representa intervalMinutes = 15
    if (newTimePosition == null) return;
    const slotHeight = 35; // px por slot
    const intervalMinutes = 15; // minutos por slot
    const startHourBase = 9; // horario de inicio visible
    // Calcular slot flotante y snapear
    const rawSlots = newTimePosition / slotHeight; // slots desde inicio
    const snappedSlots = Math.round(rawSlots); // ya que cada slot = 15min queremos alineación perfecta
    const startMinutesFromBase = snappedSlots * intervalMinutes;
    const startTotalMinutes = startHourBase * 60 + startMinutesFromBase;

    setEvents(prev => {
      const startHourBase = 9;
      const endHourLimit = 18;
      const timeToMin = (t: string) => { const [h,m]=t.split(':').map(Number); return h*60+m; };
      const minToTime = (mTotal: number) => { const h=Math.floor(mTotal/60); const m=mTotal%60; const pad=(n:number)=>n.toString().padStart(2,'0'); return `${pad(h)}:${pad(m)}`; };
      const newWorker = WORKERS[newWorkerIndex];
      return prev.map(ev => {
        if (ev.id !== eventId) return ev;
        // Duración previa o derivada de altura
        let durationMinutes: number;
        if (typeof newHeightPx === 'number' && newHeightPx > 0) {
          const rawDurationSlots = newHeightPx / slotHeight;
          const snappedDurationSlots = Math.max(1, Math.round(rawDurationSlots));
          durationMinutes = snappedDurationSlots * intervalMinutes;
        } else {
          durationMinutes = timeToMin(ev.endTime) - timeToMin(ev.startTime);
        }
        let desiredStart = startTotalMinutes; // calculado arriba
        let desiredEnd = desiredStart + durationMinutes;
        if (desiredEnd > endHourLimit*60) desiredEnd = endHourLimit*60;
        // Ajustar duración si se recortó por límite
        durationMinutes = desiredEnd - desiredStart;

        // Colisiones con eventos de mismo worker destino
        const targetWorkerName = newWorker?.name || ev.worker;
        const others = prev.filter(o => o.id !== ev.id && (o.worker === targetWorkerName))
          .map(o => ({ start: timeToMin(o.startTime), end: timeToMin(o.endTime) }))
          .sort((a,b)=>a.start-b.start);
        const overlaps = (s:number,e:number,oS:number,oE:number)=> s < oE && e > oS;
        let guard = 0;
        while (guard < 100) {
          guard++;
            const conflict = others.find(o => overlaps(desiredStart, desiredEnd, o.start, o.end));
            if (!conflict) break;
            desiredStart = conflict.end; // empujar al final
            // Snap a intervalo de 15
            const mod = (desiredStart - startHourBase*60) % intervalMinutes;
            if (mod !== 0) desiredStart += (intervalMinutes - mod);
            desiredEnd = desiredStart + durationMinutes;
            if (desiredEnd > endHourLimit*60) {
              // No cabe; revertir a tiempos originales
              return ev;
            }
        }
        return {
          ...ev,
          worker: targetWorkerName,
          startTime: minToTime(desiredStart),
          endTime: minToTime(desiredEnd)
        };
      });
    });
  };

  return {
    // Estados
    activeTab,
    currentDate,
    viewMode,
    selectedDate,
    showMonthPicker,
    showFilterModal,
    selectedWorkers,
    onlyMyTasks,
    showEventModal,
    selectedEvent,
    showAppointmentDetail,
    showPaymentScreen,
    showDeleteConfirmModal,
    showClientsScreen,
    showSettingsScreen,
    showNotificationsScreen,
    showCreateAppointmentScreen,
    showCreateSaleScreen,
    showProductsScreen,
    showFloatingButtons,
    anyCardInResizeMode,
    events,
    floatingAnimations,

    // Setters
    setActiveTab,
    setCurrentDate,
    setViewMode,
    setSelectedDate,
    setShowMonthPicker,
    setShowFilterModal,
    setSelectedWorkers,
    setOnlyMyTasks,
    setShowEventModal,
    setSelectedEvent,
    setShowAppointmentDetail,
    setShowPaymentScreen,
    setShowDeleteConfirmModal,
    setShowClientsScreen,
    setShowSettingsScreen,
    setShowNotificationsScreen,
    setShowCreateAppointmentScreen,
    setShowCreateSaleScreen,
    setShowProductsScreen,
    setShowFloatingButtons,
    setAnyCardInResizeMode,
    setEvents,

    // Funciones
    handleNavigateDate,
    handleNavigateMonth,
    handleWorkerToggle,
    setAllWorkers,
    clearAllWorkers,
    applyFilters,
    openEventDetails,
    closeEventDetails,
    handleDeleteAppointment,
    confirmDeleteAppointment,
    cancelDeleteAppointment,
    handleAppointmentResize,
    handleResizeModeChange,
    cancelAllResizeModes,
    handleAppointmentMove,
  };
};
