import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const DownloadsSettingsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [downloadOverWifiOnly, setDownloadOverWifiOnly] = useState(true);
  const [smartDownloads, setSmartDownloads] = useState(true);
  const [notifyWhenComplete, setNotifyWhenComplete] = useState(true);

  const renderSettingItem = ({ icon, title, description, value, onValueChange, type = 'switch' }) => (
    <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
      <View style={styles.settingInfo}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
          <Ionicons name={icon} size={24} color={theme.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
            {description}
          </Text>
        </View>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor="#FFFFFF"
        />
      ) : null}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Download Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Download Options
          </Text>
          {renderSettingItem({
            icon: 'wifi',
            title: 'Download over Wi-Fi only',
            description: 'Only download when connected to Wi-Fi',
            value: downloadOverWifiOnly,
            onValueChange: setDownloadOverWifiOnly,
          })}
          {renderSettingItem({
            icon: 'cloud-download',
            title: 'Smart Downloads',
            description: 'Automatically download next episodes',
            value: smartDownloads,
            onValueChange: setSmartDownloads,
          })}
          {renderSettingItem({
            icon: 'notifications',
            title: 'Notify when complete',
            description: 'Get notified when downloads finish',
            value: notifyWhenComplete,
            onValueChange: setNotifyWhenComplete,
          })}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Storage
          </Text>
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
            onPress={() => navigation.navigate('StorageSettings')}
          >
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                <Ionicons name="server" size={24} color={theme.primary} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  Manage Storage
                </Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Clear downloads and manage storage space
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
});

export default DownloadsSettingsScreen; 