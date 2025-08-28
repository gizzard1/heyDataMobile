/**
 * ResizableAppointmentCard - HeyData Mobile
 * Componente de tarjeta de cita redimensionable con puntos de control
 * 
 * @format
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Animated,
  StyleSheet,
  Dimensions,
  Vibration,
  Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

interface CalendarEvent {
  id: string;
  clienteId: string;
  cliente: { id: string; nombre: string; telefono?: string };
  startTime: string;
  endTime: string;
  date: string;
  detalles: Array<{
    id: string;
    servicioId: string;
    servicio: { id: string; nombre: string; precio: number; duracionMinutos: number };
    empleadoId: string;
    empleado: { id: string; name: string; color: string };
    inicioServicio: string;
    duracionMinutos: number;
    precio: number;
  }>;
  estado: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';
  total: number;
  title?: string;
  color?: string;
  worker?: string;
}

interface ResizableAppointmentCardProps {
  event: CalendarEvent;
  cardStyle: any;
  onPress: () => void;
  onResize: (newStartTime: string, newEndTime: string) => void;
  timeSlotHeight: number; // Altura de cada slot de tiempo (generalmente 60px)
  onResizeModeChange?: (isResizing: boolean) => void; // Callback para notificar cambios en modo resize
}

const ResizableAppointmentCard: React.FC<ResizableAppointmentCardProps> = ({
  event,
  cardStyle,
  onPress,
  onResize,
  timeSlotHeight = 60,
  onResizeModeChange,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeMode, setResizeMode] = useState<'top' | 'bottom' | null>(null);
  const animatedHeight = useRef(new Animated.Value(cardStyle.height || 60)).current;
  const animatedTop = useRef(new Animated.Value(cardStyle.top || 0)).current;
  const initialHeight = useRef(cardStyle.height || 60);
  const initialTop = useRef(cardStyle.top || 0);

  // Notificar cambios en el modo resize
  useEffect(() => {
    onResizeModeChange?.(isResizing);
  }, [isResizing, onResizeModeChange]);

  // Función para vibrar de forma segura
  const safeVibrate = (duration: number) => {
    try {
      if (Platform.OS === 'android') {
        Vibration.vibrate(duration);
      }
    } catch (error) {
      console.warn('⚠️ Vibration not available:', error);
      // La vibración no está disponible, pero la app continúa funcionando
      // Como alternativa, podrías agregar algún feedback visual aquí
    }
  };

  // Función para cancelar el modo resize (puede ser llamada desde el padre)
  const cancelResizeMode = () => {
    setIsResizing(false);
    setResizeMode(null);
    console.log('📱 Resize mode cancelled externally');
  };

  // Convertir tiempo a minutos para cálculos
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Convertir minutos a tiempo
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Calcular nueva duración basada en el cambio de altura
  const calculateNewTimes = (heightChange: number, topChange: number) => {
    const minutesPerPixel = 15 / (timeSlotHeight / 4); // 15 minutos por cada cuarto de slot
    const currentStartMinutes = timeToMinutes(event.startTime);
    const currentEndMinutes = timeToMinutes(event.endTime);

    let newStartMinutes = currentStartMinutes;
    let newEndMinutes = currentEndMinutes;

    if (resizeMode === 'top') {
      // Cambiar hora de inicio
      const minuteChange = Math.round(-topChange * minutesPerPixel / 15) * 15; // Snap a intervalos de 15 min
      newStartMinutes = Math.max(0, currentStartMinutes + minuteChange);
      // Asegurar duración mínima de 15 minutos
      if (newStartMinutes >= currentEndMinutes - 15) {
        newStartMinutes = currentEndMinutes - 15;
      }
    } else if (resizeMode === 'bottom') {
      // Cambiar hora de fin
      const minuteChange = Math.round(heightChange * minutesPerPixel / 15) * 15; // Snap a intervalos de 15 min
      newEndMinutes = Math.min(24 * 60, currentEndMinutes + minuteChange);
      // Asegurar duración mínima de 15 minutos
      if (newEndMinutes <= currentStartMinutes + 15) {
        newEndMinutes = currentStartMinutes + 15;
      }
    }

    return {
      newStartTime: minutesToTime(newStartMinutes),
      newEndTime: minutesToTime(newEndMinutes),
    };
  };

  // PanResponder para el handle superior
  const topHandlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Solo responder si hay movimiento significativo
      return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
    },
    onPanResponderGrant: () => {
      setResizeMode('top');
      safeVibrate(50); // Feedback háptico
      initialHeight.current = cardStyle.height;
      initialTop.current = cardStyle.top;
      console.log('🔝 Top handle activated');
    },
    onPanResponderMove: (_, gestureState) => {
      if (resizeMode !== 'top') return;
      
      const newTop = initialTop.current + gestureState.dy;
      const newHeight = initialHeight.current - gestureState.dy;
      
      // Limitar el redimensionamiento
      if (newHeight >= timeSlotHeight / 4 && newTop >= 0) {
        animatedTop.setValue(newTop);
        animatedHeight.setValue(newHeight);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (resizeMode !== 'top') return;
      
      const newTop = initialTop.current + gestureState.dy;
      const newHeight = initialHeight.current - gestureState.dy;
      
      if (newHeight >= timeSlotHeight / 4 && newTop >= 0) {
        const { newStartTime, newEndTime } = calculateNewTimes(0, gestureState.dy);
        onResize(newStartTime, newEndTime);
        console.log('🔝 Resized from top:', { newStartTime, newEndTime });
      } else {
        // Revertir cambios si está fuera de límites
        Animated.parallel([
          Animated.spring(animatedTop, { toValue: initialTop.current, useNativeDriver: false }),
          Animated.spring(animatedHeight, { toValue: initialHeight.current, useNativeDriver: false }),
        ]).start();
      }
      
      setResizeMode(null);
    },
    onPanResponderTerminate: () => {
      setResizeMode(null);
    },
  });

  // PanResponder para el handle inferior
  const bottomHandlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Solo responder si hay movimiento significativo
      return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
    },
    onPanResponderGrant: () => {
      setResizeMode('bottom');
      safeVibrate(50); // Feedback háptico
      initialHeight.current = cardStyle.height;
      console.log('🔽 Bottom handle activated');
    },
    onPanResponderMove: (_, gestureState) => {
      if (resizeMode !== 'bottom') return;
      
      const newHeight = initialHeight.current + gestureState.dy;
      
      // Limitar el redimensionamiento
      if (newHeight >= timeSlotHeight / 4) {
        animatedHeight.setValue(newHeight);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (resizeMode !== 'bottom') return;
      
      const newHeight = initialHeight.current + gestureState.dy;
      
      if (newHeight >= timeSlotHeight / 4) {
        const { newStartTime, newEndTime } = calculateNewTimes(gestureState.dy, 0);
        onResize(newStartTime, newEndTime);
        console.log('🔽 Resized from bottom:', { newStartTime, newEndTime });
      } else {
        // Revertir cambios si está fuera de límites
        Animated.spring(animatedHeight, { 
          toValue: initialHeight.current, 
          useNativeDriver: false 
        }).start();
      }
      
      setResizeMode(null);
    },
    onPanResponderTerminate: () => {
      setResizeMode(null);
    },
  });

  // PanResponder para presión larga en la tarjeta principal
  const longPressPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: () => false,
    onPanResponderGrant: () => {
      // No hacer nada aquí, usaremos onLongPress
    },
  });

  const handleLongPress = () => {
    if (!isResizing) {
      setIsResizing(true);
      safeVibrate(100);
      console.log('📱 Long press activated - resize mode ON');
      // Auto-ocultar después de 5 segundos si no se usa
      setTimeout(() => {
        if (!resizeMode) {
          setIsResizing(false);
          console.log('📱 Auto-hide resize mode');
        }
      }, 5000);
    }
  };

  const handleCardPress = () => {
    if (isResizing) {
      // Si está en modo resize, cancelarlo
      setIsResizing(false);
      setResizeMode(null);
      console.log('📱 Resize mode cancelled by tap');
    } else {
      // Si no está en modo resize, ejecutar la acción normal
      onPress();
    }
  };

  return (
    <Animated.View
      style={[
        styles.appointmentCard,
        cardStyle,
        {
          height: animatedHeight,
          top: animatedTop,
        },
        isResizing && styles.resizingCard,
      ]}
    >
      {/* Handle superior - solo visible en modo resize */}
      {isResizing && (
        <View
          {...topHandlePanResponder.panHandlers}
          style={[styles.resizeHandle, styles.topHandle]}
        >
          <View style={styles.handleDot} />
          <View style={styles.handleLine} />
        </View>
      )}

      {/* Contenido de la tarjeta */}
      <TouchableOpacity
        style={styles.cardContent}
        onPress={handleCardPress}
        onLongPress={handleLongPress}
        delayLongPress={500}
        activeOpacity={0.7}
      >
        <Text style={styles.appointmentTime}>
          {event.startTime} - {event.endTime}
        </Text>
        <Text style={styles.appointmentTitle}>
          {event.cliente.nombre}
        </Text>
        <View style={styles.servicesList}>
          {event.detalles.slice(0, 2).map((detalle, index) => (
            <Text key={index} style={styles.serviceItem}>
              • {detalle.servicio.nombre}
            </Text>
          ))}
          {event.detalles.length > 2 && (
            <Text style={styles.moreServices}>
              +{event.detalles.length - 2} más
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Handle inferior - solo visible en modo resize */}
      {isResizing && (
        <View
          {...bottomHandlePanResponder.panHandlers}
          style={[styles.resizeHandle, styles.bottomHandle]}
        >
          <View style={styles.handleLine} />
          <View style={styles.handleDot} />
        </View>
      )}

      {/* Indicador visual de modo resize */}
      {isResizing && (
        <View style={styles.resizeIndicator}>
          <Text style={styles.resizeText}>
            {resizeMode === 'top' ? '↑ Hora inicio' : 
             resizeMode === 'bottom' ? '↓ Hora fin' : 
             'Mantén presionado los puntos'}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  appointmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 6,
    marginHorizontal: 6,
    padding: 8,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    zIndex: 100,
    minHeight: 60,
  },
  resizingCard: {
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderLeftWidth: 4,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  appointmentTime: {
    fontSize: 11,
    color: '#7f8c8d',
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  appointmentTitle: {
    fontSize: 13,
    color: '#2c3e50',
    fontWeight: '600',
    lineHeight: 15,
    textAlign: 'center',
    marginBottom: 4,
  },
  servicesList: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceItem: {
    fontSize: 10,
    color: '#7f8c8d',
    lineHeight: 12,
    textAlign: 'center',
  },
  moreServices: {
    fontSize: 9,
    color: '#95a5a6',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 2,
  },
  resizeHandle: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  topHandle: {
    top: -10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  bottomHandle: {
    bottom: -10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  handleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginVertical: 2,
  },
  handleLine: {
    width: 30,
    height: 2,
    backgroundColor: '#007AFF',
    borderRadius: 1,
  },
  resizeIndicator: {
    position: 'absolute',
    top: -25,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    zIndex: 300,
  },
  resizeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ResizableAppointmentCard;
