import React, { useRef, useState, useEffect } from 'react';
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
import Header from '../components/Header';

const { width } = Dimensions.get('window');

export default function RecentlyWatchedScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [cardAnimations] = useState(() => 
    Array(6).fill().map(() => new Animated.Value(0))
  );

  useEffect(() => {
    Animated.stagger(
      100,
      cardAnimations.map(anim =>
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  const recentlyWatchedData = [
    {
      title: 'Neon Genesis Evangelion',
      image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/07/neon-genesis-evangelion.jpg?q=49&fit=crop&w=480&dpr=2',
      rating: "14+",
      episodes: "26",
      status: "Complete • Season 1",
      lastWatched: "2 hours ago"
    },
    {
      title: 'Baccano!',
      image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/07/baccano-1.jpg?q=49&fit=crop&w=480&dpr=2',
      rating: "16+",
      episodes: "13",
      status: "Complete • Season 1",
      lastWatched: "1 day ago"
    },
    {
      title: 'Gintama',
      image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/06/gintama-2005.jpg?q=70&fit=crop&w=480&dpr=1',
      rating: "14+",
      episodes: "367",
      status: "Complete • Season 1-4",
      lastWatched: "3 days ago"
    },
    {
      title: 'Death Note',
      image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/06/death-note-2006.jpg?q=49&fit=crop&w=480&dpr=2',
      rating: "16+",
      episodes: "37",
      status: "Complete • Season 1",
      lastWatched: "5 days ago"
    },
    {
      title: 'Code Geass: Lelouch of the Rebellion',
      image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/04/code-geass-lelouch-of-the-rebellion-2006.jpg?q=49&fit=crop&w=480&dpr=2',
      rating: "16+",
      episodes: "50",
      status: "Complete • Season 1-2",
      lastWatched: "1 week ago"
    },
    {
      title: 'Haikyuu!!',
      image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/08/haikyuu.jpg?q=49&fit=crop&w=480&dpr=2',
      rating: "12+",
      episodes: "85",
      status: "Complete • Season 1-4",
      lastWatched: "2 weeks ago"
    },
  ];

  const renderRecentlyWatchedGrid = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>Watch History</Text>
      </View>

      <View style={styles.gridContainer}>
        {recentlyWatchedData.map((item, index) => (
          <Animated.View
            key={index}
            style={[
              styles.gridCard,
              {
                opacity: cardAnimations[index],
                transform: [
                  { scale: cardAnimations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  })}
                ]
              }
            ]}
          >
            <TouchableOpacity
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
                style={styles.gridImage}
              />
              <View style={styles.gridInfo}>
                <Text style={[styles.gridTitle, { color: theme.mediaCardTitle }]} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={[styles.lastWatchedText, { color: theme.text }]}>{item.lastWatched}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
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

        <BlurView
          intensity={1}
          tint={isDarkMode ? 'dark' : 'light'}
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
      <Header title="Recently Watched" subtitle="Continue Watching" showNotification={true} />
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
          {renderRecentlyWatchedGrid()}
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
  sectionContainer: {
    padding: 20,
    marginTop: 85,
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: (width - 48) / 2,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  gridImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 8,
  },
  gridInfo: {
    padding: 4,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  lastWatchedText: {
    fontSize: 12,
    opacity: 0.7,
  },
}); 