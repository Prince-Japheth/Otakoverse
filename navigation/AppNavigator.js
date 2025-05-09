import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import CustomTabBar from '../components/CustomTabBar';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AnimeDetails from '../screens/AnimeDetails';
import SeasonEpisodes from '../screens/SeasonEpisodes';
import NotificationScreen from '../screens/NotificationScreen';
import DownloadsStack from './DownloadsStack';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import TrendingScreen from '../screens/TrendingScreen';
import AuthScreen from '../screens/AuthScreen';
import LoadingScreen from '../screens/LoadingScreen';
import RecentlyWatchedScreen from '../screens/RecentlyWatchedScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoPlayer from '../screens/VideoPlayer';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="HomeStack"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <Stack.Navigator 
            screenOptions={{ headerShown: false }}
            initialRouteName="HomeScreen">
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen 
              name="AnimeDetails" 
              component={AnimeDetails}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen 
              name="SeasonEpisodes" 
              component={SeasonEpisodes}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Trending"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <Stack.Navigator 
            screenOptions={{ headerShown: false }}
            initialRouteName="TrendingScreen"
          >
            <Stack.Screen name="TrendingScreen" component={TrendingScreen} />
            <Stack.Screen 
              name="AnimeDetails" 
              component={AnimeDetails}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('SearchModal');
          },
        })}
      >
        {() => (
          <Stack.Navigator 
            screenOptions={{ headerShown: false }}
            initialRouteName="SearchScreen"
          >
            <Stack.Screen 
              name="SearchScreen" 
              component={SearchScreen}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="FavouritesStack"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <Stack.Navigator 
            screenOptions={{ headerShown: false }}
            initialRouteName="FavouritesScreen"
          >
            <Stack.Screen name="FavouritesScreen" component={FavouritesScreen} />
            <Stack.Screen 
              name="RecentlyWatched" 
              component={RecentlyWatchedScreen}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen 
              name="AnimeDetails" 
              component={AnimeDetails}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipsis-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainNavigator() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
        setHasSeenOnboarding(hasSeen === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2500);
      }
    };

    checkOnboarding();
  }, []);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.background },
        presentation: 'card',
        animation: 'fade',
      }}
    >
      {!hasSeenOnboarding && (
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{
            cardStyle: { backgroundColor: theme.background },
            presentation: 'card',
            animation: 'fade',
          }}
        />
      )}
      {!isAuthenticated && (
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen}
          options={{
            cardStyle: { backgroundColor: theme.background },
            presentation: 'card',
            animation: 'fade',
            gestureEnabled: false,
            cardOverlayEnabled: false,
          }}
        />
      )}
      <Stack.Screen 
        name="Loading" 
        component={LoadingScreen}
        options={{
          cardStyle: { backgroundColor: theme.background },
          presentation: 'card',
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="MainTabs" 
        component={TabNavigator}
        options={{
          animation: 'none',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="SearchModal"
        component={SearchScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          animationDuration: 300,
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardOverlayEnabled: true,
        }}
      />
      <Stack.Screen 
        name="AnimeDetails" 
        component={AnimeDetails}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          animationDuration: 300,
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardOverlayEnabled: true,
        }}
      />
      <Stack.Screen
        name="Notification" 
        component={NotificationScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="DownloadsStack"
        component={DownloadsStack}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="VideoPlayer"
        component={VideoPlayer}
        options={{
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom',
          orientation: 'landscape',
        }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
} 