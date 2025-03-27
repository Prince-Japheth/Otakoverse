import React, { useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header({ title, showNotification = true, showBackButton = false, onBackPress }) {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadUserName = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        if (name) {
          setUserName(name);
        } else {
          // Default name if none is set
          setUserName('Timur K.');
        }
      } catch (error) {
        console.error('Error loading user name:', error);
        setUserName('Timur K.');
      }
    };

    loadUserName();
  }, []);

  return (
    <View style={styles.header}>
      <BlurView intensity={0.5}
        experimentalBlurMethod="blur"
        tint={isDarkMode ? 'dark' : 'light'}
        style={[styles.headerBackground, { backgroundColor: theme.headerBackground }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            {showBackButton && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={onBackPress}
              >
                <Ionicons name="chevron-back" size={28} color={theme.text} />
              </TouchableOpacity>
            )}
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/2.jpg' }}
              style={styles.profilePic}
            />
            <View style={styles.greeting}>
              <Text style={[styles.greetingText, { color: theme.greetingText }]}>{title}</Text>
              <Text style={[styles.userName, { color: theme.userName }]}>{userName}</Text>
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
  backButton: {
    marginRight: 8,
    padding: 4,
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