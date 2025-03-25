"use client"

import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const ThemeContext = createContext()

export const themes = {
  dark: {
    primary: "#c45e1b",
    secondary: "#e67e22",
    background: "#000000",
    surface: "#121212",
    surfaceVariant: "#1E1E1E",
    text: "#FFFFFF",
    textSecondary: "rgba(255,255,255,0.7)",
    border: "rgba(255,255,255,0.1)",
    accent: "#f39c12",
    error: "#CF6679",
    gradient: ["#c45e1b", "#d35400", "#e67e22"],
    overlay: "rgba(20,10,38,0.8)",
    // HomeScreen specific
    headerBackground: "rgba(18, 18, 18, 0.8)",
    glassBackground: "rgb(32, 32, 32)",
    glassOverlay: "rgba(14, 14, 14, 0.75)",
    greetingText: "#e67e22",
    userName: "#FFFFFF",
    headerIcon: "rgba(255, 235, 205, 0.5)",
    categoryTabText: "#e67e22",
    selectedCategoryTabText: "#FFFFFF",
    selectedIndicator: "#f39c12",
    featuredCardBackground: "#1a1a1a",
    paginationDot: "rgba(255, 255, 255, 0.3)",
    activeDot: "#f39c12",
    sectionTitle: "#FFFFFF",
    seeAllText: "#e67e22",
    mediaCardTitle: "#FFFFFF",
    episodeNumber: "#e67e22",
    episodeTitle: "#FFFFFF",
    statusBarGradient: ["rgba(0,0,0,0.7)", "rgba(0,0,0,0)"],
    goldsquare: {
      background: "rgba(196, 94, 27, 0.15)",
      shadow: "#c45e1b",
      shadowOpacity: 0.3,
    },
    goldsquareInner: {
      background: "rgba(230, 126, 34, 0.1)",
      shadow: "#e67e22",
      shadowOpacity: 0.2,
    },
  },
  light: {
    primary: "#b34700",
    secondary: "#d35400",
    background: "#FFFFFF",
    surface: "#FEF5E7",
    surfaceVariant: "#FDEBD0",
    text: "#0D0D0D",
    // text: "#4A2700",
    textSecondary: "rgba(1, 0, 6, 0.7)",
    // textSecondary: "rgba(74, 39, 0, 0.7)",
    border: "rgba(179, 71, 0, 0.15)",
    accent: "#e67e22",
    error: "#B00020",
    gradient: ["#b34700", "#d35400", "#e67e22"],
    overlay: "rgba(179, 71, 0, 0.1)",
    // HomeScreen specific
    headerBackground: "rgba(254, 245, 231, 0.85)",
    glassBackground: "rgba(254, 245, 231, 0.7)",
    glassOverlay: "rgba(255, 255, 255, 0.4)",
    greetingText: "#d35400",
    userName: "#4A2700",
    headerIcon: "rgba(230, 126, 34, 0.2)",
    categoryTabText: "#d35400",
    selectedCategoryTabText: "#4A2700",
    selectedIndicator: "#b34700",
    featuredCardBackground: "#FFFFFF",
    paginationDot: "rgba(179, 71, 0, 0.3)",
    activeDot: "#b34700",
    sectionTitle: "#4A2700",
    seeAllText: "#d35400",
    mediaCardTitle: "#4A2700",
    episodeNumber: "#d35400",
    episodeTitle: "#4A2700",
    statusBarGradient: ["rgba(254, 245, 231, 0.9)", "rgba(254, 245, 231, 0)"],
    goldsquare: {
      background: "rgba(230, 126, 34, 0.15)",
      shadow: "#d35400",
      shadowOpacity: 0.2,
    },
    goldsquareInner: {
      background: "rgba(230, 126, 34, 0.1)",
      shadow: "#d35400",
      shadowOpacity: 0.15,
    },
  },
}

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [theme, setTheme] = useState(themes.dark)

  useEffect(() => {
    loadThemePreference()
  }, [])

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("themeMode")
      if (savedTheme !== null) {
        const isDark = savedTheme === "dark"
        setIsDarkMode(isDark)
        setTheme(isDark ? themes.dark : themes.light)
      }
    } catch (error) {
      console.error("Error loading theme preference:", error)
    }
  }

  const toggleTheme = async () => {
    const newIsDarkMode = !isDarkMode
    setIsDarkMode(newIsDarkMode)
    setTheme(newIsDarkMode ? themes.dark : themes.light)
    try {
      await AsyncStorage.setItem("themeMode", newIsDarkMode ? "dark" : "light")
    } catch (error) {
      console.error("Error saving theme preference:", error)
    }
  }

  return <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

