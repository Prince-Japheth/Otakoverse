import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const StorageSettingsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [downloads, setDownloads] = useState([
    { id: '1', title: 'Attack on Titan', size: '2.4 GB', episodes: 3 },
    { id: '2', title: 'Demon Slayer', size: '1.8 GB', episodes: 2 },
    { id: '3', title: 'Jujutsu Kaisen', size: '3.1 GB', episodes: 4 },
  ]);

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Downloads',
      'Are you sure you want to delete all downloaded content?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setDownloads([]);
          },
        },
      ]
    );
  };

  const handleDeleteItem = (id) => {
    Alert.alert(
      'Delete Download',
      'Are you sure you want to delete this download?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDownloads(downloads.filter(item => item.id !== id));
          },
        },
      ]
    );
  };

  const renderDownloadItem = (item) => (
    <View key={item.id} style={[styles.downloadItem, { borderBottomColor: theme.border }]}>
      <View style={styles.itemInfo}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
          <Ionicons name="film" size={24} color={theme.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
          <Text style={[styles.details, { color: theme.textSecondary }]}>
            {item.size} • {item.episodes} {item.episodes === 1 ? 'episode' : 'episodes'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteItem(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color={theme.error} />
      </TouchableOpacity>
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Storage</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.storageInfo}>
          <View style={[styles.storageBar, { backgroundColor: theme.border }]}>
            <View 
              style={[
                styles.storageUsed, 
                { 
                  backgroundColor: theme.primary,
                  width: '75%' // This would be calculated based on actual storage usage
                }
              ]} 
            />
          </View>
          <Text style={[styles.storageText, { color: theme.textSecondary }]}>
            18.5 GB of 32 GB used
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Downloaded Content
            </Text>
            <TouchableOpacity
              onPress={handleClearAll}
              style={styles.clearAllButton}
            >
              <Text style={[styles.clearAllText, { color: theme.error }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>

          {downloads.length > 0 ? (
            downloads.map(renderDownloadItem)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons 
                name="server-outline" 
                size={48} 
                color={theme.textSecondary} 
              />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No downloads
              </Text>
            </View>
          )}
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
  storageInfo: {
    padding: 16,
  },
  storageBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  storageUsed: {
    height: '100%',
    borderRadius: 4,
  },
  storageText: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  clearAllButton: {
    padding: 8,
  },
  clearAllText: {
    fontSize: 16,
    fontWeight: '500',
  },
  downloadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemInfo: {
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
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default StorageSettingsScreen; 