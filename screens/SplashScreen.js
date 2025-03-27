import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const { theme, isDarkMode } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const circleScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // First fade in and scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Scale up the circle
      Animated.spring(circleScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Trigger onFinish after animations
    setTimeout(onFinish, 2500);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Background Elements */}
      <View style={styles.backgroundContainer}>
        <Animated.View
          style={[
            styles.circle,
            {
              backgroundColor: theme.goldsquare.background,
              transform: [{ scale: circleScale }],
            },
          ]}
        />
        <BlurView
          intensity={1}
          tint={isDarkMode ? "dark" : "light"}
          experimentalBlurMethod="blur"
          style={[styles.glassBackground, { backgroundColor: theme.glassBackground }]}
        >
          <View style={[styles.glassOverlay, { backgroundColor: theme.glassOverlay }]} />
        </BlurView>
      </View>

      {/* Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={theme.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoGradient}
        >
          <BlurView
            intensity={20}
            tint={isDarkMode ? "dark" : "light"}
            style={styles.logoBlur}
          >
            <Text style={[styles.logoText, { color: 'white' }]}>オ</Text>
          </BlurView>
        </LinearGradient>
      </Animated.View>

      {/* App Name */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={[styles.appName, { color: theme.text }]}>Otakushi</Text>
        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
          Your Anime Journey Begins
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    top: '40%',
    left: '50%',
    transform: [
      { translateX: -width * 0.75 },
      { translateY: -width * 0.75 },
    ],
  },
  glassBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  glassOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoBlur: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoText: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
});