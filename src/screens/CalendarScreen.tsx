/**
 * Calendar Screen - HeyData Mobile (REFACTORIZADO)
 * Vista completa del calendario con componentes modulares y organizados
 * 
 * @format
 */

import React from 'react';
import {
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
  ClockIcon,
  DollarIcon,
  BoxIcon
} from '../components/Calendar/components/CalendarIcons';

// Estilos
import { calendarStyles } from '../components/Calendar/styles/calendarStyles';

const CalendarScreen = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  
  // Estados del calendario (usando hook personalizado)
  const calendarState = useCalendarState();

  // Estados y funciones para botones flotantes
  const floatingButtons = useFloatingButtons({
    setShowCreateAppointmentScreen: calendarState.setShowCreateAppointmentScreen,
    setShowCreateSaleScreen: calendarState.setShowCreateSaleScreen,
    setShowProductsScreen: calendarState.setShowProductsScreen,
  });

  // Funciones auxiliares para pantallas
  const handleDateSelect = (date: Date) => {
    calendarState.setSelectedDate(date);
    calendarState.setCurrentDate(date);
    if (calendarState.showMonthPicker) {
      calendarState.setViewMode('day');
      calendarState.setShowMonthPicker(false);
    } else if (calendarState.viewMode === 'week') {
      calendarState.setViewMode('day');
    }
  };

  // Renderizar el contenido del calendario según la vista
  const renderCalendarContent = () => {
    switch (calendarState.viewMode) {
      case 'day':
        return (
          <DayView
            currentDate={calendarState.currentDate}
            events={calendarState.events}
            selectedWorkers={calendarState.selectedWorkers}
            workers={WORKERS}
            onEventPress={calendarState.openEventDetails}
            onAppointmentResize={calendarState.handleAppointmentResize}
            onAppointmentMove={calendarState.handleAppointmentMove}
            onResizeModeChange={calendarState.handleResizeModeChange}
            anyCardInResizeMode={calendarState.anyCardInResizeMode}
            cancelAllResizeModes={calendarState.cancelAllResizeModes}
          />
        );
      case 'week':
        return (
          <WeekView
            currentDate={calendarState.currentDate}
            events={calendarState.events}
            selectedWorkers={calendarState.selectedWorkers}
            workers={WORKERS}
            onEventPress={calendarState.openEventDetails}
            onDateSelect={handleDateSelect}
          />
        );
      case 'month':
        return (
          <MonthView
            currentDate={calendarState.currentDate}
            events={calendarState.events}
            selectedWorkers={calendarState.selectedWorkers}
            workers={WORKERS}
            onEventPress={calendarState.openEventDetails}
            selectedDate={calendarState.selectedDate}
            onDateSelect={handleDateSelect}
            showMonthPicker={calendarState.showMonthPicker}
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
          viewMode={calendarState.viewMode}
          currentDate={calendarState.currentDate}
          showMonthPicker={calendarState.showMonthPicker}
          onNavigateDate={calendarState.handleNavigateDate}
          onViewModeChange={calendarState.setViewMode}
          onMonthPickerToggle={calendarState.setShowMonthPicker}
          onFilterPress={() => calendarState.setShowFilterModal(true)}
        />
        
        {/* Contenido del calendario */}
        {renderCalendarContent()}
      </View>

      {/* Dropdown selector de mes */}
      {calendarState.showMonthPicker && (
        <>
          <TouchableOpacity 
            style={calendarStyles.dropdownOverlay}
            onPress={() => calendarState.setShowMonthPicker(false)}
            activeOpacity={1}
          />
          <View style={calendarStyles.monthDropdown}>
            <View style={calendarStyles.dropdownHeader}>
              <TouchableOpacity 
                onPress={() => calendarState.handleNavigateMonth(-1)}
                style={calendarStyles.monthNavButton}
              >
                <Text style={calendarStyles.monthNavText}>‹</Text>
              </TouchableOpacity>
              <Text style={calendarStyles.dropdownTitle}>
                {formatMonthYear(calendarState.currentDate)}
              </Text>
              <TouchableOpacity 
                onPress={() => calendarState.handleNavigateMonth(1)}
                style={calendarStyles.monthNavButton}
              >
                <Text style={calendarStyles.monthNavText}>›</Text>
              </TouchableOpacity>
            </View>
            <MonthView
              currentDate={calendarState.currentDate}
              events={calendarState.events}
              selectedWorkers={calendarState.selectedWorkers}
              workers={WORKERS}
              onEventPress={calendarState.openEventDetails}
              selectedDate={calendarState.selectedDate}
              onDateSelect={handleDateSelect}
            />
          </View>
        </>
      )}

      {/* Filtro del calendario */}
      <CalendarFilter
        visible={calendarState.showFilterModal}
        workers={WORKERS}
        selectedWorkers={calendarState.selectedWorkers}
        onWorkerToggle={calendarState.handleWorkerToggle}
        onSelectAll={calendarState.setAllWorkers}
        onClearAll={calendarState.clearAllWorkers}
        onApply={calendarState.applyFilters}
        onClose={() => calendarState.setShowFilterModal(false)}
      />

      {/* Modal simple para mostrar detalles de eventos */}
      {calendarState.showEventModal && calendarState.selectedEvent && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={calendarState.showEventModal}
          onRequestClose={calendarState.closeEventDetails}
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
              <TouchableOpacity onPress={calendarState.closeEventDetails}>
                <BackIcon color="#007AFF" size={24} />
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>
                Detalles de la Cita
              </Text>
              <TouchableOpacity onPress={() => {
                calendarState.setShowEventModal(false);
                calendarState.setShowAppointmentDetail(true);
              }}>
                <EditIcon color="#007AFF" size={24} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, padding: 16 }}>
              <Text style={{ fontSize: 16, marginBottom: 8 }}>
                Cliente: {calendarState.selectedEvent.cliente?.nombre || calendarState.selectedEvent.title}
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 8 }}>
                Horario: {calendarState.selectedEvent.startTime} - {calendarState.selectedEvent.endTime}
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 8 }}>
                Total: ${calendarState.selectedEvent.total}
              </Text>
            </View>
          </View>
        </Modal>
      )}

      {/* Pantallas modales */}
      {calendarState.showAppointmentDetail && calendarState.selectedEvent && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={calendarState.showAppointmentDetail}
          onRequestClose={() => calendarState.setShowAppointmentDetail(false)}
        >
          <AppointmentDetailScreen 
            appointment={calendarState.selectedEvent}
            onGoBack={() => calendarState.setShowAppointmentDetail(false)}
            onSave={(updatedEvent) => {
              // Actualizar el evento en la lista
              const updatedEvents = calendarState.events.map(event => 
                event.id === updatedEvent.id ? updatedEvent : event
              );
              calendarState.setEvents(updatedEvents);
              calendarState.setShowAppointmentDetail(false);
            }}
          />
        </Modal>
      )}

      {calendarState.showPaymentScreen && calendarState.selectedEvent && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={calendarState.showPaymentScreen}
          onRequestClose={() => calendarState.setShowPaymentScreen(false)}
        >
          <PaymentScreen 
            appointment={calendarState.selectedEvent}
            onGoBack={() => calendarState.setShowPaymentScreen(false)}
            onEditAppointment={() => {
              calendarState.setShowPaymentScreen(false);
              calendarState.setShowAppointmentDetail(true);
            }}
          />
        </Modal>
      )}

      {calendarState.showClientsScreen && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={calendarState.showClientsScreen}
          onRequestClose={() => calendarState.setShowClientsScreen(false)}
        >
          <ClientsScreen 
            onGoBack={() => calendarState.setShowClientsScreen(false)}
          />
        </Modal>
      )}

      {calendarState.showSettingsScreen && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={calendarState.showSettingsScreen}
          onRequestClose={() => calendarState.setShowSettingsScreen(false)}
        >
          <SettingsScreen 
            onGoBack={() => calendarState.setShowSettingsScreen(false)}
          />
        </Modal>
      )}

      {calendarState.showNotificationsScreen && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={calendarState.showNotificationsScreen}
          onRequestClose={() => calendarState.setShowNotificationsScreen(false)}
        >
          <NotificationsScreen 
            onGoBack={() => calendarState.setShowNotificationsScreen(false)}
          />
        </Modal>
      )}

      {calendarState.showCreateAppointmentScreen && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={calendarState.showCreateAppointmentScreen}
          onRequestClose={() => calendarState.setShowCreateAppointmentScreen(false)}
        >
          <CreateAppointmentScreen 
            onGoBack={() => calendarState.setShowCreateAppointmentScreen(false)}
          />
        </Modal>
      )}

      {calendarState.showCreateSaleScreen && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={calendarState.showCreateSaleScreen}
          onRequestClose={() => calendarState.setShowCreateSaleScreen(false)}
        >
          <CreateSaleScreen 
            onGoBack={() => calendarState.setShowCreateSaleScreen(false)}
          />
        </Modal>
      )}

      {calendarState.showProductsScreen && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={calendarState.showProductsScreen}
          onRequestClose={() => calendarState.setShowProductsScreen(false)}
        >
          <ProductsScreen 
            onGoBack={() => calendarState.setShowProductsScreen(false)}
          />
        </Modal>
      )}

      {/* Navegación inferior con botones flotantes */}
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
        {/* Botones flotantes animados */}
        {floatingButtons.showFloatingButtons && (
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
                opacity: floatingButtons.floatingAnimations.buttonOpacityAnimation,
                transform: [
                  { 
                    translateX: floatingButtons.floatingAnimations.leftButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -60],
                    })
                  },
                  { 
                    translateY: floatingButtons.floatingAnimations.leftButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -40],
                    })
                  },
                  {
                    scale: floatingButtons.floatingAnimations.leftButtonAnimation.interpolate({
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
                onPress={floatingButtons.handleCreateAppointmentPress}
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
                opacity: floatingButtons.floatingAnimations.buttonOpacityAnimation,
                transform: [
                  { 
                    translateY: floatingButtons.floatingAnimations.centerButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -60],
                    })
                  },
                  {
                    scale: floatingButtons.floatingAnimations.centerButtonAnimation.interpolate({
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
                onPress={floatingButtons.handleCreateSalePress}
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
                opacity: floatingButtons.floatingAnimations.buttonOpacityAnimation,
                transform: [
                  { 
                    translateX: floatingButtons.floatingAnimations.rightButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 60],
                    })
                  },
                  { 
                    translateY: floatingButtons.floatingAnimations.rightButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -40],
                    })
                  },
                  {
                    scale: floatingButtons.floatingAnimations.rightButtonAnimation.interpolate({
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
                onPress={floatingButtons.handleProductsPress}
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
                  calendarState.setShowClientsScreen(true);
                } else if (item.label === 'Config') {
                  calendarState.setShowSettingsScreen(true);
                } else if (item.label === 'Alertas') {
                  calendarState.setShowNotificationsScreen(true);
                } else if (item.label === 'Agregar') {
                  floatingButtons.handleAddPress();
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

export default CalendarScreen;