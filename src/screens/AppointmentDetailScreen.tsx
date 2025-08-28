/**
 * Appointment Detail Screen - HeyData Mobile
 * Vista detallada de una cita para editar información
 * 
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Iconos
const BackIcon = ({ color = '#007AFF', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M15 18L9 12L15 6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const ChevronDownIcon = ({ color = '#666', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M6 9L12 15L18 9" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Interfaces (importadas desde CalendarScreen)
interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracionMinutos: number;
}

interface Cliente {
  id: string;
  nombre: string;
  telefono?: string; // Hacerlo opcional
}

interface Worker {
  id: string;
  name: string;
  color: string;
}

interface DetalleCita {
  id: string;
  servicioId: string;
  servicio: Servicio;
  empleadoId: string;
  empleado: Worker;
  inicioServicio: string;
  duracionMinutos: number;
  precio: number;
}

interface CalendarEvent {
  id: string;
  clienteId: string;
  cliente: Cliente;
  startTime: string;
  endTime: string;
  date: string;
  detalles: DetalleCita[];
  estado: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';
  total: number;
}

interface AppointmentDetailScreenProps {
  appointment: CalendarEvent;
  onGoBack: () => void;
  onSave: (appointment: CalendarEvent) => void;
}

const AppointmentDetailScreen: React.FC<AppointmentDetailScreenProps> = ({
  appointment,
  onGoBack,
  onSave,
}) => {
  console.log('🎯 AppointmentDetailScreen renderizado', { appointment });
  
  const [selectedDate, setSelectedDate] = useState('Hoy');
  const [selectedTime, setSelectedTime] = useState(appointment.startTime);
  const [selectedClient, setSelectedClient] = useState(appointment.cliente.nombre);
  const [selectedService, setSelectedService] = useState('Seleccione una opción');

  // Estados para controlar dropdowns
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);

  // Opciones para los dropdowns
  const dateOptions = ['Hoy', 'Mañana', 'Pasado mañana'];
  const timeOptions = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const clientOptions = ['Adriana Hernández', 'María García', 'Ana López', 'Carmen Ruiz'];
  const serviceOptions = ['Corte de cabello', 'Tinte', 'Luces', 'Peinado', 'Manicure', 'Pedicure'];

  // Función para cerrar todos los dropdowns
  const closeAllDropdowns = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
    setShowClientPicker(false);
    setShowServicePicker(false);
  };

  // Handlers para abrir dropdowns (cierran los otros primero)
  const handleDatePickerToggle = () => {
    closeAllDropdowns();
    setShowDatePicker(prev => !prev);
  };

  const handleTimePickerToggle = () => {
    closeAllDropdowns();
    setShowTimePicker(prev => !prev);
  };

  const handleClientPickerToggle = () => {
    closeAllDropdowns();
    setShowClientPicker(prev => !prev);
  };

  const handleServicePickerToggle = () => {
    closeAllDropdowns();
    setShowServicePicker(prev => !prev);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const handleSave = () => {
    // Aquí implementarías la lógica para guardar los cambios
    onSave(appointment);
  };

  const renderDropdown = (
    label: string,
    value: string,
    isOpen: boolean,
    onPress: () => void,
    options: string[],
    onSelect: (option: string) => void
  ) => (
    <View style={[styles.fieldContainer, isOpen && styles.fieldContainerOpen]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity 
        style={styles.dropdown}
        onPress={onPress}
      >
        <Text style={styles.dropdownText}>{value}</Text>
        <ChevronDownIcon />
      </TouchableOpacity>
    </View>
  );

  const renderDropdownOptions = (
    isOpen: boolean,
    options: string[],
    onSelect: (option: string) => void,
    topOffset: number
  ) => {
    if (!isOpen) return null;
    
    return (
      <View style={[styles.dropdownOptionsFixed, { top: topOffset }]}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dropdownOption,
              index === options.length - 1 && styles.dropdownOptionLast
            ]}
            onPress={() => {
              onSelect(option);
              closeAllDropdowns();
            }}
          >
            <Text style={styles.dropdownOptionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Overlay para cerrar dropdowns */}
      {(showDatePicker || showTimePicker || showClientPicker || showServicePicker) && (
        <TouchableOpacity 
          style={styles.overlay}
          onPress={closeAllDropdowns}
          activeOpacity={1}
        />
      )}
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onGoBack}
        >
          <BackIcon color="#333" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar cita</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Formulario */}
        <View style={styles.form}>
          {/* Fecha */}
          {renderDropdown(
            'Fecha',
            selectedDate,
            showDatePicker,
            handleDatePickerToggle,
            dateOptions,
            setSelectedDate
          )}

          {/* Hora de inicio */}
          {renderDropdown(
            'Hora de inicio',
            selectedTime,
            showTimePicker,
            handleTimePickerToggle,
            timeOptions,
            setSelectedTime
          )}

          {/* Cliente */}
          {renderDropdown(
            'Cliente',
            selectedClient,
            showClientPicker,
            handleClientPickerToggle,
            clientOptions,
            setSelectedClient
          )}

          {/* Servicio */}
          {renderDropdown(
            'Servicio',
            selectedService,
            showServicePicker,
            handleServicePickerToggle,
            serviceOptions,
            setSelectedService
          )}
        </View>

        {/* Sección de Servicios */}
        <View style={styles.servicesSection}>
          <Text style={styles.servicesTitle}>Servicios</Text>
          
          {appointment.detalles.map((detalle, index) => (
            <View key={detalle.id} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <View style={styles.serviceIndicator} />
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{detalle.servicio.nombre}</Text>
                  <Text style={styles.serviceTime}>
                    {detalle.inicioServicio} - {appointment.endTime} • {detalle.empleado.name}
                  </Text>
                </View>
                <View style={styles.servicePrice}>
                  <Text style={styles.servicePriceText}>${detalle.precio}</Text>
                  <Text style={styles.serviceDiscount}>-15%</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${appointment.total}.00</Text>
          </View>
        </View>
      </ScrollView>

      {/* Dropdowns fijos que aparecen encima de todo */}
      {renderDropdownOptions(showDatePicker, dateOptions, setSelectedDate, 180)}
      {renderDropdownOptions(showTimePicker, timeOptions, setSelectedTime, 260)}
      {renderDropdownOptions(showClientPicker, clientOptions, setSelectedClient, 340)}
      {renderDropdownOptions(showServicePicker, serviceOptions, setSelectedService, 420)}

      {/* Botón Guardar */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50000,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
    position: 'relative',
    zIndex: 10,
  },
  fieldContainer: {
    marginBottom: 20,
    position: 'relative',
    zIndex: 1,
  },
  fieldContainerOpen: {
    zIndex: 99999,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 4,
    elevation: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    zIndex: 100000,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dropdownOptionsFixed: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    zIndex: 100000,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  servicesSection: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 24,
    zIndex: -1,
    position: 'relative',
  },
  servicesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIndicator: {
    width: 4,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serviceTime: {
    fontSize: 14,
    color: '#666',
  },
  servicePrice: {
    alignItems: 'flex-end',
  },
  servicePriceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  serviceDiscount: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  totalSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#4A5568',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppointmentDetailScreen;
