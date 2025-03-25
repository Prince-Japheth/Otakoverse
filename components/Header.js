import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Header({ title, subtitle, showNotification = true }) {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <BlurView intensity={0.5}
        experimentalBlurMethod="blur"
        tint={isDarkMode ? 'dark' : 'light'}
        style={[styles.headerBackground, { backgroundColor: theme.headerBackground }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gKgSUNDX1BST0ZJTEUAAQEAAAKQbGNtcwQwAABtbnRyUkdCIFhZWiAH3wAHABsADQAYADFhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWxjbXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAADhjcHJ0AAABQAAAAE53dHB0AAABkAAAABRjaGFkAAABpAAAACxyWFlaAAAB0AAAABRiWFlaAAAB5AAAABRnWFlaAAAB+AAAABRyVFJDAAACDAAAACBnVFJDAAACLAAAACBiVFJDAAACTAAAACBjaHJtAAACbAAAACRtbHVjAAAAAAAAAAEAAAAMZW5VUwAAABwAAAAcAHMAUgBHAEIAIABiAHUAaQBsAHQALQBpAG4AAG1sdWMAAAAAAAAAAQAAAAxlblVTAAAAMgAAABwATgBvACAAYwBvAHAAeQByAGkAZwBoAHQALAAgAHUAcwBlACAAZgByAGUAZQBsAHkAAAAAWFlaIAAAAAAAAPbWAAEAAAAA0y1zZjMyAAAAAAABDEoAAAXj///zKgAAB5sAAP2H///7ov///aMAAAPYAADAlFhZWiAAAAAAAABvoAAAOPUAAAOQWFlaIAAAAAAAACSdAAAPgwAAtr9YWVogAAAAAAAAYqUAALeQAAAY3nBhcmEAAAAAAAMAAAACZmYAAPKnAAANWQAAE9AAAApbcGFyYQAAAAAAAwAAAAJmZgAA8qcAAA1ZAAAT0AAACltwYXJhAAAAAAADAAAAAmZmAADypwAADVkAABPQAAAKW2Nocm0AAAAAAAMAAAAAo9cAAFR7AABMzQAAmZoAACZmAAAPXA==' }}
              style={styles.profilePic}
            />
            <View style={styles.greeting}>
              <Text style={[styles.greetingText, { color: theme.greetingText }]}>{title}</Text>
              <Text style={[styles.userName, { color: theme.userName }]}>{subtitle}</Text>
            </View>
          </View>
          
          {showNotification && (
            <TouchableOpacity 
              style={{ overflow: 'hidden', borderRadius: 7 }}
              onPress={() => navigation.navigate('Notification')}
            >
              <BlurView
                intensity={20}
                tint={isDarkMode ? 'dark' : 'light'}
                experimentalBlurMethod={isDarkMode ? "blur" : undefined}
                style={[styles.headerIcon, { backgroundColor: theme.headerIcon }]}
              >
                <Ionicons name="notifications-outline" size={22} color={theme.text} />
              </BlurView>
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBackground: {
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greeting: {
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 249, 224, 0.5)',
  },
}); 