import React from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';

const { width: screenWidth } = Dimensions.get('window');

export default function SeasonEpisodes({ route, navigation }) {
  const { season, anime } = route.params;
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* Header Image */}
      <View style={styles.header}>
        <Image source={{ uri: season.image }} style={styles.headerImage} />
        <LinearGradient
          colors={[
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0.7)",
            "rgba(0,0,0,0.9)",
            "rgba(0,0,0,1)",
          ]}
          style={styles.headerGradient}
        />
      </View>

      {/* Back Button */}
      <BackButton />

      {/* Season Info */}
      <View style={styles.seasonInfo}>
        <Text style={[styles.seasonTitle, { color: theme.text }]}>{season.title}</Text>
        <Text style={[styles.seasonYear, { color: theme.textSecondary }]}>{season.year}</Text>
        <Text style={[styles.seasonDescription, { color: theme.textSecondary }]}>
          {season.description}
        </Text>
      </View>

      {/* Episodes List */}
      <ScrollView style={styles.episodesList}>
        {season.episodes.map((episode, index) => (
          <TouchableOpacity
            key={index}
            style={styles.episodeCard}
            onPress={() => navigation.navigate('EpisodeDetails', { episode, season, anime })}
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
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
              </View>
            </BlurView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  seasonInfo: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 80 : 50,
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
}); 