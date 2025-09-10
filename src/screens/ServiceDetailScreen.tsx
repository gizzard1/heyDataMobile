/**
 * Service Detail Screen - HeyData Mobile
 * Vista para editar los detalles de un servicio específico
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
  TextInput,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

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

// Interfaces
interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracionMinutos: number;
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

interface ServiceDetailScreenProps {
  serviceDetail: DetalleCita;
  onGoBack: () => void;
  onSave: (updatedDetail: DetalleCita) => void;
}

const ServiceDetailScreen: React.FC<ServiceDetailScreenProps> = ({
  serviceDetail,
  onGoBack,
  onSave,
}) => {
  const [selectedService, setSelectedService] = useState(serviceDetail.servicio.nombre);
  const [selectedStartTime, setSelectedStartTime] = useState(serviceDetail.inicioServicio);
  const [selectedEndTime, setSelectedEndTime] = useState(() => {
    // Calcular hora de fin basada en duración
    const [hour, min] = serviceDetail.inicioServicio.split(':').map(Number);
    const endMinutes = hour * 60 + min + serviceDetail.duracionMinutos;
    const endHour = Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;
    return `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
  });
  const [selectedEmployee, setSelectedEmployee] = useState(serviceDetail.empleado.name);
  const [price, setPrice] = useState(serviceDetail.precio.toString());
  const [discountType, setDiscountType] = useState('%');
  const [discountValue, setDiscountValue] = useState('0.00');

  // Estados para dropdowns
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showEmployeePicker, setShowEmployeePicker] = useState(false);
  const [showDiscountPicker, setShowDiscountPicker] = useState(false);

  // Opciones para dropdowns
  const serviceOptions = ['Corte de dama', 'Corte de caballero', 'Tinte', 'Luces', 'Peinado', 'Manicure', 'Pedicure'];
  const timeOptions = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];
  const employeeOptions = ['Seleccione una opción', 'Brenda', 'María', 'Ana', 'Carmen'];
  const discountOptions = ['%', '$'];

  const closeAllDropdowns = () => {
    setShowServicePicker(false);
    setShowStartTimePicker(false);
    setShowEndTimePicker(false);
    setShowEmployeePicker(false);
    setShowDiscountPicker(false);
  };

  const calculateTotal = () => {
    const basePrice = parseFloat(price) || 0;
    const discount = parseFloat(discountValue) || 0;
    
    if (discountType === '%') {
      return basePrice - (basePrice * discount / 100);
    } else {
      return basePrice - discount;
    }
  };

  const handleSave = () => {
    // Calcular duración en minutos
    const [startHour, startMin] = selectedStartTime.split(':').map(Number);
    const [endHour, endMin] = selectedEndTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const duration = endMinutes - startMinutes;

    const updatedDetail: DetalleCita = {
      ...serviceDetail,
      servicio: {
        ...serviceDetail.servicio,
        nombre: selectedService,
        precio: parseFloat(price),
      },
      inicioServicio: selectedStartTime,
      duracionMinutos: duration,
      precio: calculateTotal(),
      empleado: {
        ...serviceDetail.empleado,
        name: selectedEmployee,
      }
    };

    onSave(updatedDetail);
  };

  const renderDropdown = (
    label: string,
    value: string,
    isOpen: boolean,
    onPress: () => void,
    placeholder?: string
  ) => (
    <View style={[styles.fieldContainer, isOpen && styles.fieldContainerOpen]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity 
        style={styles.dropdown}
        onPress={onPress}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
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
      {(showServicePicker || showStartTimePicker || showEndTimePicker || showEmployeePicker || showDiscountPicker) && (
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
        <Text style={styles.headerTitle}>Editar detalle</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onTouchStart={closeAllDropdowns}
      >
        {/* Formulario */}
        <View style={styles.form}>
          {/* Servicio */}
          {renderDropdown(
            'Servicio',
            selectedService,
            showServicePicker,
            () => {
              closeAllDropdowns();
              setShowServicePicker(true);
            }
          )}

          {/* Hora de Inicio */}
          {renderDropdown(
            'Inicia',
            selectedStartTime,
            showStartTimePicker,
            () => {
              closeAllDropdowns();
              setShowStartTimePicker(true);
            }
          )}

          {/* Hora de Término */}
          {renderDropdown(
            'Termina',
            selectedEndTime,
            showEndTimePicker,
            () => {
              closeAllDropdowns();
              setShowEndTimePicker(true);
            }
          )}

          {/* Empleado */}
          {renderDropdown(
            'Empleado',
            selectedEmployee,
            showEmployeePicker,
            () => {
              closeAllDropdowns();
              setShowEmployeePicker(true);
            },
            'Seleccione una opción'
          )}

          {/* Precio */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Precio</Text>
            <TextInput
              style={styles.textInput}
              value={`$${price}`}
              onChangeText={(text) => setPrice(text.replace('$', ''))}
              keyboardType="numeric"
              placeholder="$0.00"
            />
          </View>

          {/* Descuento */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Descuento</Text>
            <View style={styles.discountContainer}>
              <TouchableOpacity 
                style={styles.discountTypeButton}
                onPress={() => {
                  closeAllDropdowns();
                  setShowDiscountPicker(true);
                }}
              >
                <Text style={styles.discountTypeText}>{discountType}</Text>
                <ChevronDownIcon size={16} />
              </TouchableOpacity>
              <TextInput
                style={styles.discountInput}
                value={discountValue}
                onChangeText={setDiscountValue}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>
          </View>

          {/* IVA */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>IVA</Text>
            <TextInput
              style={styles.textInput}
              value=""
              placeholder=""
              editable={false}
            />
          </View>

          {/* Total */}
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Dropdowns fijos */}
      {renderDropdownOptions(showServicePicker, serviceOptions, setSelectedService, 180)}
      {renderDropdownOptions(showStartTimePicker, timeOptions, setSelectedStartTime, 260)}
      {renderDropdownOptions(showEndTimePicker, timeOptions, setSelectedEndTime, 340)}
      {renderDropdownOptions(showEmployeePicker, employeeOptions, setSelectedEmployee, 420)}
      {renderDropdownOptions(showDiscountPicker, discountOptions, setDiscountType, 560)}

      {/* Botón Agendar */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Agendar</Text>
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
  placeholderText: {
    color: '#999',
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    fontSize: 16,
    color: '#333',
  },
  discountContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  discountTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    width: 80,
    gap: 5,
  },
  discountTypeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  discountInput: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    fontSize: 16,
    color: '#333',
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
    maxHeight: 200,
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
  totalSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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

export default ServiceDetailScreen;
