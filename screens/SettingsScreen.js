import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Switch } from 'react-native-switch';

export default function SettingsScreen() {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  
  // Mock subscription data - replace with actual data from your backend
  const subscriptionEndDate = new Date();
  subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            // Add your logout logic here
          }
        }
      ]
    );
  };

  const renderSettingItem = ({ title, description, onPress, type = 'switch', value, icon }) => {
    return (
      <TouchableOpacity 
        style={[styles.settingItem, { backgroundColor: theme.cardBackground }]} 
        onPress={type === 'button' ? onPress : null}
      >
        <View style={styles.settingContent}>
          <View style={styles.settingLeft}>
            {icon && <Ionicons name={icon} size={24} color={theme.text} style={styles.settingIcon} />}
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
              {description && <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>{description}</Text>}
            </View>
          </View>
          {type === 'switch' && (
            <Switch
              value={value}
              onValueChange={onPress}
              disabled={false}
              circleSize={24}
              barHeight={26}
              backgroundActive={theme.primary}
              backgroundInactive={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
              circleActiveColor='#fff'
              circleInActiveColor='#fff'
              changeValueImmediately={true}
              innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
              switchWidthMultiplier={2}
              switchBorderRadius={13}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Subscription</Text>
        {renderSettingItem({
          title: 'Premium Status',
          description: `Active until ${formatDate(subscriptionEndDate)}`,
          type: 'button',
          icon: 'star'
        })}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
        {renderSettingItem({
          title: 'Dark Mode',
          description: 'Toggle dark/light theme', 
          onPress: toggleTheme,
          type: 'switch',
          value: theme === 'dark',
          icon: 'moon'
        })}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
        {renderSettingItem({
          title: 'Push Notifications',
          description: 'Receive updates about new episodes',
          onPress: () => setPushNotifications(!pushNotifications),
          type: 'switch',
          value: pushNotifications,
          icon: 'notifications'
        })}
        {renderSettingItem({
          title: 'Email Notifications',
          description: 'Receive updates via email',
          onPress: () => setEmailNotifications(!emailNotifications),
          type: 'switch',
          value: emailNotifications,
          icon: 'mail'
        })}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
        {renderSettingItem({
          title: 'Version',
          description: '1.0.0',
          type: 'button',
          icon: 'information-circle'
        })}
        {renderSettingItem({
          title: 'Terms of Service',
          description: 'Read our terms and conditions',
          onPress: () => {},
          type: 'button',
          icon: 'document-text'
        })}
        {renderSettingItem({
          title: 'Privacy Policy',
          description: 'Learn about our privacy practices',
          onPress: () => {},
          type: 'button',
          icon: 'shield-checkmark'
        })}
      </View>

      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: theme.error }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out" size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  settingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ff4444',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 