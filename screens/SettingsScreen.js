import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();

  const renderSettingItem = ({ title, description, onPress, type = 'switch', value }) => {
    return (
      <TouchableOpacity 
        style={styles.settingItem} 
        onPress={type === 'button' ? onPress : null}
      >
        <View style={styles.settingContent}>
          <View>
            <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
            {description && <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>{description}</Text>}
          </View>
          {type === 'switch' && (
            <Switch
              value={value}
              onValueChange={onPress}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
        {renderSettingItem({
          title: 'Dark Mode',
          description: 'Toggle dark/light theme', 
          onPress: toggleTheme,
          type: 'switch',
          value: theme === 'dark'
        })}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
        {renderSettingItem({
          title: 'Push Notifications',
          description: 'Receive updates about new episodes',
          onPress: () => {},
          type: 'switch',
          value: true
        })}
        {renderSettingItem({
          title: 'Email Notifications',
          description: 'Receive updates via email',
          onPress: () => {},
          type: 'switch',
          value: false
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        {renderSettingItem({
          title: 'Version',
          description: '1.0.0',
          type: 'button'
        })}
        {renderSettingItem({
          title: 'Terms of Service',
          description: 'Read our terms and conditions',
          onPress: () => {},
          type: 'button'
        })}
        {renderSettingItem({
          title: 'Privacy Policy',
          description: 'Learn about our privacy practices',
          onPress: () => {},
          type: 'button'
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingBottom: 100,
    paddingTop: 50
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
    paddingVertical: 12,
  },
  settingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
}); 