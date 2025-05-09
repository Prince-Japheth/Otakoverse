"use client"

import { useRef, useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
  ScrollView,
  Modal,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import BackButton from "../components/BackButton"
import { animeSeasons, animeTags } from "../data/mockData"
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const HEADER_HEIGHT = screenHeight * 0.65
const HEADER_MAX_SCALE = 2.5  // Increased from 1.5 to 2.5 for more dramatic zoom

export default function AnimeDetails({ route, navigation }) {
  const { anime } = route.params
  const { theme, isDarkMode } = useTheme()

  // Create animated scroll value
  const scrollY = useRef(new Animated.Value(0)).current
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [isSeasonModalVisible, setIsSeasonModalVisible] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [showDownloadSelectionModal, setShowDownloadSelectionModal] = useState(false)
  const [selectedEpisodes, setSelectedEpisodes] = useState([])
  const [selectedQuality, setSelectedQuality] = useState('720p')

  // Calculate header image transforms based on scroll position
  const headerImageScale = scrollY.interpolate({
    inputRange: [-200, 0, 200, 400, 600],
    outputRange: [1.2, 1, 1.5, 2, 2.5],
    extrapolate: 'extend',
  })

  const headerImageTranslateY = scrollY.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [-50, 0, 50],
    extrapolate: 'clamp',
  })

  const headerImageTranslateX = scrollY.interpolate({
    inputRange: [-200, 0],
    outputRange: [-25, 0],
    extrapolate: 'clamp',
  })

  const handleDownloadPress = () => {
    setShowDownloadSelectionModal(true)
  }

  const handleDownload = async () => {
    setShowDownloadSelectionModal(false)
    setIsDownloading(true)
    setShowDownloadModal(true)

    try {
      const currentSeason = animeSeasons.find(season => season.number === selectedSeason)
      if (!currentSeason) {
        throw new Error('Season not found')
      }

      const existingDownloads = await AsyncStorage.getItem('downloads')
      const downloads = existingDownloads ? JSON.parse(existingDownloads) : []

      // Add each selected episode to downloads
      selectedEpisodes.forEach((episodeNumber) => {
        const episode = currentSeason.episodes.find(ep => ep.number === episodeNumber)
        if (!episode) {
          console.warn(`Episode ${episodeNumber} not found in season ${selectedSeason}`)
          return
        }

        const newDownload = {
          id: `${anime.id}-s${selectedSeason}-e${episodeNumber}`,
          animeId: anime.id,
          title: anime.title,
          season: selectedSeason,
          episode: episodeNumber,
          episodeTitle: episode.title,
          thumbnail: episode.thumbnail,
          videoUrl: episode.videoUrl,
          progress: 0,
          status: 'downloading',
          quality: selectedQuality,
          timestamp: Date.now()
        }
        downloads.unshift(newDownload)
      })
      
      await AsyncStorage.setItem('downloads', JSON.stringify(downloads))
      
      // Simulate download progress
      let progress = 0
      const progressInterval = setInterval(() => {
        progress += 2
        setDownloadProgress(progress)
        
        // Update notification with current progress
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Download in Progress',
            body: `Episode 1 is downloading (${progress.toFixed(1)}%)`,
          },
          trigger: null,
        });
        
        if (progress >= 100) {
          clearInterval(progressInterval)
          setIsDownloading(false)
          // Send completion notification
          Notifications.scheduleNotificationAsync({
            content: {
              title: 'Download Complete',
              body: 'Episode 1 has finished downloading',
            },
            trigger: null,
          });
          setTimeout(() => setShowDownloadModal(false), 1000)
        }
      }, 100)
    } catch (error) {
      console.error('Download error:', error)
      setIsDownloading(false)
      setShowDownloadModal(false)
    }
  }

  const handlePlayPress = () => {
    const currentSeason = animeSeasons.find(season => season.number === selectedSeason);
    if (currentSeason && currentSeason.episodes.length > 0) {
      const firstEpisode = currentSeason.episodes[0];
      navigation.navigate('VideoPlayer', {
        videoUrl: firstEpisode.videoUrl,
        title: anime.title,
        episodeTitle: `Season ${selectedSeason} • Episode ${firstEpisode.number}`
      });
    }
  };

  const handleEpisodePress = (episode) => {
    navigation.navigate('VideoPlayer', {
      videoUrl: episode.videoUrl,
      title: anime.title,
      episodeTitle: `Season ${selectedSeason} • Episode ${episode.number}`
    });
  };

  const renderSeasonModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isSeasonModalVisible}
      onRequestClose={() => setIsSeasonModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setIsSeasonModalVisible(false)}
      >
        <BlurView intensity={20} tint={isDarkMode ? "dark" : "light"} style={styles.modalBlur}>
          <View style={[styles.seasonModalContent, { backgroundColor: theme.surface }]}>
            {animeSeasons.map((season) => (
        <TouchableOpacity
                key={season.number}
                style={[
                  styles.seasonOption,
                  selectedSeason === season.number && { backgroundColor: theme.primary + '20' }
                ]}
                onPress={() => {
                  setSelectedSeason(season.number)
                  setIsSeasonModalVisible(false)
                }}
              >
                <Text style={[styles.seasonOptionText, { color: theme.text }]}>
                  Season {season.number}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
      </TouchableOpacity>
    </Modal>
  )

  const renderDownloadModal = () => (
    <Modal
      transparent={true}
      visible={showDownloadModal}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={30} tint={isDarkMode ? "dark" : "light"} style={[styles.downloadModal, {
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'
        }]}>
          <Text style={[styles.downloadTitle, { color: theme.text }]}>Download</Text>
          <Text style={[styles.downloadStatus, { color: theme.textSecondary }]}>
            {isDownloading ? 'Episode 1 is still downloading...' : 'Download Complete!'}
          </Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${downloadProgress}%`, backgroundColor: theme.primary }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {downloadProgress.toFixed(1)}%
          </Text>
          <TouchableOpacity
            style={styles.hideButton}
            onPress={() => {
              setShowDownloadModal(false);
              // Schedule notification for download progress
              Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Download in Progress',
                  body: `Episode 1 is downloading (${downloadProgress.toFixed(1)}%)`,
                },
                trigger: null,
              });
            }}
          >
            <Text style={[styles.hideButtonText, { color: theme.primary }]}>Hide</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </Modal>
  )

  const renderDownloadSelectionModal = () => {
    const currentSeason = animeSeasons.find(season => season.number === selectedSeason)
    
    return (
      <Modal
        transparent={true}
        visible={showDownloadSelectionModal}
        animationType="slide"
        onRequestClose={() => setShowDownloadSelectionModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDownloadSelectionModal(false)}
        >
          <BlurView intensity={30} tint={isDarkMode ? "dark" : "light"} style={[styles.downloadSelectionModal, {
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'
          }]}>
            <View style={styles.downloadSelectionHeader}>
              <Text style={[styles.downloadSelectionTitle, { color: theme.text }]}>Download</Text>
              <TouchableOpacity onPress={() => setShowDownloadSelectionModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Season Selector */}
            <View style={styles.seasonSelectorContainer}>
              <Text style={[styles.sectionLabel, { color: theme.text }]}>Season</Text>
              <View style={styles.seasonOptions}>
                {animeSeasons.map((season) => (
                  <TouchableOpacity
                    key={season.number}
                    style={[
                      styles.seasonOption,
                      selectedSeason === season.number && {
                        backgroundColor: theme.primary + '20',
                        borderColor: theme.primary
                      }
                    ]}
                    onPress={() => setSelectedSeason(season.number)}
                  >
                    <Text
                      style={[
                        styles.seasonText,
                        { color: selectedSeason === season.number ? theme.primary : theme.text }
                      ]}
                    >
                      Season {season.number}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Select All Button */}
            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={() => {
                const allEpisodes = currentSeason.episodes.map(ep => ep.number)
                setSelectedEpisodes(prev => 
                  prev.length === allEpisodes.length ? [] : allEpisodes
                )
              }}
            >
              <Text style={[styles.selectAllText, { color: theme.primary }]}>
                {selectedEpisodes.length === currentSeason.episodes.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>

            <ScrollView style={styles.episodeList}>
              {currentSeason.episodes.map((episode) => (
                <TouchableOpacity
                  key={episode.number}
                  style={[
                    styles.episodeOption,
                    selectedEpisodes.includes(episode.number) && {
                      backgroundColor: theme.primary + '20'
                    }
                  ]}
                  onPress={() => {
                    setSelectedEpisodes(prev => 
                      prev.includes(episode.number)
                        ? prev.filter(num => num !== episode.number)
                        : [...prev, episode.number]
                    )
                  }}
                >
                  <View style={styles.episodeOptionContent}>
                    <Image
                      source={{ uri: `https://picsum.photos/seed/${selectedSeason}${episode.number}/100/56` }}
                      style={styles.episodeThumb}
                    />
                    <View style={styles.episodeDetails}>
                      <Text style={[styles.episodeTitle, { color: theme.text }]}>
                        Episode {episode.number}
                      </Text>
                      <Text style={[styles.episodeSubtitle, { color: theme.textSecondary }]}>
                        {episode.title}
                      </Text>
                    </View>
          <Ionicons
                      name={selectedEpisodes.includes(episode.number) ? "checkmark-circle" : "ellipse-outline"}
                      size={24}
                      color={selectedEpisodes.includes(episode.number) ? theme.primary : theme.textSecondary}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.qualitySelector}>
              <Text style={[styles.sectionLabel, { color: theme.text }]}>Quality</Text>
              <View style={styles.qualityOptions}>
                {['720p', '1080p'].map((quality) => (
                  <TouchableOpacity
                    key={quality}
                    style={[
                      styles.qualityOption,
                      selectedQuality === quality && {
                        backgroundColor: theme.primary + '20',
                        borderColor: theme.primary
                      }
                    ]}
                    onPress={() => setSelectedQuality(quality)}
                  >
                    <Text
                      style={[
                        styles.qualityText,
                        { color: selectedQuality === quality ? theme.primary : theme.text }
                      ]}
                    >
                      {quality}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.downloadConfirmButton,
                { backgroundColor: theme.primary },
                selectedEpisodes.length === 0 && { opacity: 0.5 }
              ]}
              onPress={handleDownload}
              disabled={selectedEpisodes.length === 0}
            >
              <Text style={styles.downloadConfirmText}>
                Download {selectedEpisodes.length} Episode{selectedEpisodes.length !== 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          </BlurView>
        </TouchableOpacity>
      </Modal>
    )
  }

  const renderSeasonsSection = () => {
    const currentSeason = animeSeasons.find(season => season.number === selectedSeason)
    
    return (
      <View style={styles.seasonsSection}>
        <View style={styles.seasonsHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Episodes</Text>
          <TouchableOpacity
            style={styles.seasonSelector}
            onPress={() => setIsSeasonModalVisible(true)}
          >
            <Text style={[styles.seasonSelectorText, { color: theme.text }]}>
              Season {selectedSeason}
            </Text>
            <Ionicons name="chevron-down" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.episodesScrollView}
        >
          {currentSeason.episodes.map((episode, index) => (
            <TouchableOpacity
              key={index}
              style={styles.episodeCard}
              onPress={() => handleEpisodePress(episode)}
            >
              <Image 
                source={{ 
                  uri: `https://picsum.photos/seed/${currentSeason.number}${index}/280/157`
                }} 
                style={styles.episodeThumbnail} 
              />
              <View style={styles.episodeInfo}>
                <Text style={[styles.episodeNumber, { color: theme.text }]}>
                  Episode {episode.number}
                </Text>
                <Text 
                  style={[styles.episodeTitle, { color: theme.textSecondary }]} 
                  numberOfLines={2}
                >
                  {episode.title}
                </Text>
                <Text style={[styles.episodeDuration, { color: theme.textSecondary }]}>
                  {episode.duration}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
    </View>
  )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Background Elements */}
      <View style={styles.backgroundContainer}>
        {/* Golden Gradient Background */}
        <LinearGradient
          colors={
            isDarkMode
              ? ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0)"]
              : ["rgba(248, 246, 242, 0.8)", "rgba(212, 192, 160, 0.1)"]
          }
          style={StyleSheet.absoluteFill}
        />

        {/* Enhanced Golden Circle */}
        <View
          style={[
            styles.goldsquare,
            {
              backgroundColor: theme.goldsquare.background,
              shadowColor: theme.goldsquare.shadow,
              shadowOpacity: theme.goldsquare.shadowOpacity,
              transform: [
                { translateX: -screenWidth * 0.75 },
                { translateY: -screenWidth * 0.75 },
                { rotate: "15deg" },
              ],
            },
          ]}
        />

        {/* Second Golden Circle */}
        <View
          style={[
            styles.goldsquareInner,
            {
              backgroundColor: theme.goldsquareInner.background,
              shadowColor: theme.goldsquareInner.shadow,
              shadowOpacity: theme.goldsquareInner.shadowOpacity,
              transform: [{ translateX: -screenWidth * 0.5 }, { translateY: -screenWidth * 0.5 }, { rotate: "-10deg" }],
            },
          ]}
        />

        {/* Additional Decorative Elements for Light Mode */}
        {!isDarkMode && (
          <>
            <View
              style={[
                styles.decorativeCircle,
                {
                  top: "15%",
                  right: "-10%",
                  backgroundColor: "rgba(212, 192, 160, 0.08)",
                  transform: [{ scale: 1.2 }],
                },
              ]}
            />
            <View
              style={[
                styles.decorativeCircle,
                {
                  bottom: "25%",
                  left: "-5%",
                  backgroundColor: "rgba(151, 106, 61, 0.05)",
                  transform: [{ scale: 0.8 }],
                },
              ]}
            />
          </>
        )}

        <BlurView
          intensity={1}
          tint={isDarkMode ? "dark" : "light"}
          style={[styles.glassBackground, { backgroundColor: theme.glassBackground }]}
        >
          <View style={[styles.glassOverlay, { backgroundColor: theme.glassOverlay }]} />
        </BlurView>
      </View>

      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* Status bar gradient overlay */}
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0)"]}
        style={styles.statusBarGradient}
        pointerEvents="none"
      />

      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        bounces={true}
        contentInset={{ top: 0 }}
        contentOffset={{ y: 0 }}
      >
        {/* Header Image with Parallax Effect */}
        <View style={styles.header}>
          <Animated.View
            style={[
              styles.headerImageContainer,
              {
                transform: [
                  { scale: headerImageScale },
                  { translateY: headerImageTranslateY }
                ],
              },
            ]}
          >
            <Image source={{ uri: anime.imageUrl }} style={styles.headerImage} />
          </Animated.View>

          <LinearGradient
            colors={[
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0)",
              isDarkMode ? "rgba(0,0,0,0.95)" : "rgba(248, 246, 242, 0.95)",
              isDarkMode ? "rgba(0,0,0,1)" : "rgba(248, 246, 242, 1)",
            ]}
            locations={[0, 0.6, 0.85, 1]}
            style={styles.headerGradient}
          />
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: "#fff" }]}>{anime.title}</Text>
            <View style={styles.tagsContainer}>
              {animeTags.map((tag, index) => (
                <BlurView key={index} intensity={70} tint="dark" style={styles.tagBlur}>
                  <Text style={styles.tagText}>{tag}</Text>
              </BlurView>
              ))}
            </View>
          </View>
        </View>

        {/* Content needs extra padding to account for header height */}
        <View style={styles.contentContainer}>
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={handlePlayPress}
            >
              <BlurView intensity={35} tint={isDarkMode ? "dark" : "light"} style={styles.buttonBlur}>
                <LinearGradient
                  colors={theme.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="play" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Play</Text>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={() => setShowDownloadSelectionModal(true)}
              disabled={isDownloading}
            >
              <BlurView intensity={35} tint={isDarkMode ? "dark" : "light"} style={styles.buttonBlur}>
                <LinearGradient
                  colors={[theme.surfaceVariant, theme.surface]}
                  style={styles.buttonGradient}
                >
                  <Ionicons 
                    name={isDownloading ? "hourglass-outline" : "download-outline"} 
                    size={20} 
                    color={theme.text} 
                    style={styles.buttonIcon} 
                  />
                  <Text style={[styles.buttonText, { color: theme.text }]}>
                    {isDownloading ? 'Downloading...' : 'Download'}
                  </Text>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {anime.description}
            </Text>
          </View>

          {/* Episodes Section */}
          {renderSeasonsSection()}
        </View>
      </Animated.ScrollView>

      {renderDownloadSelectionModal()}
      {renderDownloadModal()}
      {renderSeasonModal()}
      <BackButton />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  statusBarGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 100 : 80,
    zIndex: 2,
  },
  header: {
    height: HEADER_HEIGHT,
    position: "relative",
    overflow: "hidden",
  },
  headerImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    zIndex: 1, // Ensure gradient is above the image
  },
  headerTitleContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 2, // Ensure title is above the gradient
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    color: "#fff",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  tagBlur: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  tagText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 6,
    paddingHorizontal: 12,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contentContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  playButton: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    overflow: 'hidden',
  },
  downloadButton: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonBlur: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 8,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  genreContainer: {
    marginBottom: 20,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  episodesScrollView: {
    marginTop: 12,
  },
  episodeCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  episodeThumbnail: {
    width: '100%',
    height: 157,
    borderRadius: 8,
  },
  episodeInfo: {
    padding: 8,
  },
  episodeNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  episodeTitle: {
    fontSize: 13,
    marginBottom: 4,
  },
  episodeDuration: {
    fontSize: 12,
  },
  seasonSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  seasonSelectorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  seasonsSection: {
    marginBottom: 30,
  },
  seasonsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  backgroundContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  goldsquare: {
    position: "absolute",
    width: screenWidth * 1.5,
    height: screenWidth * 1.5,
    borderRadius: screenWidth * 0.75,
    top: "40%",
    left: "50%",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 50,
  },
  goldsquareInner: {
    position: "absolute",
    width: screenWidth,
    height: screenWidth,
    borderRadius: screenWidth * 0.5,
    top: "45%",
    left: "50%",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 40,
  },
  glassBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  glassOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  decorativeCircle: {
    position: "absolute",
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderRadius: screenWidth * 0.4,
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBlur: {
    width: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  seasonModalContent: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
  },
  seasonOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  seasonOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  downloadModal: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  downloadTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  downloadStatus: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    marginBottom: 16,
  },
  hideButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  hideButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  downloadSelectionModal: {
    width: '100%',
    height: '80%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    padding: 20,
  },
  downloadSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  downloadSelectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  episodeList: {
    flex: 1,
  },
  episodeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  episodeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeThumb: {
    width: 100,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  episodeDetails: {
    flex: 1,
    marginRight: 12,
  },
  episodeSubtitle: {
    fontSize: 14,
  },
  qualitySelector: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  qualityOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  qualityOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  qualityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  downloadConfirmButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  seasonSelectorContainer: {
    marginBottom: 16,
  },
  seasonOptions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  seasonOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  seasonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
})

