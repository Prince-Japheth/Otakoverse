import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  Animated
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { AnimatedButton } from '../components/AnimatedButton';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function AuthScreen({ onAuthenticate }) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const videoRef = useRef(null);

  React.useEffect(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
      duration: 1000,
          useNativeDriver: true,
    }).start();
  }, []);

  const handleGoogleSignIn = async () => {
    // TODO: Implement Google Sign In
    console.log('Google Sign In');
    onAuthenticate();
  };

  return (
    <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent={true}
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
          <BlurView intensity={30} tint="dark" experimentalBlurMethod="blur" style={styles.welcomeBlurContainer}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Welcome to Otakushi</Text>
              <Text style={styles.welcomeText}>
              Stream your favorite anime anytime, anywhere. Save shows to your favorites and discover new series to love.
              </Text>
            </View>

            {/* Sign In Button */}
            <View style={styles.buttonContainer}>
              <AnimatedButton
                onPress={handleGoogleSignIn}
                style={styles.button}
                gradientColors={theme.gradient}
                isBlurred={false}
              >
                <Ionicons name="logo-google" size={24} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Continue with Google</Text>
              </AnimatedButton>
              
              <Text style={styles.termsText}>
                By continuing, you agree to our Terms of Service and Privacy Policy
              </Text>
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
  topSection: {
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  bottomSection: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoBlur: {
    padding: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 3,
  },
  logoAccent: {
    width: 40,
    height: 4,
    marginTop: 10,
    borderRadius: 2,
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
  buttonContainer: {
    padding: 24,
    paddingTop: 0,
  },
  button: {
    height: 56,
    width: '100%',
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  termsText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
}); 