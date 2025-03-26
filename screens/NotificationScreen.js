import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Sample notification data
const notifications = [
  {
    id: 1,
    type: 'new_episode',
    title: 'New Episode Available',
    message: 'Episode 12 of Attack on Titan Final Season is now available!',
    time: '2 hours ago',
    image: 'https://example.com/aot.jpg',
    read: false,
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Watch Reminder',
    message: 'Your favorite anime Demon Slayer is starting in 30 minutes',
    time: '5 hours ago',
    image: 'https://example.com/ds.jpg',
    read: true,
  },
  {
    id: 3,
    type: 'update',
    title: 'Season Update',
    message: 'Jujutsu Kaisen Season 2 is now available to stream',
    time: '1 day ago',
    image: 'https://example.com/jjk.jpg',
    read: true,
  },
];

export default function NotificationScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_episode':
        return 'play-circle';
      case 'reminder':
        return 'time';
      case 'update':
        return 'notifications';
      default:
        return 'notifications';
    }
  };

  const renderNotification = (notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationCard,
        !notification.read && { backgroundColor: theme.surfaceVariant }
      ]}
      onPress={() => {
        // Handle notification press
      }}
    >
      <BlurView
        intensity={35}
        tint={isDarkMode ? "dark" : "light"}
        style={styles.notificationContent}
      >
        <View style={styles.notificationIcon}>
          <Ionicons
            name={getNotificationIcon(notification.type)}
            size={24}
            color={theme.primary}
          />
        </View>
        <View style={styles.notificationInfo}>
          <Text style={[styles.notificationTitle, { color: theme.text }]}>
            {notification.title}
          </Text>
          <Text style={[styles.notificationMessage, { color: theme.textSecondary }]}>
            {notification.message}
          </Text>
          <Text style={[styles.notificationTime, { color: theme.textSecondary }]}>
            {notification.time}
          </Text>
        </View>
        {!notification.read && (
          <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />
        )}
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
        <TouchableOpacity style={styles.clearAll}>
          <Text style={[styles.clearAllText, { color: theme.primary }]}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.notificationsList}>
        {notifications.map(renderNotification)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  clearAll: {
    padding: 8,
  },
  clearAllText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  notificationContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
    marginTop: 4,
  },
}); 