import { useRef } from 'react';
import { Animated } from 'react-native';

export const useButtonAnimation = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = (onPressAction) => {
    Animated.sequence([
      // Press down
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        duration: 150,
        useNativeDriver: true,
        tension: 100,
        friction: 5,
      }),
      // Release and slightly overshoot
      Animated.spring(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        tension: 100,
        friction: 7,
      }),
    ]).start();

    // Trigger the action slightly after the press animation starts
    setTimeout(onPressAction, 50);
  };

  return {
    scaleAnim,
    animatePress,
  };
}; 