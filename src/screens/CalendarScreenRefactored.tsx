/**
 * Calendar Screen Refactored - HeyData Mobile
 * Vista principal del calendario con arquitectura modular
 * 
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  useColorScheme,
  TouchableOpacity,
  Modal,
  Text,
  Platform,
  Animated,
} from 'react-native';

// Componentes refactorizados
import { CalendarHeader } from '../components/Calendar/components/CalendarHeader';
import { CalendarFilter } from '../components/Calendar/components/CalendarFilter';
import { DayView, WeekView, MonthView } from '../components/Calendar/components/CalendarViews';

// Componentes existentes que se mantienen
import AppointmentDetailScreen from './AppointmentDetailScreen';
import PaymentScreen from './PaymentScreen';
import ClientsScreen from './ClientsScreen';
import SettingsScreen from './SettingsScreen';
import NotificationsScreen from './NotificationsScreen';
import CreateAppointmentScreen from './CreateAppointmentScreen';
import CreateSaleScreen from './CreateSaleScreen';
import ProductsScreen from './ProductsScreen';

// Hooks y utilidades
import { useCalendarState } from '../components/Calendar/hooks/useCalendarState';
import { useFloatingButtons } from '../components/Calendar/hooks/useFloatingButtons';

// Constantes y tipos
import { WORKERS } from '../components/Calendar/utils/constants';
import { formatMonthYear } from '../components/Calendar/utils/calendarUtils';

// Iconos
import { 
  CalendarIcon, 
  UsersIcon, 
  AddIcon, 
  BellIcon, 
  SettingsIcon,
  BackIcon,
  EditIcon,
  TrashIcon,
  ClockIcon,
  DollarIcon,
  BoxIcon
} from '../components/Calendar/components/CalendarIcons';

// Estilos
import { calendarStyles } from '../components/Calendar/styles/calendarStyles';

const CalendarScreenRefactored = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  
  // Estados del calendario
  const {
    currentDate,
    viewMode,
    selectedDate,
    showMonthPicker,
    showFilterModal,
    selectedWorkers,
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
    anyCardInResizeMode,
    events,
    
    // Setters y handlers
    setViewMode,
    setSelectedDate,
    setCurrentDate,
    setShowMonthPicker,
    setShowFilterModal,
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
  } = useCalendarState();

  // Estados y funciones para botones flotantes
  const {
    showFloatingButtons,
    floatingAnimations,
    handleAddPress,
    hideFloatingButtons,
    handleCreateAppointmentPress: handleFloatingAppointmentPress,
    handleCreateSalePress: handleFloatingSalePress,
    handleProductsPress: handleFloatingProductsPress,
  } = useFloatingButtons({
    setShowCreateAppointmentScreen,
    setShowCreateSaleScreen,
    setShowProductsScreen,
  });

  // Funciones auxiliares para pantallas
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    if (showMonthPicker) {
      setViewMode('day');
      setShowMonthPicker(false);
    } else if (viewMode === 'week') {
      setViewMode('day');
    }
  };

  // Funciones para pantallas modales
  const handleClientsPress = () => setShowClientsScreen(true);
  const handleSettingsPress = () => setShowSettingsScreen(true);
  const handleNotificationsPress = () => setShowNotificationsScreen(true);

  // Renderizar el contenido del calendario según la vista
  const renderCalendarContent = () => {
    switch (viewMode) {
      case 'day':
        return (
          <DayView
            currentDate={currentDate}
            events={events}
            selectedWorkers={selectedWorkers}
            workers={WORKERS}
            onEventPress={openEventDetails}
            onAppointmentResize={handleAppointmentResize}
            onAppointmentMove={handleAppointmentMove}
            onResizeModeChange={handleResizeModeChange}
            anyCardInResizeMode={anyCardInResizeMode}
            cancelAllResizeModes={cancelAllResizeModes}
          />
        );
      case 'week':
        return (
          <WeekView
            currentDate={currentDate}
            events={events}
            selectedWorkers={selectedWorkers}
            workers={WORKERS}
            onEventPress={openEventDetails}
            onDateSelect={handleDateSelect}
          />
        );
      case 'month':
        return (
          <MonthView
            currentDate={currentDate}
            events={events}
            selectedWorkers={selectedWorkers}
            workers={WORKERS}
            onEventPress={openEventDetails}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            showMonthPicker={showMonthPicker}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={calendarStyles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={calendarStyles.container.backgroundColor}
      />
      
      <View style={calendarStyles.contentContainer}>
        {/* Header del calendario */}
        <CalendarHeader
          viewMode={viewMode}
          currentDate={currentDate}
          showMonthPicker={showMonthPicker}
          onNavigateDate={handleNavigateDate}
          onViewModeChange={setViewMode}
          onMonthPickerToggle={setShowMonthPicker}
          onFilterPress={() => setShowFilterModal(true)}
        />
        
        {/* Contenido del calendario */}
        {renderCalendarContent()}
      </View>

      {/* Dropdown selector de mes */}
      {showMonthPicker && (
        <>
          <TouchableOpacity 
            style={calendarStyles.dropdownOverlay}
            onPress={() => setShowMonthPicker(false)}
            activeOpacity={1}
          />
          <View style={calendarStyles.monthDropdown}>
            <View style={calendarStyles.dropdownHeader}>
              <TouchableOpacity 
                onPress={() => handleNavigateMonth(-1)}
                style={calendarStyles.monthNavButton}
              >
                <Text style={calendarStyles.monthNavText}>‹</Text>
              </TouchableOpacity>
              <Text style={calendarStyles.dropdownTitle}>
                {formatMonthYear(currentDate)}
              </Text>
              <TouchableOpacity 
                onPress={() => handleNavigateMonth(1)}
                style={calendarStyles.monthNavButton}
              >
                <Text style={calendarStyles.monthNavText}>›</Text>
              </TouchableOpacity>
            </View>
            <MonthView
              currentDate={currentDate}
              events={events}
              selectedWorkers={selectedWorkers}
              workers={WORKERS}
              onEventPress={openEventDetails}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </View>
        </>
      )}

      {/* Filtro del calendario */}
      <CalendarFilter
        visible={showFilterModal}
        workers={WORKERS}
        selectedWorkers={selectedWorkers}
        onWorkerToggle={handleWorkerToggle}
        onSelectAll={setAllWorkers}
        onClearAll={clearAllWorkers}
        onApply={applyFilters}
        onClose={() => setShowFilterModal(false)}
      />

      {/* Modales existentes - simplificados para el ejemplo */}
      {showEventModal && selectedEvent && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={showEventModal}
          onRequestClose={closeEventDetails}
        >
          <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 16,
              backgroundColor: '#ffffff',
              borderBottomWidth: 1,
              borderBottomColor: '#e0e0e0'
            }}>
              <TouchableOpacity onPress={closeEventDetails}>
                <BackIcon color="#007AFF" size={24} />
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>
                Detalles de la Cita
              </Text>
              <TouchableOpacity onPress={() => {
                setShowEventModal(false);
                setShowAppointmentDetail(true);
              }}>
                <EditIcon color="#007AFF" size={24} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, padding: 16 }}>
              <Text style={{ fontSize: 16, marginBottom: 8 }}>
                Cliente: {selectedEvent.cliente?.nombre || selectedEvent.title}
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 8 }}>
                Horario: {selectedEvent.startTime} - {selectedEvent.endTime}
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 8 }}>
                Total: ${selectedEvent.total}
              </Text>
            </View>
          </View>
        </Modal>
      )}

      {/* Navegación inferior */}
      <View style={[
        {
          flexDirection: 'row',
          backgroundColor: 'rgba(44, 62, 80, 0.95)',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 25,
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 100,
          zIndex: 999999,
          height: 70,
          minHeight: 70,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        Platform.OS === 'web' && { position: 'fixed' as any }
      ]}>
        {/* Botones flotantes */}
        {showFloatingButtons && (
          <>
            {/* Botón Verde - Cita */}
            <Animated.View 
              style={{
                position: 'absolute',
                bottom: 70,
                left: '50%',
                marginLeft: -30,
                width: 60,
                height: 60,
                backgroundColor: '#4CAF50',
                borderRadius: 30,
                zIndex: 99999,
                elevation: 99999,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: floatingAnimations.buttonOpacityAnimation,
                transform: [
                  { 
                    translateX: floatingAnimations.leftButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -60],
                    })
                  },
                  { 
                    translateY: floatingAnimations.leftButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -40],
                    })
                  },
                  {
                    scale: floatingAnimations.leftButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    })
                  }
                ],
              }}
            >
              <TouchableOpacity 
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#4CAF50',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 15,
                }}
                onPress={handleFloatingAppointmentPress}
              >
                <ClockIcon color="#FFFFFF" size={32} />
              </TouchableOpacity>
            </Animated.View>

            {/* Botón Naranja - Venta */}
            <Animated.View 
              style={{
                position: 'absolute',
                bottom: 70,
                left: '50%',
                marginLeft: -30,
                width: 60,
                height: 60,
                backgroundColor: '#FF9500',
                borderRadius: 30,
                zIndex: 99999,
                elevation: 99999,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: floatingAnimations.buttonOpacityAnimation,
                transform: [
                  { 
                    translateY: floatingAnimations.centerButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -60],
                    })
                  },
                  {
                    scale: floatingAnimations.centerButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    })
                  }
                ],
              }}
            >
              <TouchableOpacity 
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#FF9500',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 15,
                }}
                onPress={handleFloatingSalePress}
              >
                <DollarIcon color="#FFFFFF" size={32} />
              </TouchableOpacity>
            </Animated.View>

            {/* Botón Púrpura - Productos */}
            <Animated.View 
              style={{
                position: 'absolute',
                bottom: 70,
                left: '50%',
                marginLeft: -30,
                width: 60,
                height: 60,
                backgroundColor: '#9C27B0',
                borderRadius: 30,
                zIndex: 99999,
                elevation: 99999,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: floatingAnimations.buttonOpacityAnimation,
                transform: [
                  { 
                    translateX: floatingAnimations.rightButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 60],
                    })
                  },
                  { 
                    translateY: floatingAnimations.rightButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -40],
                    })
                  },
                  {
                    scale: floatingAnimations.rightButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    })
                  }
                ],
              }}
            >
              <TouchableOpacity 
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#9C27B0',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 15,
                }}
                onPress={handleFloatingProductsPress}
              >
                <BoxIcon color="#FFFFFF" size={32} />
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        {/* Iconos de navegación principal */}
        {[
          { component: CalendarIcon, label: 'Agenda', active: true },
          { component: UsersIcon, label: 'Clientes', active: false },
          { component: AddIcon, label: 'Agregar', active: false },
          { component: BellIcon, label: 'Alertas', active: false },
          { component: SettingsIcon, label: 'Config', active: false },
        ].map((item, index) => {
          const IconComponent = item.component;
          return (
            <TouchableOpacity
              key={index}
              style={[
                { flex: 1, alignItems: 'center', paddingVertical: 8 },
                item.active && { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 15 }
              ]}
              onPress={() => {
                if (item.label === 'Clientes') {
                  handleClientsPress();
                } else if (item.label === 'Config') {
                  handleSettingsPress();
                } else if (item.label === 'Alertas') {
                  handleNotificationsPress();
                } else if (item.label === 'Agregar') {
                  handleAddPress();
                }
              }}
            >
              <IconComponent 
                color={item.active ? '#ECF0F1' : '#BDC3C7'} 
                size={20} 
              />
              <Text style={[
                { fontSize: 10, fontWeight: '500', marginTop: 4 },
                { color: item.active ? '#ECF0F1' : '#999999' },
                item.active && { fontWeight: '600' }
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CalendarScreenRefactored;