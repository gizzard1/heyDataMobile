import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface LoadingAnimationProps {
  size?: number;
  color?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  size = 200, 
  color = '#E63946' 
}) => {
  // Crear referencias para las animaciones de cada círculo
  const circle1Anim = useRef(new Animated.Value(0)).current;
  const circle2Anim = useRef(new Animated.Value(0)).current;
  const circle3Anim = useRef(new Animated.Value(0)).current;

  // Crear referencias para el tamaño de cada círculo
  const circle1Scale = useRef(new Animated.Value(0.6)).current;
  const circle2Scale = useRef(new Animated.Value(0.6)).current;
  const circle3Scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const createAnimation = (
      positionAnim: Animated.Value,
      scaleAnim: Animated.Value,
      delay: number
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            // Mover de izquierda a derecha
            Animated.timing(positionAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            // Animar el tamaño: pequeño -> un poco más grande -> pequeño
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 1.2, // Crecer menos (era 1.5)
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 0.6, // Tamaño mínimo un poco más grande
                duration: 1000,
                useNativeDriver: true,
              }),
            ]),
          ]),
          // Reset para el loop
          Animated.parallel([
            Animated.timing(positionAnim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.6,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    // Iniciar animaciones con diferentes delays
    const anim1 = createAnimation(circle1Anim, circle1Scale, 0);
    const anim2 = createAnimation(circle2Anim, circle2Scale, 400);
    const anim3 = createAnimation(circle3Anim, circle3Scale, 800);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  const AnimatedCircle = ({ 
    positionAnim, 
    scaleAnim, 
    baseSize 
  }: { 
    positionAnim: Animated.Value; 
    scaleAnim: Animated.Value; 
    baseSize: number;
  }) => {
    const translateX = positionAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, size * 0.6], // Movimiento horizontal
    });

    return (
      <Animated.View
        style={[
          styles.circleContainer,
          {
            transform: [
              { translateX },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.circle,
            {
              width: baseSize,
              height: baseSize,
              borderRadius: baseSize / 2,
              backgroundColor: color,
            },
          ]}
        />
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { width: size, height: 100 }]}>
      <View style={{ position: 'relative', width: size, height: 100 }}>
        <AnimatedCircle 
          positionAnim={circle1Anim} 
          scaleAnim={circle1Scale} 
          baseSize={size * 0.1} 
        />
        <AnimatedCircle 
          positionAnim={circle2Anim} 
          scaleAnim={circle2Scale} 
          baseSize={size * 0.18} 
        />
        <AnimatedCircle 
          positionAnim={circle3Anim} 
          scaleAnim={circle3Scale} 
          baseSize={size * 0.14} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    position: 'absolute',
    top: 30, // Posición fija desde arriba
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    shadowColor: '#E63946',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default LoadingAnimation;
