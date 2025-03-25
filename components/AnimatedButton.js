import React from 'react';
import { StyleSheet, TouchableOpacity, Animated, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useButtonAnimation } from '../hooks/useButtonAnimation';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedButton = ({
  onPress,
  style,
  children,
  gradientColors,
  isBlurred = false,
  blurIntensity = 20,
  disabled = false,
  activeOpacity = 1,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
}) => {
  const { scaleAnim, animatePress } = useButtonAnimation();

  const buttonContent = (
    <LinearGradient
      colors={gradientColors}
      style={styles.buttonGradient}
      start={start}
      end={end}
    >
      {children}
    </LinearGradient>
  );

  const animatedButton = (
    <AnimatedTouchable
      onPress={() => animatePress(onPress)}
      style={[
        styles.button,
        style,
        {
          transform: [{ scale: scaleAnim }]
        }
      ]}
      activeOpacity={activeOpacity}
      disabled={disabled}
    >
      {buttonContent}
    </AnimatedTouchable>
  );

  if (isBlurred) {
    return (
      <BlurView
        intensity={blurIntensity}
        tint="dark"
        experimentalBlurMethod="blur"
        style={[styles.blurContainer, style]}
      >
        {animatedButton}
      </BlurView>
    );
  }

  return animatedButton;
};

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
    borderRadius: 30,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  blurContainer: {
    overflow: 'hidden',
    borderRadius: 30,
  },
}); 