import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Carousel from 'react-native-snap-carousel';
import Header from '../components/Header';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(1);
  const [cornerAnimation] = useState(new Animated.Value(0));

  const featuredContent = [
    {
      id: 1,
      title: 'Dandadan',
      image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/06/dandadan-2024.jpg?q=49&fit=crop&w=480&dpr=2'
    },
    {
      id: 2,
      title: 'Vinland Saga',
      image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/04/vinland-saga-poster-4.jpg?q=49&fit=crop&w=480&dpr=2'
    },
    {
      id: 3,
      title: 'Death Note ',
      image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/06/death-note-2006.jpg?q=49&fit=crop&w=480&dpr=2'
    },
  ];

  const renderFeaturedItem = ({ item, index }) => {
    index = index - 3;
    const isActive = index === activeSlide;

    return (
      <View style={styles.featuredItemContainer}>
        <View style={[styles.activeCorner]} />
        <Pressable
          style={[
            styles.featuredCardContainer,
            { backgroundColor: theme.featuredCardBackground }
          ]}
          onPress={() => navigation.navigate('AnimeDetails', {
            anime: {
              title: item.title,
              imageUrl: item.image,
              rating: "16+",
              episodes: "12",
              status: "New • Season 1",
              description: "A groundbreaking anime series that pushes the boundaries of storytelling and animation.",
            }
          })}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.featuredCardImage}
          />
          <TouchableOpacity 
            style={[
              styles.squarePlayButton, styles.largePlayButton
            ]}
            onPress={() => navigation.navigate('AnimeDetails', {
              anime: {
                title: item.title,
                imageUrl: item.image,
                rating: "16+",
                episodes: "12",
                status: "New • Season 1",
                description: "A groundbreaking anime series that pushes the boundaries of storytelling and animation.",
              }
            })}
          >
            <LinearGradient
              colors={theme.gradient}
              locations={[0.3, 0.6, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.playButtonGradient, styles.largePlayButtonGradient
              ]}
            >
              <Ionicons name="play-outline" size={28} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Pressable>
        <Animated.View
          style={[
            styles.episodeInfoContainer,
            {
              opacity: cornerAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1]
              }),
              transform: [
                {
                  translateY: cornerAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -2]
                  })
                }
              ]
            }
          ]}
        >
          <Text style={[styles.episodeTitle, { color: theme.episodeTitle }]}>{item.title}</Text>
        </Animated.View>
      </View>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      if (carouselRef.current) {
        carouselRef.current.snapToItem(0);
        setActiveSlide(0);
      }
    }, 100);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cornerAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(cornerAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const renderFeaturedContent = () => {
    return (
      <View style={styles.featuredContainer}>
        <Carousel
          ref={carouselRef}
          data={featuredContent}
          renderItem={renderFeaturedItem}
          sliderWidth={width}
          itemWidth={width * 0.55}
          inactiveSlideScale={0.7}
          firstItem={0}
          initialNumToRender={5}
          activeSlideAlignment="center"
          containerCustomStyle={styles.carouselContainer}
          contentContainerCustomStyle={{ alignItems: 'center' }}
          onSnapToItem={(index) => setActiveSlide(index)}
          loop={true}
          autoplay={false}
          autoplayInterval={5000}
          slideStyle={{ alignItems: 'center' }}
          shouldOptimizeUpdates={true}
          decelerationRate={0.9}
          enableSnap={true}
        />
        <View style={styles.paginationContainer}>
          <View style={styles.paginationDots}>
            {featuredContent.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paginationDot,
                  { backgroundColor: theme.paginationDot },
                  activeSlide === index && [
                    styles.activeDot,
                    { backgroundColor: theme.activeDot }
                  ]
                ]}
                onPress={() => {
                  carouselRef.current.snapToItem(index);
                  setActiveSlide(index);
                }}
                activeOpacity={0.7}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderRecentWatched = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>Recent Watched</Text>
        <TouchableOpacity onPress={() => navigation.navigate('FavouritesStack', { screen: 'RecentlyWatched' })}>
          <Text style={[styles.seeAllText, { color: theme.seeAllText }]}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {[
          {
            title: 'Neon Genesis Evangelion',
            image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/07/neon-genesis-evangelion.jpg?q=49&fit=crop&w=480&dpr=2',
            rating: "14+",
            episodes: "26",
            status: "Complete • Season 1"
          },
          {
            title: 'Baccano!',
            image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/07/baccano-1.jpg?q=49&fit=crop&w=480&dpr=2',
            rating: "16+",
            episodes: "13",
            status: "Complete • Season 1"
          },
          {
            title: 'Gintama',
            image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/06/gintama-2005.jpg?q=70&fit=crop&w=480&dpr=1',
            rating: "14+",
            episodes: "367",
            status: "Complete • Season 1-4"
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.mediaCard}
            onPress={() => navigation.navigate('AnimeDetails', {
              anime: {
                title: item.title,
                imageUrl: item.image,
                rating: item.rating,
                episodes: item.episodes,
                status: item.status,
                description: "A classic anime series that has captivated audiences worldwide.",
              }
            })}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.mediaCardImage}
            />
            <Text style={[styles.mediaCardTitle, { color: theme.mediaCardTitle }]}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderMyFavorites = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>My Favorites</Text>
        <TouchableOpacity onPress={() => navigation.navigate('FavouritesStack', { screen: 'FavouritesScreen' })}>
          <Text style={[styles.seeAllText, { color: theme.seeAllText }]}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {[
          {
            title: 'Code Geass: Lelouch of the Rebellion',
            image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/04/code-geass-lelouch-of-the-rebellion-2006.jpg?q=49&fit=crop&w=480&dpr=2',
            rating: "16+",
            episodes: "50",
            status: "Complete • Season 1-2"
          },
          {
            title: 'Haikyuu!!',
            image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/08/haikyuu.jpg?q=49&fit=crop&w=480&dpr=2',
            rating: "12+",
            episodes: "85",
            status: "Complete • Season 1-4"
          },
          {
            title: 'One Punch Man',
            image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/2024/09/mv5bzjjlnze5yzetyzqwys00ntbjltk5yzatyzuwowqym2e3ogi2xkeyxkfqcgdeqxvyntgynta4mjm-_v1_.jpg?q=49&fit=crop&w=480&dpr=2',
            rating: "14+",
            episodes: "24",
            status: "Ongoing • Season 2"
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.mediaCard}
            onPress={() => navigation.navigate('AnimeDetails', {
              anime: {
                title: item.title,
                imageUrl: item.image,
                rating: item.rating,
                episodes: item.episodes,
                status: item.status,
                description: "A beloved anime series that continues to inspire fans around the world.",
              }
            })}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.mediaCardImage}
            />
            <Text style={[styles.mediaCardTitle, { color: theme.mediaCardTitle }]}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent={true}
      />
      {/* Background Elements */}
      <View style={styles.backgroundContainer}>
        {/* Golden Gradient Background */}
        <LinearGradient
          colors={isDarkMode ?
            ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'] :
            ['rgba(248, 246, 242, 0.8)', 'rgba(212, 192, 160, 0.1)']}
          style={StyleSheet.absoluteFill}
        />

        {/* Enhanced Golden Circle */}
        <View style={[styles.goldsquare, {
          backgroundColor: theme.goldsquare.background,
          shadowColor: theme.goldsquare.shadow,
          shadowOpacity: theme.goldsquare.shadowOpacity,
          transform: [
            { translateX: -width * 0.75 },
            { translateY: -width * 0.75 },
            { rotate: '15deg' }
          ]
        }]} />

        {/* Second Golden Circle */}
        <View style={[styles.goldsquareInner, {
          backgroundColor: theme.goldsquareInner.background,
          shadowColor: theme.goldsquareInner.shadow,
          shadowOpacity: theme.goldsquareInner.shadowOpacity,
          transform: [
            { translateX: -width * 0.5 },
            { translateY: -width * 0.5 },
            { rotate: '-10deg' }
          ]
        }]} />

        {/* Additional Decorative Elements for Light Mode */}
        {!isDarkMode && (
          <>
            <View style={[styles.decorativeCircle, {
              top: '15%',
              right: '-10%',
              backgroundColor: 'rgba(212, 192, 160, 0.08)',
              transform: [{ scale: 1.2 }]
            }]} />
            <View style={[styles.decorativeCircle, {
              bottom: '25%',
              left: '-5%',
              backgroundColor: 'rgba(151, 106, 61, 0.05)',
              transform: [{ scale: 0.8 }]
            }]} />
          </>
        )}

        <BlurView
          intensity={1}
          tint={isDarkMode ? 'dark' : 'light'}
          // experimentalBlurMethod="blur"
          style={[styles.glassBackground, { backgroundColor: theme.glassBackground }]}
        >
          <View style={[styles.glassOverlay, { backgroundColor: theme.glassOverlay }]} />
        </BlurView>
      </View>

      {/* Status bar gradient overlay */}
      <LinearGradient
        colors={theme.statusBarGradient}
        style={styles.statusBarGradient}
        pointerEvents="none"
      />
      <Header title="Hello," />
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <SafeAreaView style={styles.content}>
          {renderFeaturedContent()}
          {renderRecentWatched()}
          {renderMyFavorites()}
        </SafeAreaView>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  goldsquare: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    top: '40%',
    left: '50%',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 50,
  },
  goldsquareInner: {
    position: 'absolute',
    width: width,
    height: width,
    borderRadius: width * 0.5,
    top: '45%',
    left: '50%',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 40,
  },
  glassBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  glassOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  statusBarGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 9,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBackground: {
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greeting: {
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 249, 224, 0.5)',
  },
  categoryTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 100,
    paddingBottom: 15,
    justifyContent: 'space-between',
  },
  categoryTab: {
    paddingVertical: 8,
    alignItems: 'center',
    position: 'relative',
  },
  selectedCategoryTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  categoryTabText: {
    fontSize: 15,
  },
  selectedCategoryTabText: {
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 2,
  },
  featuredContainer: {
    height: 400,
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 65,
  },
  carouselContainer: {
    marginTop: -30,
  },
  featuredCardContainer: {
    width: width * 0.55,
    height: width * 0.55,
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  featuredCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredTitleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
  },
  featuredCardTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featuredCardSubtitle: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
  },
  paginationContainer: {
    alignItems: 'center',
    marginTop: -20,
  },
  paginationDots: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    transition: 'all 0.3s ease',
    transform: [{ scale: 1 }],
  },
  activeDot: {
    width: 28,
    height: 8,
    borderRadius: 4,
    transform: [{ scale: 1.1 }],
  },
  sectionContainer: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
  },
  cardsContainer: {
    paddingRight: 10,
  },
  mediaCard: {
    width: width * 0.28,
    marginRight: 15,
  },
  mediaCardImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  mediaCardTitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  squarePlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    overflow: 'hidden',
  },
  largePlayButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    transform: [{ translateX: -32.5 }, { translateY: -32.5 }],
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largePlayButtonGradient: {
    width: '100%',
    height: '100%',
  },
  playIcon: {
    marginLeft: 3,
  },
  activeTitleText: {
    fontSize: 18,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  activeSubtitleText: {
    fontSize: 13,
    opacity: 0.9,
    color: '#fff',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  activeCorner: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderColor: '#b89670',
    borderWidth: 1,
    borderRadius: 20,
    top: 20,
    left: 20,
    shadowColor: '#d4c0a0',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  episodeNumber: {
    fontSize: 14,
    marginBottom: 4,
  },
  episodeTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  featuredItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeInfoContainer: {
    alignItems: 'center',
    marginBottom: -65,
    marginTop: 40,
    paddingHorizontal: 10,
    width: width * 0.55,
  },
  decorativeCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    opacity: 0.6,
  },
}); 