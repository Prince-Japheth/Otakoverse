"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
} from "react-native"
import { BlurView } from "expo-blur"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import BackButton from "../components/BackButton"
import { useVideoPlayer, VideoView } from "expo-video"
import { SafeAreaView } from "react-native-safe-area-context"

// Sample video URLs for different episodes
const episodeVideos = {
  1: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  2: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  3: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  5: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  6: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  7: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  8: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  9: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  10: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
}

export default function SeasonEpisodes({ route, navigation }) {
  const { season, anime } = route.params
  const { theme, isDarkMode } = useTheme()
  const [currentEpisode, setCurrentEpisode] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [currentSeason, setCurrentSeason] = useState(season)
  const playerRef = useRef(null)

  const player = useVideoPlayer(episodeVideos[currentEpisode], (player) => {
    player.loop = false
    player.preservesFrameOnPause = true
    playerRef.current = player
    setIsPlayerReady(true)
  })

  useEffect(() => {
    // Cleanup function to handle component unmount
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.pause()
        } catch (error) {
          console.log('Error pausing video on unmount:', error)
        }
      }
    }
  }, [])

  const handleEpisodePress = (episodeNumber) => {
    setCurrentEpisode(episodeNumber)
    setIsPlaying(false)
    setIsPlayerReady(false)
    
    // Set the source first
    try {
      player.source = episodeVideos[episodeNumber]
      
      // Add a small delay before playing to ensure source is loaded
      setTimeout(() => {
        if (playerRef.current) {
          try {
            playerRef.current.play()
            setIsPlaying(true)
          } catch (error) {
            console.log('Error playing video:', error)
          }
        }
      }, 300) // Increased delay to ensure source is properly loaded
    } catch (error) {
      console.log('Error setting video source:', error)
    }
  }

  const handleVideoPress = () => {
    setShowControls(!showControls)
  }

  const handleSeasonPress = (selectedSeason) => {
    setCurrentSeason(selectedSeason)
    setCurrentEpisode(1)
    setIsPlaying(false)
    setIsPlayerReady(false)
    
    // Reset player with first episode of the new season
    try {
      player.source = episodeVideos[1] // Default to first episode
    } catch (error) {
      console.log('Error setting video source for new season:', error)
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="black" translucent={false} />

      {/* Video Player */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity style={styles.videoContainer} onPress={handleVideoPress} activeOpacity={1}>
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            showControls={showControls}
          />
          {!isPlaying && (
            <View style={styles.playButtonOverlay}>
              <TouchableOpacity
                onPress={() => {
                  if (playerRef.current) {
                    try {
                      playerRef.current.play()
                      setIsPlaying(true)
                    } catch (error) {
                      console.log('Error playing video from button:', error)
                    }
                  }
                }}
                style={styles.largePlayButton}
              >
                <Ionicons name="play-circle" size={80} color="rgba(255,255,255,0.9)" />
              </TouchableOpacity>
            </View>
          )}
          {showControls && <BackButton style={styles.backButton} />}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollContent} bounces={false}>
        {/* Horizontal Season Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.seasonsScrollView}
          contentContainerStyle={styles.seasonsContainer}
        >
          {anime?.seasons?.map((seasonItem, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.seasonItem, currentSeason.id === seasonItem.id && styles.currentSeasonItem]}
              onPress={() => handleSeasonPress(seasonItem)}
            >
              <Image 
                source={{ uri: seasonItem.image }} 
                style={styles.seasonImage} 
                resizeMode="cover"
              />
              <Text style={[styles.seasonItemTitle, currentSeason.id === seasonItem.id && styles.currentSeasonItemTitle]}>
                {seasonItem.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.seasonInfo}>
          <Text style={[styles.seasonTitle, { color: theme.text }]}>{currentSeason.title}</Text>
          <Text style={[styles.seasonYear, { color: theme.textSecondary }]}>{currentSeason.year}</Text>
          <Text style={[styles.seasonDescription, { color: theme.textSecondary }]}>{currentSeason.description}</Text>
        </View>

        <View style={styles.episodesList}>
          {currentSeason.episodes.map((episode, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.episodeCard, currentEpisode === episode.number && styles.currentEpisodeCard]}
              onPress={() => handleEpisodePress(episode.number)}
            >
              <BlurView intensity={35} tint={isDarkMode ? "dark" : "light"} style={styles.episodeCardBlur}>
                <Image source={{ uri: episode.thumbnail || season.image }} style={styles.episodeThumbnail} />
                <View style={styles.episodeContent}>
                  <View style={styles.episodeNumber}>
                    <Text style={styles.episodeNumberText}>{episode.number}</Text>
                  </View>
                  <View style={styles.episodeInfo}>
                    <Text style={[styles.episodeTitle, { color: theme.text }]}>{episode.title}</Text>
                    <Text style={[styles.episodeDuration, { color: theme.textSecondary }]}>{episode.duration}</Text>
                  </View>
                  {currentEpisode === episode.number && (
                    <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={24} color={theme.primary} />
                  )}
                </View>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  videoContainer: {
    height: 250,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  playButtonOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  largePlayButton: {
    padding: 10,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 20,
    zIndex: 3,
  },
  scrollContent: {
    flex: 1,
    marginTop: 240,
  },
  seasonsScrollView: {
    paddingVertical: 15,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  seasonsContainer: {
    paddingHorizontal: 15,
  },
  seasonItem: {
    marginRight: 15,
    alignItems: "center",
    width: 100,
  },
  currentSeasonItem: {
    borderRadius: 8,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    padding: 5,
  },
  seasonImage: {
    width: 80,
    height: 45,
    borderRadius: 8,
    marginBottom: 5,
  },
  seasonItemTitle: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    color: "#fff",
    opacity: 0.7,
  },
  currentSeasonItemTitle: {
    color: "#FF6B6B",
    opacity: 1,
    fontWeight: "700",
  },
  seasonInfo: {
    padding: 20,
    paddingTop: 20,
  },
  seasonTitle: {
    fontSize: 28,
    fontWeight: "bold",
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
    overflow: "hidden",
  },
  currentEpisodeCard: {
    borderWidth: 2,
    borderColor: "#FF6B6B",
  },
  episodeCardBlur: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
  },
  episodeNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  episodeNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  episodeDuration: {
    fontSize: 14,
    opacity: 0.7,
  },
})

