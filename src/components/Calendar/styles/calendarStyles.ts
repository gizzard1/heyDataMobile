/**
 * Calendar Styles - HeyData Mobile
 * Estilos para los componentes del calendario
 * 
 * @format
 */

import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const calendarStyles = StyleSheet.create({
  // Estilos del contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flex: 1,
  },

  // Estilos del header
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
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },

  // Estilos para la vista diaria
  dayViewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
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
    width: 200,
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  workerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    textTransform: 'capitalize',
  },

  // Estilos para el contenido principal
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
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mainHourSlot: {
    backgroundColor: 'transparent',
    borderTopWidth: 2,
    borderTopColor: '#dee2e6',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  emptyHourSlot: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mainHourLabel: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '600',
  },
  emptyHourLabel: {
    fontSize: 12,
    color: 'transparent',
  },
  contentScrollView: {
    flex: 1,
    paddingBottom: 120,
  },
  calendarGrid: {
    flex: 1,
  },
  eventsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  autoScrollShadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    zIndex: 80,
    pointerEvents: 'none',
    backgroundColor: 'transparent',
  },
  autoScrollShadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    zIndex: 80,
    pointerEvents: 'none',
    backgroundColor: 'transparent',
  },
  autoScrollGradientTop: {
    flex: 1,
    backgroundColor: 'rgba(0,122,255,0.10)',
  },
  autoScrollGradientBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,122,255,0.10)',
  },
  timeRowContent: {
    flexDirection: 'row',
    height: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mainHourRow: {
    backgroundColor: 'transparent',
    borderTopWidth: 2,
    borderTopColor: '#dee2e6',
  },
  emptyHourRow: {
    backgroundColor: 'transparent',
  },
  workerTimeSlotFixed: {
    width: 200,
    height: 35,
    position: 'relative',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    paddingHorizontal: 2,
  },

  // Estilos para la vista semanal
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
    paddingBottom: 120,
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

  // Estilos para la vista mensual
  monthView: {
    backgroundColor: '#ffffff',
    maxHeight: 280,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  monthHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 0,
  },
  monthWeekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
    paddingVertical: 10,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 10,
  },
  monthDay: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    position: 'relative',
  },
  otherMonthDay: {
    backgroundColor: '#fafafa',
  },
  todayDay: {
    backgroundColor: '#6c63ff',
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: '#6c63ff',
    borderRadius: 20,
  },
  monthDayText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  otherMonthDayText: {
    color: '#cccccc',
  },
  todayDayText: {
    color: '#ffffff',
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
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 1000,
    maxHeight: 350,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#ffffff',
  },
  monthNavButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  monthNavText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
});
