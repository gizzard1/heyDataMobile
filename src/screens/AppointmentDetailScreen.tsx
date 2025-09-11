/**
 * Appointment Detail Screen - HeyData Mobile
 * Vista detallada de una cita para editar información
 * 
 * @format
 */

import React, { useState, useRef } from 'react';
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
  Animated,
  PanResponder,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import ServiceDetailScreen from './ServiceDetailScreen';
import AddPaymentMethodScreen from './AddPaymentMethodScreen';

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

const EditIcon = ({ color = '#007AFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" 
      fill="none" 
      stroke={color} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2"
    />
    <Path 
      d="M15.5 3.5l4 4L8 19l-4 1 1-4L15.5 3.5z" 
      fill="none" 
      stroke={color} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2"
    />
  </Svg>
);

const DeleteIcon = ({ color = '#FF3B30', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" 
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
  const [selectedDate, setSelectedDate] = useState('Hoy');
  const [selectedTime, setSelectedTime] = useState(appointment.startTime);
  const [selectedClient, setSelectedClient] = useState(appointment.cliente.nombre);
  const [selectedService, setSelectedService] = useState('Seleccione una opción');

  // Estados para controlar dropdowns
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);

  // Estado para controlar qué tarjeta de servicio muestra los botones
  const [selectedServiceCardId, setSelectedServiceCardId] = useState<string | null>(null);
  
  // Estado para controlar la pantalla de edición de servicio
  const [editingServiceDetail, setEditingServiceDetail] = useState<DetalleCita | null>(null);
  
  // Estado para controlar la pantalla de agregar forma de pago
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);

  // Animación para el deslizamiento de tarjetas
  const slideAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

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
    // También cerrar las tarjetas de servicio
    closeAllServiceCards();
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

  // Función para cerrar todas las tarjetas abiertas
  const closeAllServiceCards = () => {
    if (selectedServiceCardId) {
      closeServiceCard(selectedServiceCardId);
    }
  };

  // Funciones para manejar servicios
  const handleServiceCardPress = (serviceId: string) => {
    // Si la tarjeta está deslizada (abierta), la cerramos
    if (selectedServiceCardId === serviceId) {
      closeServiceCard(serviceId);
    } else {
      // Si hay otra tarjeta abierta, la cerramos primero
      if (selectedServiceCardId) {
        closeServiceCard(selectedServiceCardId);
      }
      // Abrir esta tarjeta automáticamente
      openServiceCard(serviceId);
    }
  };

  const getSlideAnimation = (serviceId: string) => {
    if (!slideAnimations[serviceId]) {
      slideAnimations[serviceId] = new Animated.Value(0);
    }
    return slideAnimations[serviceId];
  };

  const openServiceCard = (serviceId: string) => {
    // Cerrar cualquier otra tarjeta abierta
    if (selectedServiceCardId && selectedServiceCardId !== serviceId) {
      closeServiceCard(selectedServiceCardId);
    }
    
    setSelectedServiceCardId(serviceId);
    
    Animated.timing(getSlideAnimation(serviceId), {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeServiceCard = (serviceId: string) => {
    Animated.timing(getSlideAnimation(serviceId), {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (selectedServiceCardId === serviceId) {
        setSelectedServiceCardId(null);
      }
    });
  };

  const createPanResponder = (serviceId: string) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false, // No interceptar inicialmente
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Solo responder a deslizamientos reales (para mantener compatibilidad)
        const isHorizontalSwipe = Math.abs(gestureState.dx) > 30 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        return isHorizontalSwipe;
      },
      onPanResponderMove: (_, gestureState) => {
        // Solo permitir deslizamiento hacia la izquierda
        const translateX = Math.min(0, Math.max(-120, gestureState.dx));
        getSlideAnimation(serviceId).setValue(translateX);
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldOpen = gestureState.dx < -60;
        
        if (shouldOpen) {
          openServiceCard(serviceId);
        } else {
          closeServiceCard(serviceId);
        }
      },
    });
  };

  const handleEditService = (serviceId: string) => {
    // Encontrar el detalle del servicio a editar
    const serviceDetail = appointment.detalles.find(detalle => detalle.id === serviceId);
    if (serviceDetail) {
      setEditingServiceDetail(serviceDetail);
    }
    closeServiceCard(serviceId);
  };

  const handleDeleteService = (serviceId: string) => {
    // Aquí implementarías la lógica para eliminar el servicio
    // Por ejemplo, mostrar un modal de confirmación
    closeServiceCard(serviceId);
  };

  const handleSaveServiceDetail = (updatedDetail: DetalleCita) => {
    // Actualizar el detalle del servicio en la cita
    const updatedDetalles = appointment.detalles.map(detalle => 
      detalle.id === updatedDetail.id ? updatedDetail : detalle
    );
    
    const updatedAppointment = {
      ...appointment,
      detalles: updatedDetalles,
      total: updatedDetalles.reduce((sum, detalle) => sum + detalle.precio, 0)
    };
    
    onSave(updatedAppointment);
    setEditingServiceDetail(null);
  };

  const handleCloseServiceDetail = () => {
    setEditingServiceDetail(null);
  };

  // Funciones para manejar la pantalla de agregar forma de pago
  const handleOpenAddPaymentMethod = () => {
    console.log('Abriendo pantalla de agregar forma de pago');
    setShowAddPaymentMethod(true);
  };

  const handleCloseAddPaymentMethod = () => {
    setShowAddPaymentMethod(false);
  };

  const handleSavePaymentMethod = (paymentData: any) => {
    // Aquí puedes agregar la lógica para guardar el método de pago
    console.log('Nuevo método de pago:', paymentData);
    setShowAddPaymentMethod(false);
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

  // Si estamos editando un servicio, mostrar la pantalla de edición
  if (editingServiceDetail) {
    return (
      <ServiceDetailScreen
        serviceDetail={editingServiceDetail}
        onGoBack={handleCloseServiceDetail}
        onSave={handleSaveServiceDetail}
      />
    );
  }

  // Si estamos agregando una forma de pago, mostrar la pantalla correspondiente
  if (showAddPaymentMethod) {
    console.log('Mostrando pantalla de agregar forma de pago');
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, marginBottom: 20 }}>Agregar Forma de Pago</Text>
          <TouchableOpacity 
            style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8 }}
            onPress={handleCloseAddPaymentMethod}
          >
            <Text style={{ color: 'white' }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        onTouchStart={closeAllServiceCards}
        onScrollBeginDrag={closeAllServiceCards}
      >
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
          
          {appointment.detalles.map((detalle, index) => {
            const panResponder = createPanResponder(detalle.id);
            const slideAnimation = getSlideAnimation(detalle.id);
            
            return (
              <View key={detalle.id} style={styles.serviceCardContainer}>
                {/* Botones de acción (fijos en el fondo, lado derecho) */}
                <View style={styles.serviceActionsBackground}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleEditService(detalle.id)}
                  >
                    <EditIcon color="#007AFF" size={18} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteService(detalle.id)}
                  >
                    <DeleteIcon color="#FF3B30" size={18} />
                  </TouchableOpacity>
                </View>
                
                {/* Tarjeta con efecto de clip */}
                <Animated.View
                  style={[
                    styles.serviceCard,
                    styles.serviceCardAnimated,
                    {
                      width: slideAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['100%', '70%'], // Se reduce el ancho desde 100% a 70%
                        extrapolate: 'clamp',
                      }),
                    },
                  ]}
                >
                  <View {...panResponder.panHandlers} style={{ flex: 1 }}>
                    <TouchableOpacity 
                      style={styles.serviceCardContent}
                      onPress={() => handleServiceCardPress(detalle.id)}
                      activeOpacity={0.7}
                    >
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
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
            );
          })}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${appointment.total}.00</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.remainingLabel}>Restante</Text>
            <Text style={styles.remainingAmount}>${appointment.total}.00</Text>
          </View>
        </View>

        {/* Sección de Pagos */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentHeader}>
            <Text style={styles.paymentTitle}>Pagos</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => {
                console.log('BOTÓN + PRESIONADO - Agregar forma de pago');
                handleOpenAddPaymentMethod();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          {/* Lista de pagos (vacía por ahora) */}
          <View style={styles.paymentList}>
            <Text style={styles.noPaymentsText}>No hay pagos registrados</Text>
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
  scrollContent: {
    paddingBottom: 50,
    flexGrow: 1,
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
  serviceCardContainer: {
    position: 'relative',
    marginBottom: 12,
    height: 80,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    overflow: 'hidden',
  },
  serviceActionsBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#F8F9FA',
    zIndex: 1,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flex: 1,
    zIndex: 2,
    overflow: 'hidden',
  },
  serviceCardAnimated: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
  },
  serviceCardContent: {
    padding: 16,
    flex: 1,
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
  serviceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  remainingLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  remainingAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  paymentSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addPaymentButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addPaymentButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 20,
  },
  paymentList: {
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 20,
  },
  noPaymentsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default AppointmentDetailScreen;
