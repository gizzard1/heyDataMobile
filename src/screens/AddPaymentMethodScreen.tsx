import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';

// Iconos SVG
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M6 9L12 15L18 9" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface AddPaymentMethodScreenProps {
  onSave: (paymentData: PaymentData) => void;
  onClose: () => void;
}

interface PaymentData {
  type: string;
  concept: string;
  amount: string;
  reference: string;
  employee: string;
}

const AddPaymentMethodScreen: React.FC<AddPaymentMethodScreenProps> = ({
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<PaymentData>({
    type: 'Método de pago',
    concept: 'Efectivo',
    amount: '',
    reference: '',
    employee: 'Norma',
  });

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showConceptDropdown, setShowConceptDropdown] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  const paymentTypes = ['Método de pago', 'Efectivo', 'Tarjeta', 'Transferencia'];
  const concepts = ['Efectivo', 'Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia bancaria'];
  const employees = ['Norma', 'Brenda', 'Susana', 'Andrea', 'Isabel'];

  const handleSave = () => {
    if (formData.amount.trim()) {
      onSave(formData);
    }
  };

  const renderDropdown = (
    items: string[],
    selectedValue: string,
    onSelect: (value: string) => void,
    isVisible: boolean,
    onToggle: () => void,
    zIndex: number = 10
  ) => (
    <>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={onToggle}
          activeOpacity={0.7}
        >
          <Text style={[styles.dropdownText, selectedValue === items[0] && styles.placeholderText]}>
            {selectedValue}
          </Text>
          <ChevronDownIcon />
        </TouchableOpacity>
      </View>
      
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={onToggle}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onToggle}
        >
          <View style={styles.dropdownModal}>
            <FlatList
              data={items.slice(1)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownModalItem}
                  onPress={() => {
                    onSelect(item);
                    onToggle();
                  }}
                >
                  <Text style={styles.dropdownModalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.dropdownModalList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar forma de pago</Text>
      </View>

      <View style={styles.content}>
        {/* Tipo */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo</Text>
          {renderDropdown(
            paymentTypes,
            formData.type,
            (value) => setFormData(prev => ({ ...prev, type: value })),
            showTypeDropdown,
            () => setShowTypeDropdown(!showTypeDropdown),
            100
          )}
        </View>

        {/* Concepto */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Concepto</Text>
          {renderDropdown(
            concepts,
            formData.concept,
            (value) => setFormData(prev => ({ ...prev, concept: value })),
            showConceptDropdown,
            () => setShowConceptDropdown(!showConceptDropdown),
            90
          )}
        </View>

        {/* Monto */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Monto</Text>
          <TextInput
            style={styles.input}
            value={formData.amount}
            onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
            placeholder="$0.00"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        {/* Referencia */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Referencia</Text>
          <TextInput
            style={styles.input}
            value={formData.reference}
            onChangeText={(text) => setFormData(prev => ({ ...prev, reference: text }))}
            placeholder="Referencia"
            placeholderTextColor="#999"
          />
        </View>

        {/* Empleado */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Empleado</Text>
          {renderDropdown(
            ['Seleccionar empleado', ...employees],
            formData.employee,
            (value) => setFormData(prev => ({ ...prev, employee: value })),
            showEmployeeDropdown,
            () => setShowEmployeeDropdown(!showEmployeeDropdown),
            80
          )}
        </View>
      </View>

      {/* Botón Agregar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.addButton,
            !formData.amount.trim() && styles.addButtonDisabled
          ]}
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={!formData.amount.trim()}
        >
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 20,
    position: 'relative',
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    maxHeight: 300,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  dropdownModalList: {
    maxHeight: 250,
  },
  dropdownModalItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownModalItemText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addButton: {
    backgroundColor: '#4a4a4a',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddPaymentMethodScreen;
