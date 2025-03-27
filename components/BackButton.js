import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function BackButton({ style }) {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={() => navigation.goBack()}
    >
      <BlurView
        intensity={isDarkMode ? 20 : 0}
        tint={isDarkMode ? 'dark' : 'light'}
        experimentalBlurMethod={isDarkMode ? "blur" : undefined}
        style={[
          styles.blur, 
          { 
            backgroundColor: isDarkMode 
              ? theme.headerIcon 
              : theme.surfaceVariant
          }
        ]}
      >
        <Ionicons name="chevron-back" size={22} color={theme.text} />
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    borderRadius: 7,
    overflow: 'hidden',
  },
  blur: {
    padding: 8,
    borderRadius: 7,
  },
}); 