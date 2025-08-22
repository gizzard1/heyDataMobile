/**
 * Calendar Screen - HeyData Mobile
 * Vista completa del calendario con navegación de días, semanas y meses
 * 
 * @format
 */

import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Animated,
  PanResponder,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  date: string; // YYYY-MM-DD format
  worker: string; // Trabajadora asignada
}

interface Worker {
  id: string;
  name: string;
  color: string;
}

const CalendarScreen = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = useState('Agenda');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day'); // Cambiar default a 'day'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Variables para zoom solamente
  const scale = useRef(new Animated.Value(1)).current;

  // Estado base para zoom
  const lastScale = useRef(1);

  // Solo zoom, sin pan para evitar bugs
  const handleDoubleTap = () => {
    const newScale = lastScale.current >= 1.5 ? 1 : 2;
    lastScale.current = newScale;
    Animated.timing(scale, {
      toValue: newScale,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Para web - manejar zoom con rueda del mouse
  const handleWheel = (event: any) => {
    if (Platform.OS === 'web') {
      event.preventDefault();
      const deltaScale = event.deltaY > 0 ? -0.1 : 0.1;
      const newScale = Math.max(0.8, Math.min(3, lastScale.current + deltaScale));
      lastScale.current = newScale;
      
      Animated.timing(scale, {
        toValue: newScale,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  };

  // Trabajadoras
  const workers: Worker[] = [
    { id: '1', name: 'Norma', color: '#3498db' },
    { id: '2', name: 'Brenda', color: '#e74c3c' },
    { id: '3', name: 'Susana', color: '#9b59b6' },
    { id: '4', name: 'Andrea', color: '#2ecc71' },
    { id: '5', name: 'Isabel', color: '#f39c12' },
  ];

  // Horarios del día (de 9:00 AM a 6:00 PM)
  const timeSlots = [
    '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  // Eventos de ejemplo
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Ixchel - Luces nuevas',
      startTime: '10:00',
      endTime: '11:00',
      color: '#3498db',
      date: '2025-08-21',
      worker: 'Norma',
    },
    {
      id: '2',
      title: 'Adriana Hernández - Corte de dama',
      startTime: '11:00',
      endTime: '12:00',
      color: '#e74c3c',
      date: '2025-08-21',
      worker: 'Brenda',
    },
    {
      id: '3',
      title: 'Sandra - Peinado',
      startTime: '14:00',
      endTime: '15:00',
      color: '#9b59b6',
      date: '2025-08-21',
      worker: 'Susana',
    },
    {
      id: '4',
      title: 'María González - Tinte',
      startTime: '16:00',
      endTime: '17:30',
      color: '#2ecc71',
      date: '2025-08-21',
      worker: 'Andrea',
    },
  ]);

  // Función para resetear zoom solamente
  const resetTransform = () => {
    Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: false }).start();
    lastScale.current = 1;
  };

  // Obtener información del mes actual
  const getMonthInfo = (date: Date) => {
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

  // Navegación de fechas
  const navigateDate = (direction: 'prev' | 'next') => {
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
    setCurrentDate(newDate);
  };

  // Formatear fecha para mostrar
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  // Formatear mes y año
  const formatMonthYear = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  // Verificar si una fecha es hoy
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Verificar si una fecha está seleccionada
  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Verificar si una fecha está en el mes actual
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Obtener eventos para una fecha específica
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {viewMode === 'day' ? (
        // Header para vista diaria con selector de mes
        <>
          <TouchableOpacity 
            style={styles.monthSelector}
            onPress={() => setShowMonthPicker(!showMonthPicker)}
          >
            <Text style={styles.monthSelectorText}>
              {formatMonthYear(currentDate)}
            </Text>
            <Text style={styles.monthSelectorArrow}>▼</Text>
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>🔧</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // Header original para otras vistas
        <>
          <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {formatMonthYear(currentDate)}
            </Text>
            <View style={styles.viewModeSelector}>
              {(['day', 'week', 'month'] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[styles.viewModeButton, viewMode === mode && styles.activeViewMode]}
                  onPress={() => setViewMode(mode)}
                >
                  <Text style={[styles.viewModeText, viewMode === mode && styles.activeViewModeText]}>
                    {mode === 'day' ? 'Día' : mode === 'week' ? 'Semana' : 'Mes'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navButton}>
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);

    // Función para obtener eventos de una trabajadora en un horario específico
    const getEventForWorkerAtTime = (workerName: string, time: string) => {
      return dayEvents.find(event => 
        event.worker === workerName && 
        event.startTime <= time && 
        event.endTime > time
      );
    };

    // Función para calcular la altura del evento basado en duración
    const getEventHeight = (startTime: string, endTime: string) => {
      const start = parseFloat(startTime.replace(':', '.'));
      const end = parseFloat(endTime.replace(':', '.'));
      const duration = end - start;
      return Math.max(duration * 60, 30); // Mínimo 30px de altura
    };

    return (
      <View style={styles.dayViewContainer}>
        {/* Header con trabajadoras */}
        <View style={styles.workersHeader}>
          <View style={styles.timeColumnHeader} />
          {workers.map(worker => (
            <View key={worker.id} style={styles.workerColumn}>
              <Text style={styles.workerName}>{worker.name}</Text>
            </View>
          ))}
        </View>

        {/* Botón para resetear zoom */}
        <TouchableOpacity style={styles.resetButton} onPress={resetTransform}>
          <Text style={styles.resetButtonText}>↻</Text>
        </TouchableOpacity>

        {/* Contenido con zoom solamente */}
        <View style={styles.gestureWrapper}>
          <Animated.View
            style={[
              styles.gestureContainer,
              {
                transform: [
                  { scale: scale },
                ],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleDoubleTap}
              style={styles.zoomableContent}
            >
              <ScrollView 
                style={styles.timeScrollView} 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal={false}
                nestedScrollEnabled={true}
              >
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScrollContent}
                >
                  <View style={styles.calendarContent}>
                    {timeSlots.map((time, index) => (
                      <View key={time} style={styles.timeRow}>
                        {/* Columna de horarios */}
                        <View style={styles.timeColumn}>
                          <Text style={styles.timeLabel}>{time}</Text>
                        </View>

                        {/* Columnas de trabajadoras */}
                        {workers.map(worker => {
                          const event = getEventForWorkerAtTime(worker.name, time);
                          return (
                            <View key={worker.id} style={styles.workerTimeSlot}>
                              {event && event.startTime === time && (
                                <View 
                                  style={[
                                    styles.appointmentCard,
                                    { 
                                      backgroundColor: worker.color,
                                      height: getEventHeight(event.startTime, event.endTime),
                                    }
                                  ]}
                                >
                                  <Text style={styles.appointmentTime}>
                                    {event.startTime} - {event.endTime}
                                  </Text>
                                  <Text style={styles.appointmentTitle}>
                                    {event.title}
                                  </Text>
                                </View>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </ScrollView>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return (
      <View style={styles.weekView}>
        <View style={styles.weekHeader}>
          {weekDays.map((day, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.weekDayHeader}
              onPress={() => {
                setSelectedDate(day);
                setViewMode('day');
                setCurrentDate(day);
              }}
            >
              <Text style={styles.weekDayName}>
                {day.toLocaleDateString('es-ES', { weekday: 'short' })}
              </Text>
              <Text style={[styles.weekDayNumber, isToday(day) && styles.todayNumber]}>
                {day.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <ScrollView style={styles.weekContent} showsVerticalScrollIndicator={false}>
          {Array.from({ length: 17 }, (_, i) => i + 6).map(hour => (
            <View key={hour} style={styles.weekHourRow}>
              <Text style={styles.weekHourLabel}>{`${hour}:00`}</Text>
              <View style={styles.weekHourContent}>
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = getEventsForDate(day).filter(
                    event => parseInt(event.startTime.split(':')[0]) === hour
                  );
                  return (
                    <View key={dayIndex} style={styles.weekDayColumn}>
                      {dayEvents.map(event => (
                        <TouchableOpacity key={event.id} style={[styles.weekEventCard, { backgroundColor: event.color }]}>
                          <Text style={styles.weekEventTitle} numberOfLines={2}>{event.title}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderMonthView = () => {
    const { days } = getMonthInfo(currentDate);
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
      <ScrollView style={styles.monthView} showsVerticalScrollIndicator={false}>
        <View style={styles.monthHeader}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.monthWeekDay}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.monthGrid}>
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.monthDay,
                  !isCurrentMonth(day) && styles.otherMonthDay,
                  isToday(day) && styles.todayDay,
                  isSelected(day) && styles.selectedDay,
                ]}
                onPress={() => {
                  setSelectedDate(day);
                  setCurrentDate(day);
                  if (showMonthPicker) {
                    setViewMode('day');
                    setShowMonthPicker(false);
                  } else if (dayEvents.length > 0) {
                    setViewMode('day');
                  }
                }}
              >
                <Text style={[
                  styles.monthDayText,
                  !isCurrentMonth(day) && styles.otherMonthDayText,
                  isToday(day) && styles.todayDayText,
                  isSelected(day) && styles.selectedDayText,
                ]}>
                  {day.getDate()}
                </Text>
                {dayEvents.length > 0 && (
                  <View style={styles.eventIndicator}>
                    <Text style={styles.eventCount}>{dayEvents.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderCalendarContent = () => {
    switch (viewMode) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      default:
        return renderMonthView();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={styles.container.backgroundColor}
      />
      <View style={styles.contentContainer}>
        {renderHeader()}
        {renderCalendarContent()}
      </View>

      {/* Modal para selector de mes */}
      {showMonthPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.monthPickerModal}>
            <Text style={styles.modalTitle}>Seleccionar Fecha</Text>
            {renderMonthView()}
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowMonthPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={[
        styles.bottomNavigation,
        Platform.OS === 'web' && { position: 'fixed' as any }
      ]}>
        {[
          { icon: '📅', label: 'Agenda', active: true },
          { icon: '👥', label: 'Clientes', active: false },
          { icon: '➕', label: 'Agregar', active: false },
          { icon: '🔔', label: 'Alertas', active: false },
          { icon: '⚙️', label: 'Config', active: false },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.navItem, item.active && styles.activeNavItem]}
            onPress={() => setActiveTab(item.label)}
          >
            <Text style={[styles.navIcon, item.active && styles.activeNavIcon]}>
              {item.icon}
            </Text>
            <Text style={[styles.navLabel, item.active && styles.activeNavLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flex: 1,
    // Eliminar marginBottom para que el contenido use toda la pantalla
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  navButtonText: {
    fontSize: 24,
    color: '#333333',
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  viewModeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 18,
  },
  activeViewMode: {
    backgroundColor: '#2c3e50',
  },
  viewModeText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
  },
  activeViewModeText: {
    color: '#ffffff',
  },
  // Day View Styles
  dayView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  dayViewDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  hourRow: {
    flexDirection: 'row',
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  hourLabel: {
    width: 60,
    paddingTop: 10,
    paddingRight: 10,
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
  },
  hourContent: {
    flex: 1,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  eventCard: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  eventTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  eventTime: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.9,
  },
  // Week View Styles
  weekView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  weekHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  weekDayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  weekDayName: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 5,
  },
  weekDayNumber: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  todayNumber: {
    color: '#2c3e50',
    backgroundColor: '#3498db',
    borderRadius: 15,
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: 30,
    overflow: 'hidden',
  },
  weekContent: {
    flex: 1,
  },
  weekHourRow: {
    flexDirection: 'row',
    minHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  weekHourLabel: {
    width: 50,
    paddingTop: 5,
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  weekHourContent: {
    flex: 1,
    flexDirection: 'row',
  },
  weekDayColumn: {
    flex: 1,
    paddingHorizontal: 2,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  weekEventCard: {
    padding: 4,
    borderRadius: 4,
    marginVertical: 1,
  },
  weekEventTitle: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Month View Styles
  monthView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  monthHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  monthWeekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
    paddingVertical: 15,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthDay: {
    width: width / 7,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#f0f0f0',
    position: 'relative',
  },
  otherMonthDay: {
    backgroundColor: '#fafafa',
  },
  todayDay: {
    backgroundColor: '#e3f2fd',
  },
  selectedDay: {
    backgroundColor: '#2c3e50',
  },
  monthDayText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  otherMonthDayText: {
    color: '#cccccc',
  },
  todayDayText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  eventIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCount: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Bottom Navigation Styles
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: 'rgba(44, 62, 80, 0.95)', // Semi-transparente para efecto flotante
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // Redondeado completo
    position: 'absolute',
    bottom: 20, // Separado del borde inferior
    left: 20, // Separado del borde izquierdo
    right: 20, // Separado del borde derecho
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 100, // Elevación muy alta para Android
    zIndex: 999999,
    height: 70,
    minHeight: 70,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#BDC3C7',
  },
  activeNavIcon: {
    color: '#ECF0F1',
  },
  navLabel: {
    fontSize: 10,
    color: '#999999',
    fontWeight: '500',
  },
  activeNavLabel: {
    color: '#ECF0F1',
    fontWeight: '600',
  },

  // Estilos para la vista de horarios diarios
  dayViewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  workersHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 15,
  },
  timeColumnHeader: {
    width: 60,
    backgroundColor: '#f8f9fa',
  },
  workerColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  workerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  timeScrollView: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    minHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timeColumn: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  timeLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  workerTimeSlot: {
    flex: 1,
    minHeight: 50,
    position: 'relative',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    paddingHorizontal: 2,
  },
  appointmentCard: {
    position: 'absolute',
    left: 2,
    right: 2,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  appointmentTime: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 2,
  },
  appointmentTitle: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '500',
    lineHeight: 14,
  },

  // Estilos para el header de vista diaria
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  monthSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginRight: 5,
  },
  monthSelectorArrow: {
    fontSize: 12,
    color: '#666666',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  filterButtonText: {
    fontSize: 18,
  },

  // Estilos para el modal de selector de mes
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  monthPickerModal: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalCloseButton: {
    backgroundColor: '#E63946',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 15,
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Estilos para gestos de zoom y pan
  resetButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    backgroundColor: '#E63946',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gestureContainer: {
    flex: 1,
  },
  gestureWrapper: {
    flex: 1,
  },
  zoomableContent: {
    flex: 1,
    minWidth: '100%',
    minHeight: '100%',
  },
  horizontalScrollContent: {
    flexGrow: 1,
  },
  calendarContent: {
    minWidth: width, // Asegurar que tenga un ancho mínimo
  },
});

export default CalendarScreen;
