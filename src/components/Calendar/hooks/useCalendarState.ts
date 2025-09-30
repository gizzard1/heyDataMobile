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
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            startTime: newStartTime,
            endTime: newEndTime,
          };
        }
        return event;
      })
    );
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
  const handleAppointmentMove = (eventId: string, newWorkerIndex: number, newTimePosition?: number) => {
    // Esta función se implementará cuando sea necesaria
    console.log('Moving appointment:', { eventId, newWorkerIndex, newTimePosition });
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
