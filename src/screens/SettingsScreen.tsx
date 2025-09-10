/**
 * Settings Screen - HeyData Mobile
 * Vista de configuración con múltiples secciones
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

const UserIcon = ({ color = '#666', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="3" stroke={color} strokeWidth="2"/>
    <Path d="M21 21s-1-6-9-6-9 6-9 6" stroke={color} strokeWidth="2"/>
  </Svg>
);

const BuildingIcon = ({ color = '#666', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 9v.01M9 12v.01M9 15v.01M13 9v.01M13 12v.01M13 15v.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const BellIcon = ({ color = '#666', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2"/>
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const DollarIcon = ({ color = '#666', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const CreditCardIcon = ({ color = '#666', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke={color} strokeWidth="2"/>
    <Path d="M1 10h22" stroke={color} strokeWidth="2"/>
  </Svg>
);

const GiftIcon = ({ color = '#666', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const UsersIcon = ({ color = '#666', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2"/>
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/>
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2"/>
  </Svg>
);

const PackageIcon = ({ color = '#666', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8z" stroke={color} strokeWidth="2"/>
    <Path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke={color} strokeWidth="2"/>
  </Svg>
);

const ServiceIcon = ({ color = '#666', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke={color} strokeWidth="2"/>
  </Svg>
);

const TagIcon = ({ color = '#666', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke={color} strokeWidth="2"/>
    <Path d="M7 7h.01" stroke={color} strokeWidth="2"/>
  </Svg>
);

// Interfaces
interface SettingsOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  onPress?: () => void;
}

interface SettingsSection {
  id: string;
  title: string;
  options: SettingsOption[];
}

interface SettingsScreenProps {
  onGoBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onGoBack }) => {
  // Configuración de secciones y opciones
  const settingsSections: SettingsSection[] = [
    {
      id: 'mi-cuenta',
      title: 'Mi cuenta',
      options: [
        {
          id: 'datos-cuenta',
          title: 'Datos de la cuenta',
          description: 'Actualiza datos como el correo, contraseña o nombre de usuario.',
          icon: UserIcon,
          onPress: () => console.log('Datos de la cuenta'),
        },
        {
          id: 'datos-salon',
          title: 'Datos del salón',
          description: 'Configura el nombre del salón, las redes y logotipo.',
          icon: BuildingIcon,
          onPress: () => console.log('Datos del salón'),
        },
        {
          id: 'notificaciones',
          title: 'Notificaciones',
          description: 'Configura las notificaciones que deseas recibir de la aplicación.',
          icon: BellIcon,
          onPress: () => console.log('Notificaciones'),
        },
      ],
    },
    {
      id: 'negocio',
      title: 'Negocio',
      options: [
        {
          id: 'comisiones',
          title: 'Comisiones',
          description: 'Asigna los porcentajes y excepciones que reciben los empleados.',
          icon: DollarIcon,
          onPress: () => console.log('Comisiones'),
        },
        {
          id: 'formas-pago',
          title: 'Formas de pago',
          description: 'Crea, edita o elimina los métodos de pago usados en tu negocio.',
          icon: CreditCardIcon,
          onPress: () => console.log('Formas de pago'),
        },
        {
          id: 'recompensas',
          title: 'Recompensas',
          description: 'Configura el programa de recompensas que deseas otorgar a los clientes.',
          icon: GiftIcon,
          onPress: () => console.log('Recompensas'),
        },
      ],
    },
    {
      id: 'categorias',
      title: 'Categorías',
      options: [
        {
          id: 'clientes',
          title: 'Clientes',
          description: 'Crea, edita o borra las categorías de clientes.',
          icon: UsersIcon,
          onPress: () => console.log('Categorías de clientes'),
        },
        {
          id: 'productos',
          title: 'Productos',
          description: 'Crea, edita o borra las categorías de productos.',
          icon: PackageIcon,
          onPress: () => console.log('Categorías de productos'),
        },
        {
          id: 'servicios',
          title: 'Servicios',
          description: 'Crea, edita o borra las categorías de servicios.',
          icon: ServiceIcon,
          onPress: () => console.log('Categorías de servicios'),
        },
        {
          id: 'etiquetas',
          title: 'Etiquetas',
          description: 'Crea, edita o borra las etiquetas que usas en las citas.',
          icon: TagIcon,
          onPress: () => console.log('Etiquetas'),
        },
      ],
    },
  ];

  const renderOption = (option: SettingsOption) => {
    const IconComponent = option.icon;
    
    return (
      <TouchableOpacity
        key={option.id}
        style={styles.optionItem}
        onPress={option.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.optionContent}>
          <View style={styles.optionMain}>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </View>
          <ChevronRightIcon />
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (section: SettingsSection) => (
    <View key={section.id} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionCard}>
        {section.options.map((option, index) => (
          <View key={option.id}>
            {renderOption(option)}
            {index < section.options.length - 1 && <View style={styles.optionSeparator} />}
          </View>
        ))}
      </View>
    </View>
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
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {settingsSections.map(renderSection)}
      </ScrollView>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    marginHorizontal: 20,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionMain: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  optionSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 20,
  },
});

export default SettingsScreen;
