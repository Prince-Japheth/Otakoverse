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
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import BackButton from "../components/BackButton"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const HEADER_HEIGHT = screenHeight * 0.65
const HEADER_MAX_SCALE = 2.5  // Increased from 1.5 to 2.5 for more dramatic zoom

export default function AnimeDetails({ route, navigation }) {
  const { anime } = route.params
  const { theme, isDarkMode } = useTheme()

  // Create animated scroll value
  const scrollY = useRef(new Animated.Value(0)).current
  const [gridStyle, setGridStyle] = useState('list') // 'list' or 'grid'

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

  const renderSeasonsSection = () => (
    <View style={styles.seasonsSection}>
      <View style={styles.seasonsHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Seasons</Text>
        <TouchableOpacity
          onPress={() => setGridStyle(gridStyle === 'list' ? 'grid' : 'list')}
          style={styles.gridToggleButton}
        >
          <Ionicons
            name={gridStyle === 'list' ? 'list' : 'grid'}
            size={23}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>
      <View style={[
        styles.seasonsContainer,
        gridStyle === 'grid' && styles.seasonsGrid
      ]}>
        {[
          {
            number: 1,
            title: "Welcome to the Playground",
            episodes: [
              { number: 1, title: "Welcome to the Playground", duration: "45 min", thumbnail: "https://picsum.photos/seed/ep1/800/450" },
              { number: 2, title: "Some Mysteries Are Better Left Unsolved", duration: "45 min", thumbnail: "https://picsum.photos/seed/ep2/800/450" },
              { number: 3, title: "The Base Violence Necessary for Change", duration: "45 min", thumbnail: "https://picsum.photos/seed/ep3/800/450" },
              { number: 4, title: "Happy Progress Day!", duration: "45 min", thumbnail: "https://picsum.photos/seed/ep4/800/450" },
              { number: 5, title: "Everybody Wants to Be My Enemy", duration: "45 min", thumbnail: "https://picsum.photos/seed/ep5/800/450" },
              { number: 6, title: "When These Walls Come Tumbling Down", duration: "45 min", thumbnail: "https://picsum.photos/seed/ep6/800/450" },
              { number: 7, title: "The Boy Savior", duration: "45 min", thumbnail: "https://picsum.photos/seed/ep7/800/450" },
              { number: 8, title: "Oil and Water", duration: "45 min", thumbnail: "https://picsum.photos/seed/ep8/800/450" },
              { number: 9, title: "The Monster You Created", duration: "45 min", thumbnail: "https://picsum.photos/seed/ep9/800/450" }
            ],
            image: "https://static1.colliderimages.com/wordpress/wp-content/uploads/2021/11/arcane-jinx-vi.jpg",
            year: "2021",
            description: "Sisters Vi and Powder fight alongside their adopted family to survive in the seedy underbelly of Piltover."
          },
          {
            number: 2,
            title: "Progress Days",
            episodes: [
              { number: 1, title: "The Return", duration: "45 min", thumbnail: "https://picsum.photos/seed/s2ep1/800/450" },
              { number: 2, title: "New Beginnings", duration: "45 min", thumbnail: "https://picsum.photos/seed/s2ep2/800/450" },
              { number: 3, title: "Old Wounds", duration: "45 min", thumbnail: "https://picsum.photos/seed/s2ep3/800/450" },
              { number: 4, title: "The Art of War", duration: "45 min", thumbnail: "https://picsum.photos/seed/s2ep4/800/450" },
              { number: 5, title: "The Tides of Change", duration: "45 min", thumbnail: "https://picsum.photos/seed/s2ep5/800/450" },
              { number: 6, title: "The Final Stand", duration: "45 min", thumbnail: "https://picsum.photos/seed/s2ep6/800/450" }
            ],
            image: "https://cdn1.dotesports.com/wp-content/uploads/2023/11/13103942/arcane-season-2-teaser.jpg",
            year: "2024",
            description: "The story continues as tensions rise between Piltover and Zaun, while old wounds threaten to reopen."
          },
        ].map((season, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.seasonCard,
              gridStyle === 'grid' && styles.seasonCardGrid
            ]}
            onPress={() => navigation.navigate('HomeStack', {
              screen: 'SeasonEpisodes',
              params: { season, anime }
            })}
          >
            <BlurView intensity={35} tint={isDarkMode ? "dark" : "light"} style={styles.seasonCardBlur}>
              <Image source={{ uri: season.image }} style={styles.seasonImage} />
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
                style={styles.seasonGradient}
              />
              <View style={styles.seasonInfo}>
                <View style={styles.seasonHeader}>
                  <Text style={styles.seasonNumber}>Season {season.number}</Text>
                  <Text style={styles.seasonYear}>{season.year}</Text>
                </View>
                <Text style={[
                  styles.seasonTitle,
                  gridStyle === 'grid' && styles.seasonTitleGrid
                ]}>{season.title}</Text>
                <Text style={styles.seasonEpisodes}>{season.episodes.length} Episodes</Text>
                <Text style={styles.seasonDescription} numberOfLines={2}>{season.description}</Text>
              </View>
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

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
              <BlurView intensity={70} tint="dark" style={styles.tagBlur}>
                <Text style={styles.tagText}>{anime.rating}</Text>
              </BlurView>
              <BlurView intensity={70} tint="dark" style={styles.tagBlur}>
                <Text style={styles.tagText}>League of Legend</Text>
              </BlurView>
              <BlurView intensity={70} tint="dark" style={styles.tagBlur}>
                <Text style={styles.tagText}>Netflix</Text>
              </BlurView>
            </View>
          </View>
        </View>

        {/* Content needs extra padding to account for header height */}
        <View style={styles.contentContainer}>
          {/* Episode Info */}
          <View style={styles.episodeContainer}>
            <Text style={[styles.episodeDescription, { color: theme.textSecondary }]}>
              {anime.description ||
                "Sisters Vi and Powder fight alongside their adopted family to survive in the seedy underbelly of Piltover."}
            </Text>
          </View>

          {/* Watch Button */}
          <TouchableOpacity style={styles.watchButton}>
            <BlurView intensity={35} tint={isDarkMode ? "dark" : "light"} style={styles.watchButtonBlur}>
              <LinearGradient
                colors={theme.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.watchButtonGradient}
              >
                <Ionicons name="play" size={20} color="#fff" style={styles.playIcon} />
                <Text style={styles.watchButtonText}>Watch</Text>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>

          {/* Seasons Section */}
          {renderSeasonsSection()}
        </View>
      </Animated.ScrollView>

      {/* Back Button */}
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
  },
  episodeContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  episodeDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  watchButton: {
    marginHorizontal: 20,
    height: 50,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 30,
  },
  watchButtonBlur: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 12,
  },
  watchButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.9,
  },
  watchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  playIcon: {
    marginRight: 8,
  },
  seasonsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  seasonsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gridToggleButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  seasonsContainer: {
    gap: 16,
  },
  seasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  seasonCard: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
  },
  seasonCardGrid: {
    width: (screenWidth - 56) / 2, // 56 = 20 (padding) * 2 + 16 (gap)
    height: 280,
  },
  seasonCardBlur: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 16,
  },
  seasonImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  seasonGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  seasonInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  seasonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  seasonNumber: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.9,
  },
  seasonYear: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.7,
  },
  seasonTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  seasonTitleGrid: {
    fontSize: 18,
    marginBottom: 2,
  },
  seasonEpisodes: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  seasonDescription: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
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
})

