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

interface CreateSaleScreenProps {
  onGoBack: () => void;
}

const CreateSaleScreen: React.FC<CreateSaleScreenProps> = ({
  onGoBack,
}) => {
  const [selectedClient, setSelectedClient] = useState('Seleccione una opción');
  const [selectedProduct, setSelectedProduct] = useState('Seleccione una opción');
  
  // Estados para controlar los modals de los dropdowns
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  const clients = [
    'Seleccione una opción',
    'Juan Pérez',
    'María González',
    'Carlos Rodríguez',
    'Ana López',
    'Pedro Martínez'
  ];

  const products = [
    'Seleccione una opción',
    'Shampoo Premium',
    'Acondicionador',
    'Mascarilla Capilar',
    'Serum Reparador',
    'Crema de Peinar',
    'Spray Protector'
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

  const handleContinue = () => {
    console.log('Continuando con la venta:', {
      cliente: selectedClient,
      producto: selectedProduct
    });
    
    // Aquí puedes agregar la lógica para procesar la venta
    onGoBack(); // Regresa a la pantalla anterior
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear venta</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

        {/* Producto */}
        <View style={styles.section}>
          <Text style={styles.label}>Producto</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowProductModal(true)}
          >
            <Text style={[
              styles.dropdownText, 
              selectedProduct === 'Seleccione una opción' && styles.placeholderText
            ]}>
              {selectedProduct}
            </Text>
            <Text style={styles.dropdownArrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Sección de productos */}
        <View style={styles.productsSection}>
          <Text style={styles.productsTitle}>Productos</Text>
          <View style={styles.productsContent}>
            {/* Aquí se pueden agregar productos adicionales */}
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <View style={styles.totalRightSection}>
              <Text style={styles.totalLabelFinal}>Total</Text>
              <Text style={styles.totalAmountFinal}>$0.00</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón Continuar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>

      {/* Modals para los dropdowns */}
      <CustomDropdown
        value={selectedClient}
        options={clients}
        onSelect={setSelectedClient}
        visible={showClientModal}
        onClose={() => setShowClientModal(false)}
      />

      <CustomDropdown
        value={selectedProduct}
        options={products}
        onSelect={setSelectedProduct}
        visible={showProductModal}
        onClose={() => setShowProductModal(false)}
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
  productsSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  productsContent: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 20,
    minHeight: 200,
  },
  totalSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  totalRightSection: {
    alignItems: 'flex-end',
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
  continueButton: {
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateSaleScreen;
