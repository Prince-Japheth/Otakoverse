import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  Animated,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { AnimatedButton } from '../components/AnimatedButton';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function AuthScreen({ navigation }) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Start fade animation immediately
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement actual authentication logic here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Save authentication state
      await AsyncStorage.setItem('isAuthenticated', 'true');
      
      // Navigate to Loading screen
      navigation.navigate('Loading');
    } catch (error) {
      console.error('Authentication error:', error);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      
      {/* Fallback Background */}
      <LinearGradient
        colors={['#000', '#1a1a1a']}
        style={StyleSheet.absoluteFill}
      />

      {/* Video Background */}
      <Video
        ref={videoRef}
        source={require('../assets/videos/fight-scene.mp4')}
        style={styles.backgroundVideo}
        isLooping
        isMuted
        resizeMode={ResizeMode.COVER}
        shouldPlay
      />

      {/* Overlay Gradients */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', '#000']}
        style={[StyleSheet.absoluteFill, { marginTop: height * 0.5 }]}
      />

      <SafeAreaView style={styles.content}>
        <Animated.View 
          style={[
            styles.bottomSection,
            {
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                })
              }]
            }
          ]}
        >
          {/* Welcome Container with Blur */}
          <BlurView intensity={1} tint="dark" experimentalBlurMethod="blur" style={styles.welcomeBlurContainer}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Welcome to Otakushi</Text>
              <Text style={styles.welcomeText}>
                {isLogin ? 'Sign in to continue' : 'Create your account'}
              </Text>
            </View>

            {/* Form Container */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
              )}

              <AnimatedButton
                onPress={handleSubmit}
                style={[styles.button, isLoading && styles.buttonLoading]}
                gradientColors={theme.gradient}
                isBlurred={false}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isLogin ? 'Sign In' : 'Sign Up'}
                  </Text>
                )}
              </AnimatedButton>
              
              <TouchableOpacity 
                style={styles.switchButton}
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={styles.switchButtonText}>
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundVideo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  bottomSection: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
  },
  welcomeBlurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  welcomeContainer: {
    padding: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
  },
  formContainer: {
    padding: 24,
    paddingTop: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    height: 56,
    width: '100%',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonLoading: {
    opacity: 0.8,
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
}); 