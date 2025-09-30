/**
 * Floating Buttons Hook - HeyData Mobile
 * Hook para manejar los botones flotantes del menú agregar
 * 
 * @format
 */

import { useState, useRef } from 'react';
import { Animated, Easing } from 'react-native';

interface UseFloatingButtonsProps {
  setShowCreateAppointmentScreen: (show: boolean) => void;
  setShowCreateSaleScreen: (show: boolean) => void;
  setShowProductsScreen: (show: boolean) => void;
}

export const useFloatingButtons = ({
  setShowCreateAppointmentScreen,
  setShowCreateSaleScreen,
  setShowProductsScreen,
}: UseFloatingButtonsProps) => {
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);

  // Animaciones para botones flotantes
  const leftButtonAnimation = useRef(new Animated.Value(0)).current;
  const centerButtonAnimation = useRef(new Animated.Value(0)).current;
  const rightButtonAnimation = useRef(new Animated.Value(0)).current;
  const buttonOpacityAnimation = useRef(new Animated.Value(0)).current;

  const floatingAnimations = {
    leftButtonAnimation,
    centerButtonAnimation,
    rightButtonAnimation,
    buttonOpacityAnimation,
  };

  const handleAddPress = () => {
    console.log('🚀 Botón Agregar presionado');
    console.log('📊 Estado actual showFloatingButtons:', showFloatingButtons);
    
    if (showFloatingButtons) {
      console.log('🔽 Ocultando botones flotantes');
      hideFloatingButtons();
    } else {
      console.log('🔼 Mostrando botones flotantes');
      showFloatingButtonsAnimation();
    }
  };

  const showFloatingButtonsAnimation = () => {
    console.log('✨ Iniciando animación de mostrar botones');
    setShowFloatingButtons(true);
    
    // Resetear todas las animaciones a 0 (botones empiezan desde el centro)
    leftButtonAnimation.setValue(0);
    centerButtonAnimation.setValue(0);
    rightButtonAnimation.setValue(0);
    buttonOpacityAnimation.setValue(0);

    console.log('🔄 Iniciando animación paralela...');

    // Animación PARALELA - todos los botones salen AL MISMO TIEMPO
    Animated.parallel([
      Animated.timing(leftButtonAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(centerButtonAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(rightButtonAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(buttonOpacityAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start((finished) => {
      console.log('✅ Animación completada:', finished);
    });
  };

  const hideFloatingButtons = () => {
    console.log('🫥 Iniciando animación de ocultar botones');

    // Animación PARALELA - todos los botones se ocultan AL MISMO TIEMPO
    Animated.parallel([
      Animated.timing(leftButtonAnimation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.in(Easing.quad),
      }),
      Animated.timing(centerButtonAnimation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.in(Easing.quad),
      }),
      Animated.timing(rightButtonAnimation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.in(Easing.quad),
      }),
      Animated.timing(buttonOpacityAnimation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start((finished) => {
      console.log('✅ Animación de ocultar completada:', finished);
      setShowFloatingButtons(false);
    });
  };

  const handleCreateAppointmentPress = () => {
    console.log('📅 Crear nueva cita');
    setShowFloatingButtons(false);
    setShowCreateAppointmentScreen(true);
  };

  const handleCreateSalePress = () => {
    console.log('💰 Crear nueva venta');
    setShowFloatingButtons(false);
    setShowCreateSaleScreen(true);
  };

  const handleProductsPress = () => {
    console.log('📦 Ver productos');
    setShowFloatingButtons(false);
    setShowProductsScreen(true);
  };

  return {
    showFloatingButtons,
    floatingAnimations,
    handleAddPress,
    hideFloatingButtons,
    handleCreateAppointmentPress,
    handleCreateSalePress,
    handleProductsPress,
  };
};