import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SuggestionScreen({ navigation, route }) {
  const { theme, isDarkMode } = useTheme();
  const { animeName } = route.params || {};
  const [form, setForm] = useState({
    title: animeName || '',
    description: '',
    genre: '',
    releaseYear: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Here you would typically send the suggestion to your backend
    setSubmitted(true);
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  if (submitted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <LottieView
          source={require('../assets/animations/success.json')}
          autoPlay
          loop={false}
          style={styles.successAnimation}
        />
        <Text style={[styles.successText, { color: theme.text }]}>
          Thank you for your suggestion!
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <BlurView
        intensity={1}
        experimentalBlurMethod="blur"
        tint={isDarkMode ? "dark" : "light"}
        style={[styles.header, { backgroundColor: theme.headerBackground }]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: theme.glassBackground }]}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Suggest an Anime
        </Text>
      </BlurView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.formContainer}
          contentContainerStyle={styles.formContentContainer}
        >
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            Help us expand our collection! Fill in as much information as you can about the anime you'd like to suggest.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Anime Title</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.surfaceVariant,
                color: theme.text,
                borderColor: theme.border,
              }]}
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
              placeholder="Enter anime title"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, { 
                backgroundColor: theme.surfaceVariant,
                color: theme.text,
                borderColor: theme.border,
              }]}
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              placeholder="Brief description of the anime"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Genre</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.surfaceVariant,
                color: theme.text,
                borderColor: theme.border,
              }]}
              value={form.genre}
              onChangeText={(text) => setForm({ ...form, genre: text })}
              placeholder="e.g., Action, Romance, Comedy"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Release Year</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.surfaceVariant,
                color: theme.text,
                borderColor: theme.border,
              }]}
              value={form.releaseYear}
              onChangeText={(text) => setForm({ ...form, releaseYear: text })}
              placeholder="e.g., 2024"
              placeholderTextColor={theme.textSecondary}
              keyboardType="number-pad"
            />
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <LinearGradient
            colors={theme.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.submitButtonText}>Submit Suggestion</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 45,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
  },
  formContainer: {
    flex: 1,
  },
  formContentContainer: {
    padding: 16,
    paddingTop: 80,
    paddingBottom: 100,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  submitButton: {
    margin: 16,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  successAnimation: {
    width: 200,
    height: 200,
  },
  successText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 24,
  },
}); 