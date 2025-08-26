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

  // Referencias para sincronizar scroll (estilo Excel)
  const headerScrollRef = useRef<ScrollView>(null);
  const timeScrollRef = useRef<ScrollView>(null);
  const contentScrollRef = useRef<ScrollView>(null);
  const mainScrollRef = useRef<ScrollView>(null);

  // Banderas para evitar sincronización circular
  const isScrollingFromHeader = useRef(false);
  const isScrollingFromContent = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

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
    { id: '1', name: 'Norma', color: '#3498db' },     // Azul
    { id: '2', name: 'Brenda', color: '#e74c3c' },    // Rojo
    { id: '3', name: 'Susana', color: '#9b59b6' },    // Púrpura
    { id: '4', name: 'Andrea', color: '#2ecc71' },    // Verde
    { id: '5', name: 'Isabel', color: '#f39c12' },    // Naranja
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
      endTime: '17:00',
      color: '#2ecc71',
      date: '2025-08-21',
      worker: 'Andrea',
    },
    {
      id: '5',
      title: 'Carmen - Manicure',
      startTime: '9:00',
      endTime: '10:00',
      color: '#f39c12',
      date: '2025-08-21',
      worker: 'Isabel',
    },
    {
      id: '6',
      title: 'Ana López - Corte y color',
      startTime: '12:00',
      endTime: '13:00',
      color: '#3498db',
      date: '2025-08-21',
      worker: 'Norma',
    },
    {
      id: '7',
      title: 'Victoria - Pedicure',
      startTime: '15:00',
      endTime: '16:00',
      color: '#e74c3c',
      date: '2025-08-21',
      worker: 'Brenda',
    },
    {
      id: '8',
      title: 'Sofía - Extensiones',
      startTime: '11:00',
      endTime: '12:00',
      color: '#9b59b6',
      date: '2025-08-21',
      worker: 'Susana',
    },
    {
      id: '9',
      title: 'Patricia - Tratamiento capilar',
      startTime: '9:00',
      endTime: '10:00',
      color: '#2ecc71',
      date: '2025-08-21',
      worker: 'Andrea',
    },
    {
      id: '10',
      title: 'Claudia - Maquillaje',
      startTime: '13:00',
      endTime: '14:00',
      color: '#f39c12',
      date: '2025-08-21',
      worker: 'Isabel',
    },
    {
      id: '11',
      title: 'Fernanda - Corte infantil',
      startTime: '17:00',
      endTime: '18:00',
      color: '#3498db',
      date: '2025-08-21',
      worker: 'Norma',
    },
    {
      id: '12',
      title: 'Gabriela - Alisado',
      startTime: '10:00',
      endTime: '11:00',
      color: '#e74c3c',
      date: '2025-08-21',
      worker: 'Brenda',
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

  // Navegar entre meses
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
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
      return dayEvents.find(event => {
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

    // Función mejorada para verificar si un evento comienza en este slot específico
    const isEventStart = (event: CalendarEvent, time: string) => {
      return event.startTime === time;
    };

    // Función para calcular la altura del evento basado en duración
    const getEventHeight = (startTime: string, endTime: string) => {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      
      const startTotalMin = startHour * 60 + startMin;
      const endTotalMin = endHour * 60 + endMin;
      const durationMin = endTotalMin - startTotalMin;
      
      // Cada slot de 30 min = 50px, así que cada minuto = 50/30 ≈ 1.67px
      const heightPerMinute = 50 / 30;
      return Math.max(durationMin * heightPerMinute - 4, 40); // Mínimo 40px, restar 4px para el margen
    };

    return (
      <View style={styles.dayViewContainer}>
        {/* Header con trabajadoras - FIJO */}
        <View style={styles.workersHeaderFixed}>
          <View style={styles.timeColumnHeaderFixed} />
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={headerScrollRef}
            scrollEventThrottle={32}
            removeClippedSubviews={true}
            directionalLockEnabled={true}
            onScroll={(event) => {
              if (isScrollingFromContent.current) return;
              
              const scrollX = event.nativeEvent.contentOffset.x;
              isScrollingFromHeader.current = true;
              
              if (contentScrollRef.current) {
                contentScrollRef.current.scrollTo({ x: scrollX, animated: false });
              }
              
              // Limpiar la bandera después de un breve delay
              if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
              scrollTimeout.current = setTimeout(() => {
                isScrollingFromHeader.current = false;
              }, 50);
            }}
          >
            <View style={styles.workersHeaderContent}>
              {workers.map(worker => (
                <View key={worker.id} style={styles.workerColumnFixed}>
                  <Text style={styles.workerName}>{worker.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Botón para resetear zoom */}
        <TouchableOpacity style={styles.resetButton} onPress={resetTransform}>
          <Text style={styles.resetButtonText}>↻</Text>
        </TouchableOpacity>

        {/* Contenido principal con scroll bidireccional */}
        <View style={styles.mainContentContainer}>
          {/* Columna de horarios fija a la izquierda */}
          <View style={styles.timeColumnContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              ref={timeScrollRef}
              scrollEventThrottle={32}
              removeClippedSubviews={true}
              onScroll={(event) => {
                const scrollY = event.nativeEvent.contentOffset.y;
                if (mainScrollRef.current) {
                  mainScrollRef.current.scrollTo({ y: scrollY, animated: false });
                }
              }}
            >
              {timeSlots.map((time, index) => (
                <View key={time} style={styles.timeSlotFixed}>
                  <Text style={styles.timeLabel}>{time}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Área de contenido scrollable */}
          <ScrollView
            style={styles.contentScrollView}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ref={mainScrollRef}
            scrollEventThrottle={32}
            removeClippedSubviews={true}
            onScroll={(event) => {
              const scrollY = event.nativeEvent.contentOffset.y;
              if (timeScrollRef.current) {
                timeScrollRef.current.scrollTo({ y: scrollY, animated: false });
              }
            }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={contentScrollRef}
              scrollEventThrottle={32}
              removeClippedSubviews={true}
              directionalLockEnabled={true}
              onScroll={(event) => {
                if (isScrollingFromHeader.current) return;
                
                const scrollX = event.nativeEvent.contentOffset.x;
                isScrollingFromContent.current = true;
                
                if (headerScrollRef.current) {
                  headerScrollRef.current.scrollTo({ x: scrollX, animated: false });
                }
                
                // Limpiar la bandera después de un breve delay
                if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
                scrollTimeout.current = setTimeout(() => {
                  isScrollingFromContent.current = false;
                }, 50);
              }}
            >
              <Animated.View
                style={[
                  styles.zoomableContent,
                  {
                    transform: [{ scale: scale }],
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={handleDoubleTap}
                  style={styles.calendarGrid}
                >
                  {timeSlots.map((time, index) => (
                    <View key={time} style={styles.timeRowContent}>
                      {workers.map(worker => {
                        const event = getEventForWorkerAtTime(worker.name, time);
                        return (
                          <View key={worker.id} style={styles.workerTimeSlotFixed}>
                            {event && isEventStart(event, time) && (
                              <View 
                                style={[
                                  styles.appointmentCard,
                                  { 
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
                                {/* Pequeño indicador de color para la trabajadora */}
                                <View 
                                  style={[
                                    styles.workerColorIndicator,
                                    { backgroundColor: worker.color }
                                  ]}
                                />
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </ScrollView>
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

      {/* Dropdown selector de mes */}
      {showMonthPicker && (
        <>
          {/* Overlay transparente para cerrar */}
          <TouchableOpacity 
            style={styles.dropdownOverlay}
            onPress={() => setShowMonthPicker(false)}
            activeOpacity={1}
          />
          {/* Dropdown calendar */}
          <View style={styles.monthDropdown}>
            <View style={styles.dropdownHeader}>
              <TouchableOpacity 
                onPress={() => navigateMonth(-1)}
                style={styles.monthNavButton}
              >
                <Text style={styles.monthNavText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.dropdownTitle}>
                {formatMonthYear(currentDate)}
              </Text>
              <TouchableOpacity 
                onPress={() => navigateMonth(1)}
                style={styles.monthNavButton}
              >
                <Text style={styles.monthNavText}>›</Text>
              </TouchableOpacity>
            </View>
            {renderMonthView()}
          </View>
        </>
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
  monthView: {
    backgroundColor: '#ffffff',
    maxHeight: 280, // Reducido para que no necesite scroll
    borderBottomLeftRadius: 20, // Esquinas inferiores redondeadas
    borderBottomRightRadius: 20, // Esquinas inferiores redondeadas
    overflow: 'hidden', // Para que las esquinas se vean correctamente
  },
  monthHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 0, // Quitado el borde inferior
  },
  monthWeekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12, // Reducido de 14 a 12
    fontWeight: 'bold',
    color: '#666666',
    paddingVertical: 10, // Reducido de 15 a 10
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 10, // Padding inferior para mejor apariencia con esquinas redondeadas
  },
  monthDay: {
    width: '14.28%', // 100% / 7 días = 14.28%
    height: 40, // Reducido de 50 a 40
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0, // Quitado el borde
    position: 'relative',
  },
  otherMonthDay: {
    backgroundColor: '#fafafa',
  },
  todayDay: {
    backgroundColor: '#6c63ff', // Color púrpura como en la imagen
    borderRadius: 20, // Más redondeado
  },
  selectedDay: {
    backgroundColor: '#6c63ff', // Mismo color para seleccionado
    borderRadius: 20, // Más redondeado
  },
  monthDayText: {
    fontSize: 14, // Reducido de 16 a 14
    color: '#333333',
    fontWeight: '500',
  },
  otherMonthDayText: {
    color: '#cccccc',
  },
  todayDayText: {
    color: '#ffffff', // Texto blanco para el fondo púrpura
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
    fontSize: 15,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  timeScrollView: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    minHeight: 60, // Reducido para acomodar más intervalos de tiempo
    borderBottomWidth: 0.5, // Línea más sutil
    borderBottomColor: '#f5f5f5', // Color más claro
    zIndex: 1, // Debajo de las tarjetas
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
    minHeight: 60, // Reducido para acomodar más intervalos de tiempo
    position: 'relative',
    borderRightWidth: 0.5, // Línea más sutil
    borderRightColor: '#f5f5f5', // Color más claro
    paddingHorizontal: 2,
    zIndex: 1, // Debajo de las tarjetas
  },
  appointmentCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 8, // Esquinas redondeadas
    padding: 12, // Ajustado para las celdas más pequeñas
    margin: 2, // Reducido margen
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1, // Línea más delgada
    borderStyle: 'solid', // Línea continua en lugar de punteada
    borderColor: '#d0d0d0', // Color gris suave para línea continua
    // Ocultar las líneas de la cuadrícula
    overflow: 'hidden',
    zIndex: 10, // Para estar encima de las líneas de la cuadrícula
  },
  appointmentTime: {
    fontSize: 11, // Revertido a tamaño original
    color: '#7f8c8d',
    fontWeight: '600',
    marginBottom: 4, // Revertido a tamaño original
    textAlign: 'center',
  },
  appointmentTitle: {
    fontSize: 12, // Reducido de 14 a 12 para texto más pequeño
    color: '#2c3e50',
    fontWeight: '600', // Reducido de 700 a 600 para menos peso
    lineHeight: 14, // Ajustado proporcionalmente
    textAlign: 'center',
    marginTop: 2, // Revertido a tamaño original
  },
  workerColorIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
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

  // Estilos para layout tipo Excel
  workersHeaderFixed: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 15,
    zIndex: 10,
  },
  timeColumnHeaderFixed: {
    width: 60,
    backgroundColor: '#f8f9fa',
    borderRightWidth: 2,
    borderRightColor: '#e0e0e0',
  },
  workersHeaderContent: {
    flexDirection: 'row',
  },
  workerColumnFixed: {
    width: 120,
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  mainContentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  timeColumnContainer: {
    width: 60,
    backgroundColor: '#f8f9fa',
    borderRightWidth: 2,
    borderRightColor: '#e0e0e0',
    zIndex: 5,
  },
  timeSlotFixed: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contentScrollView: {
    flex: 1,
  },
  calendarGrid: {
    flex: 1,
  },
  timeRowContent: {
    flexDirection: 'row',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  workerTimeSlotFixed: {
    width: 120,
    height: 50,
    position: 'relative',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    paddingHorizontal: 2,
  },

  // Estilos para dropdown del calendario
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  monthDropdown: {
    position: 'absolute',
    top: 70, // Debajo del header
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20, // Más redondeado (era 12)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 1000,
    maxHeight: 350, // Ligeramente reducido
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12, // Reducido de 16 a 12
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderTopLeftRadius: 20, // Esquinas superiores redondeadas
    borderTopRightRadius: 20, // Esquinas superiores redondeadas
    backgroundColor: '#ffffff', // Asegurar fondo blanco
  },
  monthNavButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, // Más redondeado
    backgroundColor: '#f8f9fa',
  },
  monthNavText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
  dropdownTitle: {
    fontSize: 16, // Reducido de 18 a 16
    fontWeight: '600',
    color: '#2c3e50',
  },
});

export default CalendarScreen;
