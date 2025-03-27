import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

// Sample video URLs for different episodes
const episodeVideos = {
  1: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  2: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  3: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  4: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  5: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  6: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  7: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  8: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  9: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  10: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
};

export default function SeasonEpisodes({ route, navigation }) {
  const { season, anime } = route.params;
  const { theme, isDarkMode } = useTheme();
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const player = useVideoPlayer(episodeVideos[currentEpisode], (player) => {
    player.loop = false;
    setIsLoading(false);
  });

  const { isPlaying: playerIsPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  useEffect(() => {
    setIsPlaying(playerIsPlaying);
  }, [playerIsPlaying]);

  const handleEpisodePress = (episodeNumber) => {
    setCurrentEpisode(episodeNumber);
    setIsLoading(true);
    player.source = episodeVideos[episodeNumber];
    player.play();
  };

  const handleVideoPress = () => {
    setShowControls(!showControls);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="black" translucent={false} />

      {/* Fixed Video Player Container */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity 
          style={styles.videoContainer}
          onPress={handleVideoPress}
          activeOpacity={1}
        >
          <VideoView 
            style={styles.video} 
            player={player} 
            allowsFullscreen 
            allowsPictureInPicture 
            showControls={showControls}
          />
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          )}
          {showControls && (
            <BackButton style={styles.backButton} />
          )}
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent} bounces={false}>
        {/* Season Info */}
        <View style={styles.seasonInfo}>
          <Text style={[styles.seasonTitle, { color: theme.text }]}>{season.title}</Text>
          <Text style={[styles.seasonYear, { color: theme.textSecondary }]}>{season.year}</Text>
          <Text style={[styles.seasonDescription, { color: theme.textSecondary }]}>
            {season.description}
          </Text>
        </View>

        {/* Episodes List */}
        <View style={styles.episodesList}>
          {season.episodes.map((episode, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.episodeCard,
                currentEpisode === episode.number && styles.currentEpisodeCard
              ]}
              onPress={() => handleEpisodePress(episode.number)}
            >
              <BlurView intensity={35} tint={isDarkMode ? "dark" : "light"} style={styles.episodeCardBlur}>
                <Image 
                  source={{ uri: episode.thumbnail || season.image }} 
                  style={styles.episodeThumbnail}
                />
                <View style={styles.episodeContent}>
                  <View style={styles.episodeNumber}>
                    <Text style={styles.episodeNumberText}>{episode.number}</Text>
                  </View>
                  <View style={styles.episodeInfo}>
                    <Text style={[styles.episodeTitle, { color: theme.text }]}>{episode.title}</Text>
                    <Text style={[styles.episodeDuration, { color: theme.textSecondary }]}>{episode.duration}</Text>
                  </View>
                  {currentEpisode === episode.number && (
                    <Ionicons 
                      name={isPlaying ? "pause-circle" : "play-circle"} 
                      size={24} 
                      color={theme.primary} 
                    />
                  )}
                </View>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  videoContainer: {
    height: 250,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 3,
  },
  scrollContent: {
    flex: 1,
    marginTop: 240, // Height of video container
  },
  seasonInfo: {
    padding: 20,
    paddingTop: 20,
  },
  seasonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  seasonYear: {
    fontSize: 16,
    marginBottom: 12,
  },
  seasonDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  episodesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  episodeCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  currentEpisodeCard: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  episodeCardBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  episodeThumbnail: {
    width: 120,
    height: 68,
    borderRadius: 8,
    marginRight: 12,
  },
  episodeContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  episodeNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  episodeDuration: {
    fontSize: 14,
    opacity: 0.7,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
}); 