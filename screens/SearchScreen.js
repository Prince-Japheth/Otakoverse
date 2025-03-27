import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const GRID_VIEW_KEY = '@search_view_mode';
const SEARCH_HISTORY_KEY = '@search_history';

const dummyResults = [
  // Featured Content
  {
    id: '1',
    title: 'Dandadan',
    genre: 'Action, Supernatural',
    rating: '16+',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/06/dandadan-2024.jpg?q=49&fit=crop&w=480&dpr=2'
  },
  {
    id: '2',
    title: 'Vinland Saga',
    genre: 'Action, Historical',
    rating: '16+',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/04/vinland-saga-poster-4.jpg?q=49&fit=crop&w=480&dpr=2'
  },
  {
    id: '3',
    title: 'Death Note',
    genre: 'Psychological, Thriller',
    rating: '16+',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/06/death-note-2006.jpg?q=49&fit=crop&w=480&dpr=2'
  },
  // Recent Watched
  {
    id: '4',
    title: 'Neon Genesis Evangelion',
    genre: 'Mecha, Psychological',
    rating: '14+',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/07/neon-genesis-evangelion.jpg?q=49&fit=crop&w=480&dpr=2'
  },
  {
    id: '5',
    title: 'Baccano!',
    genre: 'Action, Supernatural',
    rating: '16+',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/07/baccano-1.jpg?q=49&fit=crop&w=480&dpr=2'
  },
  {
    id: '6',
    title: 'Gintama',
    genre: 'Action, Comedy',
    rating: '14+',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/06/gintama-2005.jpg?q=70&fit=crop&w=480&dpr=1'
  },
  // Favorites
  {
    id: '7',
    title: 'Code Geass: Lelouch of the Rebellion',
    genre: 'Mecha, Drama',
    rating: '16+',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/04/code-geass-lelouch-of-the-rebellion-2006.jpg?q=49&fit=crop&w=480&dpr=2'
  },
  {
    id: '8',
    title: 'Haikyuu!!',
    genre: 'Sports, Drama',
    rating: '12+',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/sharedimages/2024/08/haikyuu.jpg?q=49&fit=crop&w=480&dpr=2'
  },
  {
    id: '9',
    title: 'One Punch Man',
    genre: 'Action, Comedy',
    rating: '14+',
    image: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/2024/09/mv5bzjjlnze5yzetyzqwys00ntbjltk5yzatyzuwowqym2e3ogi2xkeyxkfqcgdeqxvyntgynta4mjm-_v1_.jpg?q=49&fit=crop&w=480&dpr=2'
  }
];

export default function SearchScreen({ navigation }) {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const resultsAnim = useRef(new Animated.Value(0)).current;
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    loadViewPreference();
    loadSearchHistory();
  }, []);

  const loadViewPreference = async () => {
    try {
      const savedViewMode = await AsyncStorage.getItem(GRID_VIEW_KEY);
      if (savedViewMode !== null) {
        setIsGridView(savedViewMode === 'grid');
      }
    } catch (error) {
      console.error('Error loading view preference:', error);
    }
  };

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const saveSearchHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      setSearchHistory(newHistory);
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const addToSearchHistory = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    const newHistory = [
      searchTerm,
      ...searchHistory.filter(item => item !== searchTerm)
    ].slice(0, 5); // Keep only last 5 searches
    
    saveSearchHistory(newHistory);
  };

  const clearSearchHistory = async () => {
    try {
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const toggleViewMode = async () => {
    try {
      const newViewMode = !isGridView;
      setIsGridView(newViewMode);
      await AsyncStorage.setItem(GRID_VIEW_KEY, newViewMode ? 'grid' : 'list');
    } catch (error) {
      console.error('Error saving view preference:', error);
    }
  };

  const handleSearch = (text) => {
    setQuery(text);
    if (text.trim()) {
      addToSearchHistory(text);
      // Simulate search with dummy data
      const filtered = dummyResults.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered);

      // Animate results
      Animated.spring(resultsAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      setResults([]);
      Animated.spring(resultsAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  React.useEffect(() => {
    Animated.spring(searchBarAnim, {
      toValue: 1,
      tension: 10,
      friction: 2,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderSearchResult = ({ item, index }) => {
    const translateY = resultsAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });

    const opacity = resultsAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const handlePress = () => {
      navigation.navigate('AnimeDetails', {
        anime: {
          title: item.title,
          imageUrl: item.image,
          rating: item.rating,
          episodes: "12",
          status: "Complete • Season 1",
          description: "A captivating anime series that has captured the hearts of fans worldwide.",
        }
      });
    };

    if (isGridView) {
      return (
        <TouchableOpacity onPress={handlePress}>
          <Animated.View
            style={[
              styles.gridCard,
              {
                backgroundColor: theme.surfaceVariant,
                transform: [{ translateY }],
                opacity,
              },
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.gridImage} />
            <View style={styles.gridInfo}>
              <Text style={[styles.gridTitle, { color: theme.text }]} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.gridRatingContainer}>
                <Text style={[styles.gridRatingText, { color: theme.primary }]}>★ {item.rating}</Text>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={handlePress}>
        <Animated.View
          style={[
            styles.resultCard,
            {
              backgroundColor: theme.surfaceVariant,
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <Image source={{ uri: item.image }} style={styles.resultImage} />
          <View style={styles.resultInfo}>
            <Text style={[styles.resultTitle, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.resultGenre, { color: theme.textSecondary }]}>
              {item.genre}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={[styles.ratingText, { color: theme.primary }]}>★ {item.rating}</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderSearchHistory = () => (
    <View style={styles.searchHistoryContainer}>
      <View style={styles.searchHistoryHeader}>
        <Text style={[styles.searchHistoryTitle, { color: theme.text }]}>Recent Searches</Text>
        {searchHistory.length > 0 && (
          <TouchableOpacity onPress={clearSearchHistory}>
            <Text style={[styles.clearHistoryText, { color: theme.primary }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      {searchHistory.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.searchHistoryItem}
          onPress={() => handleSearch(item)}
        >
          <Ionicons name="time-outline" size={20} color={theme.textSecondary} />
          <Text style={[styles.searchHistoryText, { color: theme.text }]}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEmptyState = () => {
    if (query.length === 0) {
      return searchHistory.length > 0 ? (
        renderSearchHistory()
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: theme.text }]}>
            Search for your favorite anime
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.textSecondary }]}>
            Discover thousands of anime series and movies
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.noResultsState}>
        <Image
          source={require('../assets/search-empty.png')}
          style={styles.noResultsAnimation}
        />
        <Text style={[styles.noResultsTitle, { color: theme.text }]}>
          Oops! Nothing Found
        </Text>
        <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>
          We couldn't find "{query}". Maybe it's not in our database yet?
        </Text>
        <TouchableOpacity
          style={[styles.suggestionButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Suggestion', { animeName: query })}
        >
          <LinearGradient
            colors={theme.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.suggestionButtonText}>Suggest This Anime</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View
        style={[
          styles.searchBarContainer,
          {
            transform: [
              {
                translateY: searchBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
            opacity: searchBarAnim,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.surfaceVariant,
              color: theme.text,
            },
          ]}
          placeholder="Search anime..."
          placeholderTextColor={theme.textSecondary}
          value={query}
          onChangeText={handleSearch}
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => handleSearch('')}
            style={[styles.clearButton, { backgroundColor: theme.surfaceVariant }]}
          >
            <Ionicons
              name="close-circle"
              size={24}
              color={theme.text}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={toggleViewMode}
          style={[styles.viewToggleButton, { backgroundColor: theme.surfaceVariant }]}
        >
          <Ionicons
            name={isGridView ? "grid" : "list"}
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
      </Animated.View>

      {query.length === 0 ? (
        renderEmptyState()
      ) : results.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          key={isGridView ? 'grid' : 'list'}
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.resultsList,
            isGridView && styles.gridResultsList
          ]}
          numColumns={isGridView ? 3 : 1}
          columnWrapperStyle={isGridView ? styles.gridRow : undefined}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
  },
  searchBarContainer: {
    padding: 16,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  resultsList: {
    padding: 16,
  },
  resultCard: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    marginHorizontal: 2,
  },
  resultImage: {
    width: 100,
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  resultInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  resultGenre: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 50,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  noResultsState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noResultsAnimation: {
    width: 180,
    height: 180,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  noResultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  suggestionButton: {
    height: 50,
    paddingHorizontal: 32,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  suggestionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  viewToggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  gridResultsList: {
    padding: 16,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridCard: {
    width: (width - 48) / 3,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  gridImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  gridInfo: {
    padding: 8,
    backgroundColor: 'transparent',
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  gridGenre: {
    fontSize: 11,
    marginBottom: 4,
    opacity: 0.8,
    textAlign: 'center',
  },
  gridRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridRatingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchHistoryContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },
  searchHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchHistoryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  clearHistoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  searchHistoryText: {
    fontSize: 16,
    marginLeft: 12,
  },
}); 