/**
 * Appointment Detail Modal
 * Modal para mostrar los detalles completos de una cita
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { BackIcon, EditIcon, TrashIcon } from './CalendarIcons';

interface AppointmentDetailModalProps {
  visible: boolean;
  selectedEvent: any;
  onClose: () => void;
  onEdit: () => void;
  onPay: () => void;
  onDelete?: () => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  visible,
  selectedEvent,
  onClose,
  onEdit,
  onPay,
  onDelete,
}) => {
  if (!visible || !selectedEvent) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.appointmentDetailContainer}>
        {/* Header */}
        <View style={styles.appointmentDetailHeader}>
          <TouchableOpacity 
            onPress={onClose}
            style={styles.backButton}
          >
            <BackIcon color="#007AFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.appointmentDetailTitle}>
            Cita agendada #{selectedEvent?.id || ''}
          </Text>
          <TouchableOpacity 
            style={styles.editIconButton}
            onPress={() => {
              console.log('🔧 Botón de editar presionado');
              console.log('📋 selectedEvent:', selectedEvent);
              onEdit();
              console.log('✅ Navegando a edición');
            }}
          >
            <EditIcon color="#007AFF" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.appointmentDetailContent}>
          {selectedEvent ? (
            <>
              {/* Horario y Fecha */}
              <View style={styles.appointmentDetailCard}>
                <View style={styles.appointmentDetailRow}>
                  <View style={styles.appointmentDetailColumn}>
                    <Text style={styles.appointmentDetailLabel}>Horario</Text>
                    <Text style={styles.appointmentDetailValue}>
                      {selectedEvent.startTime} - {selectedEvent.endTime}
                    </Text>
                  </View>
                  <View style={styles.appointmentDetailColumn}>
                    <Text style={styles.appointmentDetailLabel}>Fecha</Text>
                    <Text style={styles.appointmentDetailValue}>Hoy</Text>
                  </View>
                </View>
              </View>

              {/* Cliente */}
              <View style={styles.appointmentDetailCard}>
                <Text style={styles.appointmentDetailLabel}>Cliente</Text>
                <Text style={styles.appointmentDetailClientName}>
                  {selectedEvent.cliente?.nombre || selectedEvent.title || 'Sin cliente'}
                </Text>
              </View>

              {/* Detalles de Servicios */}
              <View style={styles.appointmentDetailCard}>
                <Text style={styles.appointmentDetailSectionTitle}>Detalles</Text>
                {selectedEvent.detalles?.map((detalle: any, index: number) => (
                  <View key={detalle.id || index} style={styles.serviceDetailItem}>
                    <View style={styles.serviceDetailBorder} />
                    <View style={styles.serviceDetailContent}>
                      <Text style={styles.serviceDetailTitle}>
                        {detalle.servicio?.nombre || 'Servicio'}
                      </Text>
                      <Text style={styles.serviceDetailTime}>
                        {detalle.inicioServicio} - {(() => {
                          const [hour, min] = detalle.inicioServicio.split(':').map(Number);
                          const endMinutes = hour * 60 + min + (detalle.duracionMinutos || 0);
                          const endHour = Math.floor(endMinutes / 60);
                          const endMin = endMinutes % 60;
                          return `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
                        })()}
                      </Text>
                      <Text style={styles.serviceDetailEmployee}>
                        Atiende {detalle.empleado?.name || 'Sin asignar'}
                      </Text>
                    </View>
                    <Text style={styles.serviceDetailPrice}>
                      ${detalle.precio || 0}
                    </Text>
                  </View>
                )) || (
                  <Text style={styles.noServicesText}>No hay servicios registrados</Text>
                )}
              </View>
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando detalles...</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.appointmentDetailFooter}>
          <View style={styles.totalSection}>
            <View style={styles.totalColumn}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>
                ${selectedEvent?.total || 0}.00
              </Text>
            </View>
            <View style={styles.remainingColumn}>
              <Text style={styles.remainingLabel}>Restante</Text>
              <Text style={styles.remainingAmount}>
                ${selectedEvent?.total || 0}.00
              </Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            {onDelete && (
              <TouchableOpacity 
                style={styles.deleteIconButton}
                onPress={onDelete}
              >
                <TrashIcon color="#FF3B30" size={24} />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.chargeButtonNew}
              onPress={onPay}
            >
              <Text style={styles.chargeButtonNewText}>Cobrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  appointmentDetailContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appointmentDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentDetailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  editIconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentDetailContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  appointmentDetailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  appointmentDetailRow: {
    flexDirection: 'row',
  },
  appointmentDetailColumn: {
    flex: 1,
  },
  appointmentDetailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  appointmentDetailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  appointmentDetailClientName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  appointmentDetailSectionTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 16,
  },
  serviceDetailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  serviceDetailBorder: {
    width: 4,
    backgroundColor: '#007AFF',
    marginRight: 12,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  serviceDetailContent: {
    flex: 1,
  },
  serviceDetailTitle: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceDetailTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  serviceDetailEmployee: {
    fontSize: 14,
    color: '#666',
  },
  serviceDetailPrice: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '600',
  },
  noServicesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  appointmentDetailFooter: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16,
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
    color: '#666666',
    fontWeight: '600',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
  },
  remainingLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 4,
  },
  remainingAmount: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  chargeButtonNew: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 16,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chargeButtonNewText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});
