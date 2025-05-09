import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const DownloadsScreen = () => {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation();
  const [downloads, setDownloads] = useState([]);
  const [groupedDownloads, setGroupedDownloads] = useState({});

  useEffect(() => {
    loadDownloads();
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please enable notifications to receive download updates');
    }
  };

  const loadDownloads = async () => {
    try {
      const savedDownloads = await AsyncStorage.getItem('downloads');
      if (savedDownloads) {
        const parsedDownloads = JSON.parse(savedDownloads);
        setDownloads(parsedDownloads);
        groupDownloads(parsedDownloads);
      }
    } catch (error) {
      console.error('Error loading downloads:', error);
    }
  };

  const groupDownloads = (downloads) => {
    const grouped = {};
    downloads.forEach(download => {
      if (!grouped[download.animeId]) {
        grouped[download.animeId] = {
          title: download.title,
          downloads: []
        };
      }
      grouped[download.animeId].downloads.push(download);
    });
    setGroupedDownloads(grouped);
  };

  const handleDownloadPress = async (download) => {
    try {
      const updatedDownloads = downloads.map(d => {
        if (d.id === download.id) {
          const newProgress = Math.min(d.progress + 10, 100);
          const newStatus = newProgress >= 100 ? 'completed' : 'downloading';
          
          if (newStatus === 'completed') {
            Notifications.scheduleNotificationAsync({
              content: {
                title: 'Download Complete',
                body: `${download.title} - Episode ${download.episode} has finished downloading`,
              },
              trigger: null,
            });
          }
          
          return {
            ...d,
            progress: newProgress,
            status: newStatus
          };
        }
        return d;
      });
      
      setDownloads(updatedDownloads);
      groupDownloads(updatedDownloads);
      await AsyncStorage.setItem('downloads', JSON.stringify(updatedDownloads));
    } catch (error) {
      console.error('Error updating download:', error);
    }
  };

  const handlePlayPress = (download) => {
    if (download.status === 'completed') {
      navigation.navigate('VideoPlayer', {
        videoUrl: download.videoUrl,
        title: download.title,
        episodeTitle: `Season ${download.season} • Episode ${download.episode}`
      });
    } else {
      Alert.alert(
        'Download Incomplete',
        'Please wait for the download to complete before playing.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderAnimeGroup = ({ item }) => {
    const anime = groupedDownloads[item];
    return (
      <View style={styles.animeGroup}>
        <Text style={[styles.animeTitle, { color: theme.text }]}>
          {anime.title}
        </Text>
        <FlatList
          data={anime.downloads.sort((a, b) => {
            if (a.season !== b.season) return a.season - b.season;
            return a.episode - b.episode;
          })}
          renderItem={renderDownloadItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          horizontal
        />
      </View>
    );
  };

  const renderDownloadItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.downloadItem}
      onPress={() => handlePlayPress(item)}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
      />
      <BlurView intensity={30} tint={isDarkMode ? "dark" : "light"} style={styles.overlay}>
        <View style={styles.itemInfo}>
          <Text style={styles.title}>
            Season {item.season} • Episode {item.episode}
          </Text>
          <Text style={styles.episodeTitle}>{item.episodeTitle}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { 
            width: `${item.progress}%`,
            backgroundColor: item.status === 'completed' ? theme.success : theme.primary 
          }]} />
          <Text style={styles.progressText}>
            {item.status === 'completed' ? 'Completed' : `${item.progress}%`}
          </Text>
        </View>
        {item.status === 'completed' && (
          <TouchableOpacity 
            style={styles.playButton}
            onPress={() => handlePlayPress(item)}
          >
            <Ionicons name="play" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
      </BlurView>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="download-outline" 
        size={80} 
        color={isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'} 
      />
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        No Downloads Yet
      </Text>
      <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>
        Shows and movies you download will appear here
      </Text>
      <TouchableOpacity 
        style={[styles.browseButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('MainTabs', { screen: 'HomeStack', params: { screen: 'HomeScreen' } })}
      >
        <Text style={styles.browseButtonText}>Browse Shows</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Downloads</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('DownloadsSettings')}
          style={styles.settingsButton}
        >
          <Ionicons 
            name="settings-outline" 
            size={24} 
            color={theme.text} 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={Object.keys(groupedDownloads)}
        renderItem={renderAnimeGroup}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  listContainer: {
    flexGrow: 1,
    padding: 16,
  },
  animeGroup: {
    marginBottom: 24,
  },
  animeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  downloadItem: {
    width: 280,
    height: 157,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  itemInfo: {
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  episodeTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  playButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DownloadsScreen; 