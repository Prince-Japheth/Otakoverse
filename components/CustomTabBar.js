import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={[
      styles.outerContainer,
      {
        shadowColor: isDarkMode ? '#000' : theme.primary,
        shadowOpacity: isDarkMode ? 0.35 : 0.25,
      }
    ]}>
      <LinearGradient
        colors={isDarkMode ? 
          ['rgba(72, 63, 50, 0.4)', 'rgba(72, 63, 50, 0.45)'] : 
          ['rgba(248, 246, 242, 0.95)', 'rgba(236, 227, 215, 0.9)']}
        style={styles.gradientContainer}
      >
        <BlurView
          intensity={isDarkMode ? 15 : 35}
          experimentalBlurMethod="blur"
          tint={isDarkMode ? "dark" : "light"}
          style={styles.tabBarContainer}
        >
          <View style={[
            styles.innerContainer,
            {
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(212, 192, 160, 0.5)',
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(248, 246, 242, 0.85)',
            }
          ]}>
            <View style={styles.tabsContainer}>
              {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                };

                let iconName;
                if (route.name === 'Home') {
                  iconName = isFocused ? 'home' : 'home-outline';
                } else if (route.name === 'Trending') {
                  iconName = isFocused ? 'trending-up' : 'trending-up-outline';
                } else if (route.name === 'Search') {
                  iconName = 'search-outline';
                } else if (route.name === 'Favourites') {
                  iconName = isFocused ? 'heart' : 'heart-outline';
                } else if (route.name === 'Settings') {
                  iconName = isFocused ? 'person' : 'person-outline';
                }

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    onPress={onPress}
                    style={styles.tabButton}
                  >
                    <View style={[
                      styles.iconContainer,
                      isFocused && styles.activeIconContainer,
                      isFocused && !isDarkMode && {
                        backgroundColor: 'rgba(212, 192, 160, 0.2)',
                      }
                    ]}>
                      {isFocused && (
                        <LinearGradient
                          colors={theme.gradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[StyleSheet.absoluteFill, styles.activeGradient]}
                        />
                      )}
                      <Ionicons
                        name={iconName}
                        size={24}
                        color={isFocused ? theme.primary : isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(44, 24, 16, 0.5)'}
                        style={isFocused && styles.activeIcon}
                      />
                      {isFocused && (
                        <View style={[
                          styles.activeIndicator,
                          { 
                            backgroundColor: theme.primary,
                            shadowColor: theme.primary,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: isDarkMode ? 0.5 : 0.3,
                            shadowRadius: 4,
                            elevation: 3,
                          }
                        ]} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </BlurView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    height: 70,
    borderRadius: 23,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowRadius: 16,
    elevation: 24,
  },
  gradientContainer: {
    flex: 1,
    borderRadius: 23,
    overflow: 'hidden',
  },
  tabBarContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 23,
  },
  innerContainer: {
    flex: 1,
    borderRadius: 23,
    borderWidth: 1,
  },
  tabsContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    zIndex: 2,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 12,
    position: 'relative',
  },
  activeIconContainer: {
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  activeGradient: {
    borderRadius: 12,
    opacity: 0.15,
  },
  activeIcon: {
    transform: [{scale: 1.1}],
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default CustomTabBar; 