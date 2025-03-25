import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  ImageBackground,
  Animated,
  TouchableOpacity,
  Text,
  Easing,
  StatusBar,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.55;
const CARD_HEIGHT = screenHeight * 0.4;
const BOTTOM_TAB_HEIGHT = 60;
const SPACING_FOR_CARD_INSET = screenWidth * 0.1;

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// Image data with provided URLs
const carouselData = [
  {
    id: 0,
    imageUrl: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/06/dandadan-2024.jpg?q=49&fit=crop&w=480&dpr=2',
    title: 'Dandadan',
    description: 'A supernatural action series following Momo Ayase and Okarun as they investigate paranormal phenomena.',
    rating: '4.8',
    episodes: '12',
    status: 'Ongoing'
  },
  {
    id: 1,
    imageUrl: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/04/vinland-saga-poster-4.jpg?q=49&fit=crop&w=480&dpr=2',
    title: 'Vinland Saga',
    description: 'A historical epic following Thorfinn\'s journey through the Viking age.',
    rating: '4.9',
    episodes: '24',
    status: 'Completed'
  },
  {
    id: 2,
    imageUrl: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/10/0313306_poster_w780.jpg?q=70&fit=crop&w=480&dpr=1',
    title: 'Anime Title 3',
    description: 'Description for anime 3',
    rating: '4.7',
    episodes: '12',
    status: 'Ongoing'
  },
  {
    id: 3,
    imageUrl: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/07/baccano-1.jpg?q=49&fit=crop&w=480&dpr=2',
    title: 'Baccano!',
    description: 'A non-linear narrative following various characters in 1930s America.',
    rating: '4.8',
    episodes: '13',
    status: 'Completed'
  },
  {
    id: 4,
    imageUrl: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/06/gintama-2005.jpg?q=70&fit=crop&w=480&dpr=1',
    title: 'Gintama',
    description: 'A sci-fi comedy following Gintoki and his friends in an alternate Edo period.',
    rating: '4.9',
    episodes: '367',
    status: 'Completed'
  },
  {
    id: 5,
    imageUrl: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/04/code-geass-lelouch-of-the-rebellion-2006.jpg?q=49&fit=crop&w=480&dpr=2',
    title: 'Code Geass',
    description: 'A mecha series following Lelouch\'s quest for revenge and world domination.',
    rating: '4.9',
    episodes: '25',
    status: 'Completed'
  },
  {
    id: 6,
    imageUrl: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/04/steins-gate-2011.jpg?q=49&fit=crop&w=480&dpr=2',
    title: 'Steins;Gate',
    description: 'A sci-fi thriller about time travel and its consequences.',
    rating: '4.9',
    episodes: '24',
    status: 'Completed'
  }
];

export default function TrendingScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const carouselRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Theme colors for each anime
  const cardThemes = {
    0: 'rgba(255, 102, 0, 0.5)',    // Orange for Dandadan
    1: 'rgba(70, 130, 180, 0.5)',    // Steel blue for Vinland Saga
    2: 'rgba(255, 105, 180, 0.5)',   // Hot pink
    3: 'rgba(255, 215, 0, 0.5)',     // Gold for Baccano
    4: 'rgba(135, 206, 235, 0.5)',   // Sky blue for Gintama
    5: 'rgba(138, 43, 226, 0.5)',    // Purple for Code Geass
    6: 'rgba(0, 191, 255, 0.5)'      // Deep sky blue for Steins;Gate
  };

  useEffect(() => {
    // Continuous glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Continuous rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Calculate background opacity and colors based on scroll position
  const getBackgroundStyle = (index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];
    
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    return {
      opacity,
      ...styles.backgroundImage,
    };
  };

  const renderBackground = () => {
    return carouselData.map((item, index) => (
      <AnimatedImageBackground
        key={item.id}
        source={{ uri: item.imageUrl }}
        style={getBackgroundStyle(index +3)}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            'rgba(0,0,0,0)',
            'rgba(0, 0, 0, 0)',
            'rgba(0,0,0,0.4)',
            'rgba(0,0,0,0.6)',
            'rgba(0, 0, 0, 0.92)',
          ]}
          locations={[0, 0.3, 0.5, 0.7, 0.8, 1]}
          style={styles.backgroundGradient}
        />
      </AnimatedImageBackground>
    ));
  };

  const handleCardPress = (item) => {
    navigation.navigate('AnimeDetails', { anime: item });
  };

  const renderCarouselItem = ({ item, index }) => {
    const scale = scrollX.interpolate({
      inputRange: [(item.id - 1) * CARD_WIDTH, item.id * CARD_WIDTH],
      outputRange: [0.85, 1],
      extrapolate: 'clamp',
    });

    const rotate = scrollX.interpolate({
      inputRange: [(item.id - 1) * CARD_WIDTH, item.id * CARD_WIDTH],
      outputRange: ['-8deg', '-5deg'],
      extrapolate: 'clamp',
    });

    const glowOpacity = scrollX.interpolate({
      inputRange: [(item.id - 1) * CARD_WIDTH, item.id * CARD_WIDTH],
      outputRange: [0.2, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => handleCardPress(item)}
      >
        <Animated.View 
          style={[
            styles.carouselItem,
            {
              transform: [
                { perspective: 1000 },
                { rotateY: rotate },
                { scale },
              ]
            }
          ]}
        >
          <Animated.View
            style={[
              styles.cardContainer,
              {
                shadowColor: cardThemes[item.id],
                shadowOpacity: glowOpacity,
              }
            ]}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={[
                styles.cardImage,
                {
                  borderColor: cardThemes[item.id].replace('0.5', '0.2'),
                }
              ]}
              resizeMode="cover"
            />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const handleSnapToItem = (index) => {
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <View style={styles.backgroundContainer}>
        {renderBackground()}
        
        {/* Additional top fade */}
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.4)',
            'rgba(0,0,0,0.1)',
            'rgba(0,0,0,0)'
          ]}
          locations={[0, 0.3, 0.5]}
          style={styles.topGradient}
        />
      </View>

      {/* Futuristic corner decorations */}
      <View style={styles.cornerTL} />
      <View style={styles.cornerTR} />
      <View style={styles.cornerBL} />
      <View style={styles.cornerBR} />

      {/* Animated Trending Tag */}
      <Animated.View 
        style={[
          styles.trendingTag,
          {
            transform: [{ scale: Animated.add(1, Animated.multiply(glowAnim, 0.1)) }],
          }
        ]}
      >
        <Animated.View style={[styles.trendingIconContainer, { transform: [{ rotate: spin }] }]}>
          <Text style={styles.trendingIcon}>🔥</Text>
        </Animated.View>
        <Text style={styles.trendingText}>Trending</Text>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.2)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.trendingGlow}
        />
      </Animated.View>

      <View style={styles.carouselContainer}>
        <Carousel
          ref={carouselRef}
          data={carouselData}
          renderItem={renderCarouselItem}
          sliderWidth={screenWidth}
          itemWidth={CARD_WIDTH}
          onSnapToItem={handleSnapToItem}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          inactiveSlideScale={0.75}
          inactiveSlideOpacity={0.8}
          containerCustomStyle={styles.carousel}
          contentContainerCustomStyle={styles.carouselContent}
          loop={true}
          autoplay={false}
          enableSnap={true}
          enableMomentum={true}
          decelerationRate={3}
          lockScrollWhileSnapping={true}
          firstItem={2}
          layoutCardOffset={18}
          activeSlideAlignment="center"
          inactiveSlideShift={10}
          useScrollView={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingBottom: 100,
    overflow: 'visible',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    flex: 1,
  },
  topOverlay: {
    height: '35%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  carouselContainer: {
    position: 'absolute',
    bottom: BOTTOM_TAB_HEIGHT + 40,
    left: 0,
    right: 0,
    height: CARD_HEIGHT + 50,
    overflow: 'visible',
  },
  carousel: {
    overflow: 'visible',
  },
  carouselContent: {
    paddingVertical: 8,
  },
  carouselItem: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'visible',
    transform: [
      { perspective: 1000 },
      { rotateY: '-5deg' },
    ],
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 1,
  },
  playButton: {
    position: 'absolute',
    top: 10,
    right: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 22,
    marginLeft: 3,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 12,
    width: '100%',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  trendingTag: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(95, 95, 95, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  trendingIconContainer: {
    marginRight: 6,
  },
  trendingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  trendingIcon: {
    color: '#fff',
    fontSize: 18,
  },
  trendingGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  cornerTL: {
    position: 'absolute',
    top: 40,
    left: 40,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cornerTR: {
    position: 'absolute',
    top: 40,
    right: 40,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'visible',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 35,
    elevation: 20,
  },
}); 