/**
 * Calendar Filter Component - HeyData Mobile
 * Modal de filtros para el calendario
 * 
 * @format
 */

import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { CalendarFilterProps } from '../types';
import { FilterIcon } from './CalendarIcons';
import { filterStyles } from '../styles/filterStyles';

export const CalendarFilter: React.FC<CalendarFilterProps> = ({
  visible,
  workers,
  selectedWorkers,
  onWorkerToggle,
  onSelectAll,
  onClearAll,
  onApply,
  onClose,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={filterStyles.modalOverlay}>
        <View style={filterStyles.filterModal}>
          <View style={filterStyles.filterHeader}>
            <TouchableOpacity 
              onPress={onClose}
              style={filterStyles.filterBackButton}
            >
              <FilterIcon color="#007AFF" size={18} />
              <Text style={filterStyles.filterBackButtonText}>Filtrar</Text>
            </TouchableOpacity>
          </View>

          <View style={filterStyles.filterContent}>
            {/* Todos los empleados */}
            <View style={filterStyles.filterOption}>
              <TouchableOpacity 
                style={filterStyles.checkbox}
                onPress={() => {
                  if (selectedWorkers.length === workers.length) {
                    onClearAll();
                  } else {
                    onSelectAll();
                  }
                }}
              >
                <Text style={filterStyles.checkboxIcon}>
                  {selectedWorkers.length === workers.length ? '☑' : '☐'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => {
                  if (selectedWorkers.length === workers.length) {
                    onClearAll();
                  } else {
                    onSelectAll();
                  }
                }}
              >
                <Text style={filterStyles.filterOptionText}>Todos los empleados</Text>
              </TouchableOpacity>
            </View>

            {/* Lista de trabajadoras */}
            {workers.map((worker) => (
              <View key={worker.id} style={filterStyles.filterOption}>
                <TouchableOpacity 
                  style={filterStyles.checkbox}
                  onPress={() => onWorkerToggle(worker.id)}
                >
                  <Text style={filterStyles.checkboxIcon}>
                    {selectedWorkers.includes(worker.id) ? '☑' : '☐'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => onWorkerToggle(worker.id)}
                >
                  <Text style={filterStyles.filterOptionText}>{worker.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={filterStyles.filterButtons}>
            <TouchableOpacity 
              style={filterStyles.applyButton}
              onPress={onApply}
            >
              <Text style={filterStyles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};