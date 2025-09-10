/**
 * Clients Screen - HeyData Mobile
 * Vista de listado de clientes
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
  FlatList,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

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

const SearchIcon = ({ color = '#999', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2"/>
    <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const ClearIcon = ({ color = '#999', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M18 6L6 18M6 6L18 18" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const ChevronRightIcon = ({ color = '#C7C7CC', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M9 18L15 12L9 6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const AddUserIcon = ({ color = '#FFFFFF', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="3" stroke={color} strokeWidth="2"/>
    <Path d="M21 21s-1-6-9-6-9 6-9 6" stroke={color} strokeWidth="2"/>
    <Path d="M16 3v6M13 6h6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

// Interfaces
interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  iniciales: string;
}

interface ClientsScreenProps {
  onGoBack: () => void;
  onClientSelect?: (cliente: Cliente) => void;
}

const ClientsScreen: React.FC<ClientsScreenProps> = ({
  onGoBack,
  onClientSelect,
}) => {
  const [searchText, setSearchText] = useState('');

  // Datos de ejemplo de clientes
  const clientes: Cliente[] = [
    {
      id: '1',
      nombre: 'Abigail García Cornejo',
      email: 'aabigail.gc7@gmail.com',
      telefono: '+523222271553',
      iniciales: 'AGC',
    },
    {
      id: '2',
      nombre: 'Adriana Hernández',
      email: 'adri2609@hotmail.com',
      telefono: '+523316052288',
      iniciales: 'AH',
    },
    {
      id: '3',
      nombre: 'Adriana Camarena Montes',
      email: 'adriana.montes@hp.com',
      telefono: '+523310685309',
      iniciales: 'ACM',
    },
    {
      id: '4',
      nombre: 'Adriana Ledezma',
      email: 'advile1660@hotmail.com',
      telefono: '+523311087628',
      iniciales: 'AL',
    },
    {
      id: '5',
      nombre: 'Abigail García Cornejo',
      email: 'aabigail.gc7@gmail.com',
      telefono: '+523222271553',
      iniciales: 'AGC',
    },
  ];

  // Filtrar clientes basado en búsqueda
  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchText.toLowerCase()) ||
    cliente.telefono.includes(searchText)
  );

  const handleClientPress = (cliente: Cliente) => {
    console.log('Cliente seleccionado:', cliente);
    if (onClientSelect) {
      onClientSelect(cliente);
    }
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const renderClientItem = ({ item }: { item: Cliente }) => (
    <TouchableOpacity 
      style={styles.clientItem}
      onPress={() => handleClientPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.clientAvatar}>
        <Text style={styles.clientInitials}>{item.iniciales}</Text>
      </View>
      
      <View style={styles.clientInfo}>
        <Text style={styles.clientName} numberOfLines={1}>
          {item.nombre}
        </Text>
        <Text style={styles.clientEmail} numberOfLines={1}>
          {item.email}
        </Text>
        <Text style={styles.clientPhone} numberOfLines={1}>
          {item.telefono}
        </Text>
      </View>
      
      <ChevronRightIcon />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onGoBack}
        >
          <BackIcon color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clientes</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon color="#999" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, correo, teléfono..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <ClearIcon color="#999" size={16} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Clients List */}
      <View style={styles.clientsContainer}>
        <FlatList
          data={filteredClientes}
          renderItem={renderClientItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.floatingButton}>
        <AddUserIcon color="#FFFFFF" size={24} />
      </TouchableOpacity>
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
    color: '#000',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 8,
    marginRight: 8,
  },
  clearButton: {
    padding: 4,
  },
  clientsContainer: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  clientInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  clientEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  clientPhone: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: 'transparent',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
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
});

export default ClientsScreen;
