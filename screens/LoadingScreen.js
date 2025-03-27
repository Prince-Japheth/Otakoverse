import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen({ navigation }) {
  const { theme } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in and scale up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Reset navigation stack to MainTabs after 2 seconds
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000"
        translucent={false}
      />

      {/* Solid Background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }]} />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['#000', '#1a1a1a']}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <BlurView
          intensity={30}
          tint="dark"
          experimentalBlurMethod="blur"
          style={styles.iconContainer}
        >
          <LinearGradient
            colors={theme.gradient}
            style={styles.iconBackground}
          >
            <Ionicons name="logo-google" size={40} color="#fff" />
          </LinearGradient>
        </BlurView>

        <Text style={styles.title}>Signing in...</Text>
        <Text style={styles.subtitle}>Please wait while we set up your account</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  iconBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
}); 