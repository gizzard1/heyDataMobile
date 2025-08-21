import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Dimensions, SafeAreaView } from 'react-native';
import SimpleLoadingAnimation from './SimpleLoadingAnimation';

const { width, height } = Dimensions.get('window');

interface LoadingScreenProps {
  onFinish: () => void;
  duration?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onFinish, 
  duration = 3000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [onFinish, duration]);

  // Calcular tamaño responsivo
  const responsiveSize = Math.min(width * 0.5, height * 0.3, 200);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Animación empujada hacia abajo */}
      <View style={styles.animationContainer}>
        <SimpleLoadingAnimation color="#E63946" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start', // Empezar desde arriba en lugar de centrar
    alignItems: 'center',
  },
  animationContainer: {
    marginTop: height * 0.4, // Empujar hacia abajo el 40% de la pantalla desde arriba
  },
});

export default LoadingScreen;
