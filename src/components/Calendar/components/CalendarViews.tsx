/**
 * Calendar Views Component - HeyData Mobile
 * Componentes para las diferentes vistas del calendario (día, semana, mes)
 * 
 * @format
 */

import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { CalendarViewProps } from '../types';
import { TIME_SLOTS, COLUMN_CONFIG } from '../utils/constants';
import { 
  getVisibleWorkers, 
  getColumnWidth, 
  getEventsForDate,
  getEventHeight,
  getEventTopPosition,
  isToday,
  isSelected,
  isCurrentMonth,
  getMonthInfo
} from '../utils/calendarUtils';
import ResizableAppointmentCard from '../../ResizableAppointmentCard';
import { calendarStyles } from '../styles/calendarStyles';

const { width } = Dimensions.get('window');

// Vista Diaria
export const DayView: React.FC<CalendarViewProps & {
  onAppointmentResize: (eventId: string, newStartTime: string, newEndTime: string) => void;
  onAppointmentMove: (eventId: string, newWorkerIndex: number, newTimePosition?: number, newHeightPx?: number) => void;
  onResizeModeChange: (eventId: string, isResizing: boolean) => void;
  anyCardInResizeMode: boolean;
  cancelAllResizeModes: () => void;
}> = ({ 
  currentDate, 
  events, 
  selectedWorkers, 
  workers, 
  onEventPress,
  onAppointmentResize,
  onAppointmentMove,
  onResizeModeChange,
  anyCardInResizeMode,
  cancelAllResizeModes
}) => {
  const dayEvents = getEventsForDate(currentDate, events, selectedWorkers, workers);
  const visibleWorkers = getVisibleWorkers(workers, selectedWorkers);
  const columnWidth = getColumnWidth(visibleWorkers, width);

  // Referencias para sincronizar scroll
  const headerScrollRef = useRef<ScrollView>(null);
  const timeScrollRef = useRef<ScrollView>(null);
  const contentScrollRef = useRef<ScrollView>(null);
  const mainScrollRef = useRef<ScrollView>(null);

  // Banderas para evitar sincronización circular
  const isScrollingFromHeader = useRef(false);
  const isScrollingFromContent = useRef(false);
  const isScrollingFromTime = useRef(false);
  const isScrollingFromMain = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  return (
    <View style={calendarStyles.dayViewContainer}>
      {/* Header con trabajadoras - FIJO */}
      <View style={calendarStyles.workersHeaderFixed}>
        <View style={calendarStyles.timeColumnHeaderFixed} />
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={headerScrollRef}
          scrollEventThrottle={16}
          removeClippedSubviews={true}
          directionalLockEnabled={true}
          decelerationRate="fast"
          bounces={false}
          pagingEnabled={false}
          onScroll={(event) => {
            if (isScrollingFromContent.current) return;
            
            const scrollX = event.nativeEvent.contentOffset.x;
            isScrollingFromHeader.current = true;
            
            if (contentScrollRef.current) {
              contentScrollRef.current.scrollTo({ x: scrollX, animated: false });
            }
            
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
              isScrollingFromHeader.current = false;
            }, 50);
          }}
        >
          <View style={calendarStyles.workersHeaderContent}>
            {visibleWorkers.map(worker => (
              <View key={worker.id} style={[calendarStyles.workerColumnFixed, { width: columnWidth }]}>
                <Text style={calendarStyles.workerName}>{worker.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Contenido principal con scroll bidireccional */}
      <View style={calendarStyles.mainContentContainer}>
        {/* Columna de horarios fija a la izquierda */}
        <View style={calendarStyles.timeColumnContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={timeScrollRef}
            scrollEventThrottle={16}
            removeClippedSubviews={true}
            decelerationRate="fast"
            bounces={true}
            onScroll={(event) => {
              if (isScrollingFromMain.current) return;
              
              const scrollY = event.nativeEvent.contentOffset.y;
              isScrollingFromTime.current = true;
              
              if (mainScrollRef.current) {
                mainScrollRef.current.scrollTo({ y: scrollY, animated: false });
              }
              
              if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
              scrollTimeout.current = setTimeout(() => {
                isScrollingFromTime.current = false;
              }, 16);
            }}
          >
            {TIME_SLOTS.map((timeSlot, index) => (
              <View key={timeSlot.time} style={[
                calendarStyles.timeSlotFixed,
                timeSlot.isMainHour ? calendarStyles.mainHourSlot : calendarStyles.emptyHourSlot
              ]}>
                <Text style={[
                  calendarStyles.mainHourLabel,
                  timeSlot.isMainHour ? calendarStyles.mainHourLabel : calendarStyles.emptyHourLabel
                ]}>
                  {timeSlot.isMainHour ? timeSlot.time : ''}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Área de contenido scrollable */}
        <ScrollView
          style={calendarStyles.contentScrollView}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ref={mainScrollRef}
          scrollEventThrottle={16}
          removeClippedSubviews={true}
          decelerationRate="fast"
          bounces={true}
          nestedScrollEnabled={true}
          onScroll={(event) => {
            if (isScrollingFromTime.current) return;
            
            const scrollY = event.nativeEvent.contentOffset.y;
            isScrollingFromMain.current = true;
            
            if (timeScrollRef.current) {
              timeScrollRef.current.scrollTo({ y: scrollY, animated: false });
            }
            
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
              isScrollingFromMain.current = false;
            }, 16);
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={contentScrollRef}
            scrollEventThrottle={16}
            removeClippedSubviews={true}
            directionalLockEnabled={true}
            decelerationRate="fast"
            bounces={false}
            nestedScrollEnabled={true}
            onScroll={(event) => {
              if (isScrollingFromHeader.current) return;
              
              const scrollX = event.nativeEvent.contentOffset.x;
              isScrollingFromContent.current = true;
              
              if (headerScrollRef.current) {
                headerScrollRef.current.scrollTo({ x: scrollX, animated: false });
              }
              
              if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
              scrollTimeout.current = setTimeout(() => {
                isScrollingFromContent.current = false;
              }, 50);
            }}
          >
            <TouchableOpacity 
              style={calendarStyles.calendarGrid}
              activeOpacity={1}
              onPress={() => {
                if (anyCardInResizeMode) {
                  cancelAllResizeModes();
                }
              }}
            >
              {TIME_SLOTS.map((timeSlot, index) => (
                <View key={timeSlot.time} style={[
                  calendarStyles.timeRowContent,
                  timeSlot.isMainHour ? calendarStyles.mainHourRow : calendarStyles.emptyHourRow
                ]}>
                  {visibleWorkers.map(worker => {
                    return (
                      <View key={worker.id} style={[calendarStyles.workerTimeSlotFixed, { width: columnWidth }]}>
                        {/* Las citas se renderizarán en un contenedor superior */}
                      </View>
                    );
                  })}
                </View>
              ))}
              
              {/* Contenedor absoluto para las citas */}
              <View style={calendarStyles.eventsContainer}>
                {visibleWorkers.map((worker, wIndex) => {
                  const workerEvents = dayEvents.filter(ev => ev.worker === worker.name);
                  return workerEvents.map(event => (
                    <ResizableAppointmentCard
                      key={event.id}
                      event={event as any}
                      workerIndex={wIndex}
                      totalColumns={visibleWorkers.length}
                      columnWidth={columnWidth}
                      slotHeight={35} // consistente con TIME_CONFIG.SLOT_HEIGHT
                      startHour={9}
                      endHour={18}
                      intervalMinutes={15}
                      onPress={() => onEventPress(event)}
                      onResize={(newStart, newEnd) => onAppointmentResize(event.id, newStart, newEnd)}
                      onMove={(newWorkerIndex, newTopPx, newHeightPx) => 
                        onAppointmentMove(event.id, newWorkerIndex, newTopPx, newHeightPx)
                      }
                    />
                  ));
                })}
              </View>
            </TouchableOpacity>
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};

// Vista Semanal
export const WeekView: React.FC<CalendarViewProps & { onDateSelect: (date: Date) => void }> = ({ 
  currentDate, 
  events, 
  selectedWorkers, 
  workers, 
  onEventPress,
  onDateSelect
}) => {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  return (
    <View style={calendarStyles.weekView}>
      <View style={calendarStyles.weekHeader}>
        {weekDays.map((day, index) => (
          <TouchableOpacity 
            key={index} 
            style={calendarStyles.weekDayHeader}
            onPress={() => onDateSelect(day)}
          >
            <Text style={calendarStyles.weekDayName}>
              {day.toLocaleDateString('es-ES', { weekday: 'short' })}
            </Text>
            <Text style={[calendarStyles.weekDayNumber, isToday(day) && calendarStyles.todayNumber]}>
              {day.getDate()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <ScrollView 
        style={calendarStyles.weekContent} 
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        bounces={true}
      >
        {Array.from({ length: 17 }, (_, i) => i + 6).map(hour => (
          <View key={hour} style={calendarStyles.weekHourRow}>
            <Text style={calendarStyles.weekHourLabel}>{`${hour}:00`}</Text>
            <View style={calendarStyles.weekHourContent}>
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDate(day, events, selectedWorkers, workers).filter(
                  event => parseInt(event.startTime.split(':')[0]) === hour
                );
                return (
                  <View key={dayIndex} style={calendarStyles.weekDayColumn}>
                    {dayEvents.map(event => (
                      <TouchableOpacity 
                        key={event.id} 
                        style={[calendarStyles.weekEventCard, { backgroundColor: event.color }]}
                        onPress={() => onEventPress(event)}
                      >
                        <Text style={calendarStyles.weekEventTitle} numberOfLines={2}>
                          {event.title}
                        </Text>
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

// Vista Mensual
export const MonthView: React.FC<CalendarViewProps & { 
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  showMonthPicker?: boolean;
}> = ({ 
  currentDate, 
  events, 
  selectedWorkers, 
  workers, 
  onEventPress,
  selectedDate,
  onDateSelect,
  showMonthPicker = false
}) => {
  const { days } = getMonthInfo(currentDate);
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <ScrollView 
      style={calendarStyles.monthView} 
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      decelerationRate="fast"
      bounces={true}
    >
      <View style={calendarStyles.monthHeader}>
        {weekDays.map((day, index) => (
          <Text key={index} style={calendarStyles.monthWeekDay}>{day}</Text>
        ))}
      </View>
      
      <View style={calendarStyles.monthGrid}>
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day, events, selectedWorkers, workers);
          return (
            <TouchableOpacity
              key={index}
              style={[
                calendarStyles.monthDay,
                !isCurrentMonth(day, currentDate) && calendarStyles.otherMonthDay,
                isToday(day) && calendarStyles.todayDay,
                isSelected(day, selectedDate) && calendarStyles.selectedDay,
              ]}
              onPress={() => onDateSelect(day)}
            >
              <Text style={[
                calendarStyles.monthDayText,
                !isCurrentMonth(day, currentDate) && calendarStyles.otherMonthDayText,
                isToday(day) && calendarStyles.todayDayText,
                isSelected(day, selectedDate) && calendarStyles.selectedDayText,
              ]}>
                {day.getDate()}
              </Text>
              {dayEvents.length > 0 && (
                <View style={calendarStyles.eventIndicator}>
                  <Text style={calendarStyles.eventCount}>{dayEvents.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};