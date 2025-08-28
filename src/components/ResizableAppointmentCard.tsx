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
  onMove: (newWorkerIndex: number, newTimePosition: number) => void; // Actualizado para incluir posición temporal
  timeSlotHeight: number; // Altura de cada slot de tiempo (generalmente 60px)
  columnWidth: number; // Ancho de cada columna de trabajadora
  totalColumns: number; // Número total de columnas/trabajadoras
  containerHeight: number; // Altura total del contenedor del calendario
  onResizeModeChange?: (isResizing: boolean) => void; // Callback para notificar cambios en modo resize
}

const ResizableAppointmentCard: React.FC<ResizableAppointmentCardProps> = ({
  event,
  cardStyle,
  onPress,
  onResize,
  onMove,
  timeSlotHeight = 60,
  columnWidth,
  totalColumns,
  containerHeight,
  onResizeModeChange,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeMode, setResizeMode] = useState<'top' | 'bottom' | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const animatedHeight = useRef(new Animated.Value(cardStyle.height || 60)).current;
  const animatedTop = useRef(new Animated.Value(cardStyle.top || 0)).current;
  const animatedLeft = useRef(new Animated.Value(cardStyle.left || 0)).current;
  const animatedElevation = useRef(new Animated.Value(5)).current;
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedRotation = useRef(new Animated.Value(0)).current;
  const initialHeight = useRef(cardStyle.height || 60);
  const initialTop = useRef(cardStyle.top || 0);
  const initialLeft = useRef(cardStyle.left || 0);

  // Notificar cambios en el modo resize
  useEffect(() => {
    onResizeModeChange?.(isResizing || isMoving);
  }, [isResizing, isMoving, onResizeModeChange]);

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
    setIsMoving(false);
    setResizeMode(null);
    
    // Resetear todas las animaciones a valores normales
    Animated.parallel([
      Animated.spring(animatedElevation, {
        toValue: 5,
        useNativeDriver: false,
      }),
      Animated.spring(animatedScale, {
        toValue: 1,
        useNativeDriver: false,
      }),
      Animated.spring(animatedRotation, {
        toValue: 0,
        useNativeDriver: false,
      }),
    ]).start();
    
    console.log('📱 Resize mode cancelled externally');
  };

  // Función para calcular la nueva columna basada en la posición horizontal
  const calculateNewColumn = (leftPosition: number): number => {
    const currentColumn = Math.round(leftPosition / columnWidth);
    return Math.max(0, Math.min(currentColumn, totalColumns - 1));
  };

  // Función para calcular la nueva posición temporal basada en la posición Y
  const calculateNewTimePosition = (topPosition: number): number => {
    return Math.max(0, Math.min(topPosition, containerHeight - (cardStyle.height || 60)));
  };

  // Función para convertir posición Y a tiempo
  const positionToTime = (yPosition: number): string => {
    // Asumiendo que cada hora son 4 slots de 15 minutos (60px cada slot)
    const minutesFromStart = (yPosition / timeSlotHeight) * 15;
    const startHour = 8; // Hora de inicio del calendario (8:00 AM)
    const totalMinutes = startHour * 60 + minutesFromStart;
    
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = Math.floor(totalMinutes % 60 / 15) * 15; // Snap a intervalos de 15 min
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Función para snapear a la columna más cercana y posición temporal
  const snapToGrid = (gestureX: number, gestureY: number): { snappedLeft: number, snappedTop: number } => {
    const currentLeft = initialLeft.current + gestureX;
    const currentTop = initialTop.current + gestureY;
    
    const newColumn = calculateNewColumn(currentLeft);
    const snappedLeft = newColumn * columnWidth;
    const snappedTop = calculateNewTimePosition(currentTop);
    
    return { snappedLeft, snappedTop };
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

    console.log('📊 Calculate new times:', { 
      resizeMode, 
      heightChange, 
      topChange, 
      minutesPerPixel,
      currentStartTime: event.startTime,
      currentEndTime: event.endTime 
    });

    if (resizeMode === 'top') {
      // Cambiar hora de inicio - cuando arrastras hacia arriba (topChange negativo), la hora debe ser menor
      const minuteChange = Math.round(topChange * minutesPerPixel / 15) * 15; // Snap a intervalos de 15 min
      newStartMinutes = Math.max(0, currentStartMinutes + minuteChange);
      // Asegurar duración mínima de 15 minutos
      if (newStartMinutes >= currentEndMinutes - 15) {
        newStartMinutes = currentEndMinutes - 15;
      }
      console.log('📊 Top resize:', { minuteChange, newStartMinutes, topChange });
    } else if (resizeMode === 'bottom') {
      // Cambiar hora de fin - cuando arrastras hacia abajo (heightChange positivo), la hora debe ser mayor
      const minuteChange = Math.round(heightChange * minutesPerPixel / 15) * 15; // Snap a intervalos de 15 min
      newEndMinutes = Math.min(24 * 60, currentEndMinutes + minuteChange);
      // Asegurar duración mínima de 15 minutos
      if (newEndMinutes <= currentStartMinutes + 15) {
        newEndMinutes = currentStartMinutes + 15;
      }
      console.log('📊 Bottom resize:', { minuteChange, newEndMinutes, heightChange });
    }

    const result = {
      newStartTime: minutesToTime(newStartMinutes),
      newEndTime: minutesToTime(newEndMinutes),
    };

    console.log('📊 Final times:', result);
    return result;
  };

  // PanResponder para el handle superior
  const topHandlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Reducir el umbral para mayor sensibilidad
      return Math.abs(gestureState.dx) > 1 || Math.abs(gestureState.dy) > 1;
    },
    onPanResponderTerminationRequest: () => false, // No permitir que otros componentes terminen este gesto
    onShouldBlockNativeResponder: () => true, // Bloquear gestos nativos mientras está activo
    onPanResponderGrant: () => {
      setResizeMode('top');
      setIsResizing(true); // Activar inmediatamente el modo resize
      safeVibrate(50); // Feedback háptico
      initialHeight.current = cardStyle.height;
      initialTop.current = cardStyle.top;
      console.log('🔝 Top handle activated - resize mode ON');
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
        // Para el handle superior, el cambio de posición superior es gestureState.dy
        const { newStartTime, newEndTime } = calculateNewTimes(0, gestureState.dy);
        onResize(newStartTime, newEndTime);
        console.log('🔝 Resized from top:', { newStartTime, newEndTime, topChange: gestureState.dy });
      } else {
        // Revertir cambios si está fuera de límites
        Animated.parallel([
          Animated.spring(animatedTop, { toValue: initialTop.current, useNativeDriver: false }),
          Animated.spring(animatedHeight, { toValue: initialHeight.current, useNativeDriver: false }),
        ]).start();
      }
      
      setResizeMode(null);
      setIsResizing(false);
    },
    onPanResponderTerminate: () => {
      console.log('🔝 Top handle terminated - reverting changes');
      setResizeMode(null);
      setIsResizing(false);
      // Revertir a valores originales
      Animated.parallel([
        Animated.spring(animatedTop, { toValue: initialTop.current, useNativeDriver: false }),
        Animated.spring(animatedHeight, { toValue: initialHeight.current, useNativeDriver: false }),
      ]).start();
    },
  });

  // PanResponder para el handle inferior
  const bottomHandlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Reducir el umbral para mayor sensibilidad
      return Math.abs(gestureState.dx) > 1 || Math.abs(gestureState.dy) > 1;
    },
    onPanResponderTerminationRequest: () => false, // No permitir que otros componentes terminen este gesto
    onShouldBlockNativeResponder: () => true, // Bloquear gestos nativos mientras está activo
    onPanResponderGrant: () => {
      setResizeMode('bottom');
      setIsResizing(true); // Activar inmediatamente el modo resize
      safeVibrate(50); // Feedback háptico
      initialHeight.current = cardStyle.height;
      console.log('🔽 Bottom handle activated - resize mode ON');
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
        // Para el handle inferior, el cambio de altura es gestureState.dy
        const { newStartTime, newEndTime } = calculateNewTimes(gestureState.dy, 0);
        onResize(newStartTime, newEndTime);
        console.log('🔽 Resized from bottom:', { newStartTime, newEndTime, heightChange: gestureState.dy });
      } else {
        // Revertir cambios si está fuera de límites
        Animated.spring(animatedHeight, { 
          toValue: initialHeight.current, 
          useNativeDriver: false 
        }).start();
      }
      
      setResizeMode(null);
      setIsResizing(false);
    },
    onPanResponderTerminate: () => {
      console.log('🔽 Bottom handle terminated - reverting changes');
      setResizeMode(null);
      setIsResizing(false);
      // Revertir a valores originales
      Animated.spring(animatedHeight, { 
        toValue: initialHeight.current, 
        useNativeDriver: false 
      }).start();
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
    if (isResizing || isMoving) {
      // Si está en modo resize o moving, cancelarlo
      setIsResizing(false);
      setIsMoving(false);
      setResizeMode(null);
      
      // Resetear animaciones
      Animated.parallel([
        Animated.spring(animatedElevation, {
          toValue: 5,
          useNativeDriver: false,
        }),
        Animated.spring(animatedScale, {
          toValue: 1,
          useNativeDriver: false,
        }),
        Animated.spring(animatedRotation, {
          toValue: 0,
          useNativeDriver: false,
        }),
      ]).start();
      
      console.log('📱 Resize/Move mode cancelled by tap');
    } else {
      // Si no está en modo resize/moving, ejecutar la acción normal
      onPress();
    }
  };

  // PanResponder para mover la tarjeta libremente (horizontal y vertical)
  const cardMovePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => {
      // Responder inmediatamente si no está en modo resize
      return !isResizing;
    },
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Reducir el umbral para mayor sensibilidad
      const totalMovement = Math.abs(gestureState.dx) + Math.abs(gestureState.dy);
      return !isResizing && totalMovement > 3;
    },
    onPanResponderTerminationRequest: () => false, // No permitir que otros componentes terminen este gesto
    onShouldBlockNativeResponder: () => true, // Bloquear gestos nativos mientras está activo
    onPanResponderGrant: () => {
      setIsMoving(true);
      safeVibrate(75);
      initialLeft.current = cardStyle.left;
      initialTop.current = cardStyle.top;
      
      console.log('🔄 Free movement GRANTED - starting lift animation');
      
      // Animar la elevación - efecto de "alzar" la tarjeta
      Animated.parallel([
        Animated.spring(animatedElevation, {
          toValue: 20,
          useNativeDriver: false,
          tension: 100,
          friction: 7,
        }),
        Animated.spring(animatedScale, {
          toValue: 1.08,
          useNativeDriver: false,
          tension: 100,
          friction: 7,
        }),
        Animated.timing(animatedRotation, {
          toValue: Math.random() > 0.5 ? 2 : -2, // Rotación sutil aleatoria
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
      
      console.log('🔄 Free movement activated - lifted up!');
    },
    onPanResponderMove: (_, gestureState) => {
      if (!isMoving) return;
      
      // Movimiento libre en ambas direcciones
      const newLeft = initialLeft.current + gestureState.dx;
      const newTop = initialTop.current + gestureState.dy;
      
      // Limitar el movimiento dentro de los límites del contenedor
      const clampedLeft = Math.max(0, Math.min(newLeft, (totalColumns - 1) * columnWidth));
      const clampedTop = Math.max(0, Math.min(newTop, containerHeight - (cardStyle.height || 60)));
      
      animatedLeft.setValue(clampedLeft);
      animatedTop.setValue(clampedTop);
      
      // Efecto de flotación sutil basado en la velocidad del movimiento
      const totalVelocity = Math.sqrt(gestureState.vx * gestureState.vx + gestureState.vy * gestureState.vy);
      const moveIntensity = Math.min(totalVelocity * 0.001, 0.1);
      const currentRotation = (gestureState.dx / 200) * 5; // Rotación basada en dirección horizontal
      
      animatedRotation.setValue(Math.max(-5, Math.min(5, currentRotation)));
      animatedElevation.setValue(20 + moveIntensity * 10);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (!isMoving) return;
      
      const { snappedLeft, snappedTop } = snapToGrid(gestureState.dx, gestureState.dy);
      const newColumn = calculateNewColumn(snappedLeft);
      const currentColumn = calculateNewColumn(initialLeft.current);
      const newTimePosition = snappedTop;
      
      // Animar a la posición final y bajar la tarjeta
      Animated.parallel([
        Animated.spring(animatedLeft, {
          toValue: snappedLeft,
          useNativeDriver: false,
          tension: 80,
          friction: 6,
        }),
        Animated.spring(animatedTop, {
          toValue: snappedTop,
          useNativeDriver: false,
          tension: 80,
          friction: 6,
        }),
        Animated.sequence([
          // Primero un pequeño "rebote" hacia arriba
          Animated.timing(animatedElevation, {
            toValue: 25,
            duration: 100,
            useNativeDriver: false,
          }),
          // Luego bajar suavemente
          Animated.spring(animatedElevation, {
            toValue: 5,
            useNativeDriver: false,
            tension: 80,
            friction: 6,
          }),
        ]),
        Animated.spring(animatedScale, {
          toValue: 1,
          useNativeDriver: false,
          tension: 80,
          friction: 6,
        }),
        Animated.spring(animatedRotation, {
          toValue: 0,
          useNativeDriver: false,
          tension: 80,
          friction: 6,
        }),
      ]).start();
      
      // Si cambió de posición, notificar al padre
      if (newColumn !== currentColumn || Math.abs(newTimePosition - initialTop.current) > 10) {
        onMove(newColumn, newTimePosition);
        console.log('🔄 Moved to column:', newColumn, 'time position:', newTimePosition);
      }
      
      setIsMoving(false);
    },
    onPanResponderTerminate: () => {
      console.log('🔄 Movement terminated - reverting to original position');
      setIsMoving(false);
      // Revertir a posición original y bajar la tarjeta
      Animated.parallel([
        Animated.spring(animatedLeft, {
          toValue: initialLeft.current,
          useNativeDriver: false,
          tension: 120,
          friction: 8,
        }),
        Animated.spring(animatedTop, {
          toValue: initialTop.current,
          useNativeDriver: false,
          tension: 120,
          friction: 8,
        }),
        Animated.spring(animatedElevation, {
          toValue: 5,
          useNativeDriver: false,
          tension: 120,
          friction: 8,
        }),
        Animated.spring(animatedScale, {
          toValue: 1,
          useNativeDriver: false,
          tension: 120,
          friction: 8,
        }),
        Animated.spring(animatedRotation, {
          toValue: 0,
          useNativeDriver: false,
          tension: 120,
          friction: 8,
        }),
      ]).start();
    },
  });

  return (
    <Animated.View
      style={[
        styles.appointmentCard,
        cardStyle,
        {
          height: animatedHeight,
          top: animatedTop,
          left: animatedLeft,
          elevation: animatedElevation,
          shadowOpacity: isMoving ? 0.4 : 0.15,
          shadowRadius: isMoving ? 15 : 3.84,
          shadowOffset: {
            width: 0,
            height: isMoving ? 8 : 2,
          },
          transform: [
            { scale: animatedScale },
            { 
              rotate: animatedRotation.interpolate({
                inputRange: [-10, 10],
                outputRange: ['-10deg', '10deg'],
              }) 
            },
          ],
        },
        (isResizing || isMoving) && styles.resizingCard,
        isMoving && styles.movingCard,
      ]}
      {...cardMovePanResponder.panHandlers}
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

      {/* Indicador visual de modo resize/move */}
      {(isResizing || isMoving) && (
        <View style={styles.resizeIndicator}>
          <Text style={styles.resizeText}>
            {resizeMode === 'top' ? '↑ Hora inicio' : 
             resizeMode === 'bottom' ? '↓ Hora fin' :
             isMoving ? '← → Cambiar trabajadora' :
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
  movingCard: {
    borderWidth: 3,
    borderColor: '#28a745',
    borderLeftWidth: 6,
    backgroundColor: '#ffffff',
    // Removemos transform aquí porque ahora se maneja con Animated
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
    left: -5, // Expandir área de toque hacia los lados
    right: -5,
    height: 30, // Hacer el área de toque más grande
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    paddingVertical: 5, // Agregar padding para mayor área de toque
  },
  topHandle: {
    top: -15, // Mover más arriba para mayor área
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bottomHandle: {
    bottom: -15, // Mover más abajo para mayor área
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  handleDot: {
    width: 10, // Hacer los puntos más grandes
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
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
