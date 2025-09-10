/**
 * Notifications Screen - HeyData Mobile
 * Vista de notificaciones y alertas
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

const BellIcon = ({ color = '#007AFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2"/>
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const CalendarPlusIcon = ({ color = '#007AFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h7" stroke={color} strokeWidth="2"/>
    <Path d="M16 2v4M8 2v4M3 10h18M19 15v6M16 18h6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const UserCheckIcon = ({ color = '#28a745', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="3" stroke={color} strokeWidth="2"/>
    <Path d="M21 21s-1-6-9-6-9 6-9 6" stroke={color} strokeWidth="2"/>
    <Path d="M16 11l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ClockIcon = ({ color = '#ffc107', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

// Interfaces
interface Notification {
  id: string;
  type: 'nueva_reserva' | 'confirmacion' | 'recordatorio' | 'cancelacion';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  clientName?: string;
  serviceName?: string;
  appointmentTime?: string;
  workerName?: string;
}

interface NotificationsScreenProps {
  onGoBack: () => void;
  onNotificationPress?: (notification: Notification) => void;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onGoBack,
  onNotificationPress,
}) => {
  // Datos de ejemplo de notificaciones
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'nueva_reserva',
      title: 'Nueva reserva',
      message: 'Ixchel agendó luces nuevas para hoy a las 10:00 am con Norma.',
      time: 'Hoy',
      isRead: false,
      clientName: 'Ixchel García',
      serviceName: 'Luces',
      appointmentTime: '10:00 am',
      workerName: 'Norma',
    },
    {
      id: '2',
      type: 'confirmacion',
      title: 'Cita confirmada',
      message: 'Adriana confirmó su cita para corte y peinado a las 11:00 am.',
      time: 'Hace 2h',
      isRead: false,
      clientName: 'Adriana Hernández',
      serviceName: 'Corte + Peinado',
      appointmentTime: '11:00 am',
      workerName: 'Brenda',
    },
    {
      id: '3',
      type: 'recordatorio',
      title: 'Recordatorio de cita',
      message: 'Sandra tiene cita en 30 minutos para peinado.',
      time: 'Hace 30min',
      isRead: true,
      clientName: 'Sandra López',
      serviceName: 'Peinado',
      appointmentTime: '14:00',
      workerName: 'Susana',
    },
    {
      id: '4',
      type: 'nueva_reserva',
      title: 'Nueva reserva',
      message: 'María agendó manicure para mañana a las 15:00 con Andrea.',
      time: 'Ayer',
      isRead: true,
      clientName: 'María González',
      serviceName: 'Manicure',
      appointmentTime: '15:00',
      workerName: 'Andrea',
    },
    {
      id: '5',
      type: 'cancelacion',
      title: 'Cita cancelada',
      message: 'Carmen canceló su cita de tinte programada para las 16:00.',
      time: 'Ayer',
      isRead: true,
      clientName: 'Carmen Ruiz',
      serviceName: 'Tinte',
      appointmentTime: '16:00',
      workerName: 'Isabel',
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'nueva_reserva':
        return <CalendarPlusIcon color="#007AFF" size={20} />;
      case 'confirmacion':
        return <UserCheckIcon color="#28a745" size={20} />;
      case 'recordatorio':
        return <ClockIcon color="#ffc107" size={20} />;
      case 'cancelacion':
        return <BellIcon color="#dc3545" size={20} />;
      default:
        return <BellIcon color="#007AFF" size={20} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'nueva_reserva':
        return '#007AFF';
      case 'confirmacion':
        return '#28a745';
      case 'recordatorio':
        return '#ffc107';
      case 'cancelacion':
        return '#dc3545';
      default:
        return '#007AFF';
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Marcar como leída
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );

    if (onNotificationPress) {
      onNotificationPress(notification);
    }

    console.log('📱 Notificación presionada:', notification);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      {/* Indicador de línea lateral para no leídas */}
      {!item.isRead && <View style={styles.unreadIndicator} />}
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        
        <Text style={styles.notificationMessage}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
        <Text style={styles.headerTitle}>Notificaciones</Text>
        {unreadCount > 0 && (
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllText}>Marcar todas</Text>
          </TouchableOpacity>
        )}
        {unreadCount === 0 && <View style={{ width: 80 }} />}
      </View>

      {/* Contador de no leídas */}
      {unreadCount > 0 && (
        <View style={styles.unreadCountContainer}>
          <Text style={styles.unreadCountText}>
            {unreadCount} notificación{unreadCount > 1 ? 'es' : ''} sin leer
          </Text>
        </View>
      )}

      {/* Lista de notificaciones */}
      <View style={styles.notificationsContainer}>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <BellIcon color="#CCC" size={64} />
            <Text style={styles.emptyTitle}>No hay notificaciones</Text>
            <Text style={styles.emptyMessage}>
              Las notificaciones de citas aparecerán aquí
            </Text>
          </View>
        )}
      </View>
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
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  markAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  unreadCountContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  unreadCountText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  notificationsContainer: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
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
    position: 'relative',
    overflow: 'hidden',
  },
  unreadNotification: {
    backgroundColor: '#F8F9FA',
  },
  unreadIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#007AFF',
  },
  notificationContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingLeft: 24, // Espacio para el indicador
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  notificationTime: {
    fontSize: 14,
    color: '#666',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: 'transparent',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationsScreen;
