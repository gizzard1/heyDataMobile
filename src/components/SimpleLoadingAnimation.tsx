import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface LoadingAnimationProps {
  size?: number;
  color?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  size = 200, 
  color = '#E63946' 
}) => {
  // Crear referencias para el tamaño de cada círculo
  const circle1Scale = useRef(new Animated.Value(0.6)).current;
  const circle2Scale = useRef(new Animated.Value(0.6)).current;
  const circle3Scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const createAnimation = (
      scaleAnim: Animated.Value,
      delay: number
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          // Solo animar el tamaño: pequeño -> grande -> pequeño
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.5, // Crecer más
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.6, // Volver a pequeño
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    // Iniciar animaciones con diferentes delays para efecto de onda
    const anim1 = createAnimation(circle1Scale, 0);
    const anim2 = createAnimation(circle2Scale, 300);
    const anim3 = createAnimation(circle3Scale, 600);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  const Circle = ({ 
    scaleAnim, 
    baseSize,
    position
  }: { 
    scaleAnim: Animated.Value; 
    baseSize: number;
    position: number;
  }) => {
    // Calcular el top para centrar todos los círculos verticalmente
    const centerY = 25; // Centro del área de 50px
    const circleTop = centerY - (baseSize / 2);
    
    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: position, // Posición fija para cada círculo
          top: circleTop, // Centrado vertical basado en el tamaño
          width: baseSize,
          height: baseSize,
          borderRadius: baseSize / 2,
          backgroundColor: color,
          transform: [
            { scale: scaleAnim }, // Solo escala, sin movimiento
          ],
          shadowColor: color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.animationArea}>
        <Circle 
          scaleAnim={circle1Scale} 
          baseSize={20}
          position={0}
        />
        <Circle 
          scaleAnim={circle2Scale} 
          baseSize={35}
          position={60}
        />
        <Circle 
          scaleAnim={circle3Scale} 
          baseSize={28}
          position={120}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50, // Reducir altura para centrar mejor
    width: 160,
  },
  animationArea: {
    width: 160,
    height: 50,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingAnimation;
