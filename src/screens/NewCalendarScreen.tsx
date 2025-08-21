/**
 * Calendar Screen - HeyData Mobile
 * Vista completa del calendario con navegación de días, semanas y meses
 * 
 * @format
 */

import React, { useState } from 'react';
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
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  date: string; // YYYY-MM-DD format
}

const CalendarScreen = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = useState('Agenda');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Eventos de ejemplo
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Ixchel - Luces nuevas',
      startTime: '10:00',
      endTime: '11:00',
      color: '#3498db',
      date: '2025-08-21',
    },
    {
      id: '2',
      title: 'Adriana Hernández - Corte de dama',
      startTime: '11:00',
      endTime: '12:00',
      color: '#2ecc71',
      date: '2025-08-21',
    },
    {
      id: '3',
      title: 'Carlos López - Barba',
      startTime: '14:00',
      endTime: '15:00',
      color: '#e74c3c',
      date: '2025-08-22',
    },
    {
      id: '4',
      title: 'María González - Tinte',
      startTime: '16:00',
      endTime: '17:30',
      color: '#9b59b6',
      date: '2025-08-23',
    },
  ]);

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
      <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
        <Text style={styles.navButtonText}>‹</Text>
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>
          {viewMode === 'day' ? formatDate(currentDate) : formatMonthYear(currentDate)}
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
    </View>
  );

  const renderDayView = () => {
    const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6:00 - 22:00
    const dayEvents = getEventsForDate(currentDate);

    return (
      <ScrollView style={styles.dayView} showsVerticalScrollIndicator={false}>
        <Text style={styles.dayViewDate}>{formatDate(currentDate)}</Text>
        {hours.map(hour => (
          <View key={hour} style={styles.hourRow}>
            <Text style={styles.hourLabel}>{`${hour}:00`}</Text>
            <View style={styles.hourContent}>
              {dayEvents
                .filter(event => parseInt(event.startTime.split(':')[0]) === hour)
                .map(event => (
                  <TouchableOpacity key={event.id} style={[styles.eventCard, { backgroundColor: event.color }]}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventTime}>{event.startTime} - {event.endTime}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        ))}
      </ScrollView>
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
                  if (dayEvents.length > 0) {
                    setViewMode('day');
                    setCurrentDate(day);
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
      <View style={styles.bottomNavigation}>
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
    marginBottom: 80,
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
    backgroundColor: '#2C3E50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 50,
    zIndex: 999999,
    height: 80,
    minHeight: 80,
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
});

export default CalendarScreen;
