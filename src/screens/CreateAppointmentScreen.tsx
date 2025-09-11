import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';

interface CreateAppointmentScreenProps {
  onGoBack: () => void;
}

const CreateAppointmentScreen: React.FC<CreateAppointmentScreenProps> = ({
  onGoBack,
}) => {
  const [selectedDate, setSelectedDate] = useState('Hoy');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedClient, setSelectedClient] = useState('Seleccione una opción');
  const [selectedService, setSelectedService] = useState('Seleccione una opción');
  
  // Estados para controlar los modals de los dropdowns
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const dates = ['Hoy', 'Mañana', 'Pasado mañana'];
  const times = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  const clients = [
    'Seleccione una opción',
    'Juan Pérez',
    'María González',
    'Carlos Rodríguez',
    'Ana López',
    'Pedro Martínez'
  ];

  const services = [
    'Seleccione una opción',
    'Corte de cabello',
    'Manicure',
    'Pedicure',
    'Masaje facial',
    'Depilación',
    'Tratamiento capilar'
  ];

  // Componente Dropdown personalizado
  const CustomDropdown = ({ 
    value, 
    options, 
    onSelect, 
    placeholder = "Seleccione una opción",
    visible,
    onClose 
  }: {
    value: string;
    options: string[];
    onSelect: (value: string) => void;
    placeholder?: string;
    visible: boolean;
    onClose: () => void;
  }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const handleScheduleAppointment = () => {
    console.log('Agendando cita:', {
      fecha: selectedDate,
      hora: selectedTime,
      cliente: selectedClient,
      servicio: selectedService
    });
    
    // Aquí puedes agregar la lógica para guardar la cita
    onGoBack(); // Regresa a la pantalla anterior
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear cita</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Fecha */}
        <View style={styles.section}>
          <Text style={styles.label}>Fecha</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowDateModal(true)}
          >
            <Text style={styles.dropdownText}>{selectedDate}</Text>
            <Text style={styles.dropdownArrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Hora de inicio */}
        <View style={styles.section}>
          <Text style={styles.label}>Hora de inicio</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowTimeModal(true)}
          >
            <Text style={styles.dropdownText}>{selectedTime}</Text>
            <Text style={styles.dropdownArrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Cliente */}
        <View style={styles.section}>
          <Text style={styles.label}>Cliente</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowClientModal(true)}
          >
            <Text style={[
              styles.dropdownText, 
              selectedClient === 'Seleccione una opción' && styles.placeholderText
            ]}>
              {selectedClient}
            </Text>
            <Text style={styles.dropdownArrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Servicio */}
        <View style={styles.section}>
          <Text style={styles.label}>Servicio</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowServiceModal(true)}
          >
            <Text style={[
              styles.dropdownText, 
              selectedService === 'Seleccione una opción' && styles.placeholderText
            ]}>
              {selectedService}
            </Text>
            <Text style={styles.dropdownArrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Sección de servicios */}
        <View style={styles.servicesSection}>
          <Text style={styles.servicesTitle}>Servicios</Text>
          <View style={styles.servicesContent}>
            {/* Aquí se pueden agregar servicios adicionales */}
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.materialLabel}>Material uso</Text>
            <View style={styles.totalRightSection}>
              <Text style={styles.totalLabelFinal}>Total</Text>
              <Text style={styles.totalAmountFinal}>$0.00</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón Agendar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={handleScheduleAppointment}
        >
          <Text style={styles.scheduleButtonText}>Agendar</Text>
        </TouchableOpacity>
      </View>

      {/* Modals para los dropdowns */}
      <CustomDropdown
        value={selectedDate}
        options={dates}
        onSelect={setSelectedDate}
        visible={showDateModal}
        onClose={() => setShowDateModal(false)}
      />

      <CustomDropdown
        value={selectedTime}
        options={times}
        onSelect={setSelectedTime}
        visible={showTimeModal}
        onClose={() => setShowTimeModal(false)}
      />

      <CustomDropdown
        value={selectedClient}
        options={clients}
        onSelect={setSelectedClient}
        visible={showClientModal}
        onClose={() => setShowClientModal(false)}
      />

      <CustomDropdown
        value={selectedService}
        options={services}
        onSelect={setSelectedService}
        visible={showServiceModal}
        onClose={() => setShowServiceModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333333',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '500',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  placeholderText: {
    color: '#999999',
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#666666',
    transform: [{ rotate: '90deg' }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '80%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333333',
  },
  servicesSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  servicesContent: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 20,
    minHeight: 80,
  },
  totalSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  materialLabel: {
    fontSize: 16,
    color: '#333333',
    textDecorationLine: 'underline',
    flex: 1,
  },
  totalRightSection: {
    alignItems: 'flex-end',
  },
  totalColumn: {
    flex: 1,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
    textAlign: 'center',
  },
  totalAmount: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    textAlign: 'center',
  },
  totalLabelFinal: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'normal',
    marginBottom: 4,
    textAlign: 'right',
  },
  totalAmountFinal: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  scheduleButton: {
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateAppointmentScreen;
