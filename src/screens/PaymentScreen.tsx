/**
 * Payment Screen - HeyData Mobile
 * Vista de pagos y facturación de una cita
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
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
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

const PlusIcon = ({ color = '#FFFFFF', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 5V19M5 12H19" 
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
  telefono?: string;
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

interface PaymentScreenProps {
  appointment: CalendarEvent;
  onGoBack: () => void;
  onEditAppointment: () => void;
  onPaymentComplete?: (paymentData: any) => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  appointment,
  onGoBack,
  onEditAppointment,
  onPaymentComplete,
}) => {
  console.log('💰 PaymentScreen renderizado', { appointment });

  const [totalPagado, setTotalPagado] = useState(0);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const restante = appointment.total - totalPagado;

  const handleOpenAddPaymentMethod = () => {
    console.log('🔥 Abriendo pantalla de agregar método de pago');
    setShowAddPaymentMethod(true);
  };

  const handleCloseAddPaymentMethod = () => {
    console.log('🔥 Cerrando pantalla de agregar método de pago');
    setShowAddPaymentMethod(false);
  };

  const handleSavePaymentMethod = (paymentData: any) => {
    console.log('💰 Guardando método de pago:', paymentData);
    // Aquí podrías agregar la lógica para guardar el método de pago
    // Por ejemplo, actualizar el total pagado
    if (paymentData.amount) {
      const amount = parseFloat(paymentData.amount);
      setTotalPagado(prev => prev + amount);
    }
    setShowAddPaymentMethod(false);
  };

  const handlePayment = () => {
    if (onPaymentComplete) {
      onPaymentComplete({
        appointmentId: appointment.id,
        totalAmount: appointment.total,
        paidAmount: totalPagado,
        remainingAmount: restante,
        paymentDate: new Date().toISOString(),
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onGoBack}
        >
          <BackIcon color="#333" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagos</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Información del Cliente */}
        <View style={styles.clientCard}>
          <Text style={styles.clientLabel}>Cliente</Text>
          <Text style={styles.clientName}>{appointment.cliente.nombre}</Text>
        </View>

        {/* Detalles */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Detalles</Text>
          
          {appointment.detalles.map((detalle, index) => (
            <View key={detalle.id} style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{detalle.servicio.nombre}</Text>
                <Text style={styles.serviceDetails}>
                  {detalle.inicioServicio} - {(() => {
                    const [hour, min] = detalle.inicioServicio.split(':').map(Number);
                    const endMinutes = hour * 60 + min + detalle.duracionMinutos;
                    const endHour = Math.floor(endMinutes / 60);
                    const endMin = endMinutes % 60;
                    return `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
                  })()} • {detalle.empleado.name}
                </Text>
              </View>
              <Text style={styles.servicePrice}>${detalle.precio}</Text>
            </View>
          ))}
        </View>

        {/* Botón de agregar servicio */}
        <View style={styles.addServiceContainer}>
          <TouchableOpacity 
            style={styles.addServiceButton}
            onPress={handleOpenAddPaymentMethod}
            activeOpacity={0.8}
          >
            <PlusIcon color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer con totales y botón */}
      <View style={styles.footer}>
        {/* Totales */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalColumn}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${appointment.total}.00</Text>
          </View>
          <View style={styles.remainingColumn}>
            <Text style={styles.remainingLabel}>Restante</Text>
            <Text style={styles.remainingAmount}>${restante}.00</Text>
          </View>
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity 
          style={styles.editButton}
          onPress={onEditAppointment}
        >
          <Text style={styles.editButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para agregar método de pago */}
      {showAddPaymentMethod && (
        <View style={styles.modalOverlay}>
          <AddPaymentMethodScreen
            onSave={handleSavePaymentMethod}
            onClose={handleCloseAddPaymentMethod}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  serviceDetails: {
    fontSize: 14,
    color: '#666',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addServiceContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  addServiceButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E4B69',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  totalColumn: {
    flex: 1,
    alignItems: 'flex-start',
  },
  remainingColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  remainingLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  remainingAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#2E4B69',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
});

export default PaymentScreen;
