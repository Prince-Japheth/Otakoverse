import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import CustomTabBar from '../components/CustomTabBar';
import { useNavigation } from '@react-navigation/native';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import TrendingScreen from '../screens/TrendingScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AnimeDetails from '../screens/AnimeDetails';
import AuthScreen from '../screens/AuthScreen';
import SuggestionScreen from '../screens/SuggestionScreen';

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
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Trending"
        component={TrendingScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={EmptyComponent}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('SearchModal');
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const EmptyComponent = () => null;

function MainNavigator() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasSeenOnboarding ? (
        <Stack.Screen name="Onboarding">
          {(props) => (
            <OnboardingScreen
              {...props}
              onFinish={() => setHasSeenOnboarding(true)}
            />
          )}
        </Stack.Screen>
      ) : !isAuthenticated ? (
        <Stack.Screen name="Auth">
          {(props) => (
            <AuthScreen
              {...props}
              onAuthenticate={() => setIsAuthenticated(true)}
            />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen
            name="AnimeDetails"
            component={AnimeDetails}
            options={{
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="SearchModal"
            component={SearchScreen}
            options={{
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="Suggestion"
            component={SuggestionScreen}
            options={{
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </>
      )}
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