"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, Image, StatusBar, Easing } from "react-native"
import { useTheme } from "../context/ThemeContext"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { AnimatedButton } from "../components/AnimatedButton"

const { width, height } = Dimensions.get("window")

const slides = [
  {
    id: "1",
    title: "Discover Anime",
    description: "Explore the latest and greatest anime series from Japan",
    image: require("../assets/OnboardingOne.jpg"),
    icon: "compass-outline",
  },
  {
    id: "2", 
    title: "Track Your Favorites",
    description: "Keep track of what you're watching and discover new shows",
    image: require("../assets/OnboardingTwo.jpg"),
    icon: "heart-outline",
  },
  {
    id: "3",
    title: "Watch Offline",
    description: "Download episodes to watch on the go without internet",
    image: require("../assets/OnboardingThree.jpg"),
    icon: "download-outline",
  },
]

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

export default function OnboardingScreen({ navigation }) {
  const { theme } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)
  const [direction, setDirection] = useState("forward")
  const fadeAnim = useRef(new Animated.Value(1)).current
  const imageOpacity = useRef(new Animated.Value(1)).current
  const backButtonAnim = useRef(new Animated.Value(0)).current
  const [isAnimating, setIsAnimating] = useState(false)
  const nextButtonScale = useRef(new Animated.Value(1)).current
  const backButtonScale = useRef(new Animated.Value(1)).current

  // Refs to store the current and target images
  const currentImageRef = useRef(slides[0].image)
  const targetImageRef = useRef(slides[0].image)

  // Preload all images to avoid flashing - using React Native's approach
  useEffect(() => {
    // Function to preload images using Image.prefetch for remote images
    const preloadImages = async () => {
      try {
        const imagePromises = slides.map((slide) => {
          if (slide.image && slide.image.uri) {
            return Image.prefetch(slide.image.uri)
          }
          return Promise.resolve()
        })

        await Promise.all(imagePromises)
        console.log("All images preloaded successfully")
      } catch (error) {
        console.error("Error preloading images:", error)
      }
    }

    preloadImages()
  }, [])

  useEffect(() => {
    if (currentIndex > 0) {
      Animated.spring(backButtonAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.spring(backButtonAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start()
    }
  }, [currentIndex])

  const animateSlide = (isForward) => {
    if (isAnimating) return
    setIsAnimating(true)

    const nextIndex = isForward
      ? currentIndex + 1 < slides.length
        ? currentIndex + 1
        : currentIndex
      : currentIndex - 1 >= 0
        ? currentIndex - 1
        : currentIndex

    // Update image references
    currentImageRef.current = slides[currentIndex].image
    targetImageRef.current = slides[nextIndex].image

    // Reset image opacity to 1 for the transition
    imageOpacity.setValue(1)

    // Parallel animations for smoother transition
    Animated.parallel([
      // Fade out current content
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      // Crossfade images
      Animated.timing(imageOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start(() => {
      // Update state
      setPrevIndex(currentIndex)
      setCurrentIndex(nextIndex)
      setDirection(isForward ? "forward" : "backward")

      // Fade in new content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }).start(() => {
        setIsAnimating(false)
      })
    })
  }

  const animatePress = (scaleAnim, onPressAction) => {
    Animated.sequence([
      // Press down
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        duration: 150,
        useNativeDriver: true,
        tension: 100,
        friction: 5,
      }),
      // Release and slightly overshoot
      Animated.spring(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        tension: 100,
        friction: 7,
      }),
    ]).start()

    // Trigger the action slightly after the press animation starts
    setTimeout(onPressAction, 50)
  }

  const nextSlide = () => {
    if (currentIndex < slides.length - 1 && !isAnimating) {
      animateSlide(true)
    } else if (currentIndex === slides.length - 1) {
      // Navigate to Auth screen when finished
      navigation.navigate('Auth')
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0 && !isAnimating) {
      animateSlide(false)
    }
  }

  const renderSlide = () => {
    const currentItem = slides[currentIndex]

    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          {/* Current Image (fading out) */}
        <Animated.View
          style={[
              styles.imageWrapper,
            {
                opacity: imageOpacity,
            },
          ]}
        >
            <Image source={currentImageRef.current} style={styles.image} resizeMode="cover" />
          <LinearGradient
              colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]}
              style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
          />
        </Animated.View>
        
          {/* Next Image (fading in) */}
          <Animated.View
            style={[
              styles.imageWrapper,
              {
                opacity: imageOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
              },
            ]}
          >
            <Image source={targetImageRef.current} style={styles.image} resizeMode="cover" />
              <LinearGradient
              colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]}
              style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
            />
          </Animated.View>

          <LinearGradient colors={["transparent", "rgba(0,0,0,1)"]} style={styles.gradient} />
        </View>

        <Animated.View
          style={[
            styles.contentWrapper,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.iconWrapper}>
            <LinearGradient colors={theme.gradient} style={styles.iconBackground}>
              <Ionicons name={currentItem.icon} size={28} color="#fff" />
            </LinearGradient>
          </View>

          <Text style={styles.title}>{currentItem.title}</Text>
          <Text style={styles.description}>{currentItem.description}</Text>
        </Animated.View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {renderSlide()}
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View key={index} style={styles.paginationIndicator}>
              <View style={styles.paginationDot}>
                <LinearGradient
                  colors={currentIndex === index ? theme.gradient : ["rgba(255,255,255,0.5)", "rgba(255,255,255,0.5)"]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
          ))}
        </View>
        
        <View style={[styles.buttonContainer, currentIndex === 0 && styles.buttonContainerFirstSlide]}>
          <Animated.View
            style={[
              styles.backButtonContainer,
              {
                transform: [
                  { scale: backButtonAnim },
                  {
                    translateX: backButtonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [60, 0],
                    }),
                  },
                ],
                opacity: backButtonAnim,
                zIndex: currentIndex === 0 ? -1 : 1,
                display: currentIndex === 0 ? "none" : "flex",
              },
            ]}
          >
            <AnimatedButton
              onPress={prevSlide}
              style={[styles.button, styles.backButton]}
              gradientColors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.2)"]}
              isBlurred={true}
              disabled={currentIndex === 0}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Back</Text>
            </AnimatedButton>
          </Animated.View>

          <AnimatedButton
            onPress={nextSlide}
            style={[styles.button, styles.nextButton, currentIndex === 0 && styles.nextButtonFullWidth]}
            gradientColors={theme.gradient}
          >
            <Text style={styles.buttonText}>{currentIndex === slides.length - 1 ? "Get Started" : "Next"}</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
          </AnimatedButton>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  slide: {
    width,
    height,
  },
  imageContainer: {
    position: "absolute",
    width,
    height,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  imageWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.7,
  },
  contentWrapper: {
    position: "absolute",
    bottom: 180,
    left: 40,
    right: 40,
  },
  contentContainer: {
    width: "100%",
  },
  iconWrapper: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 26,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 50,
    paddingHorizontal: 40,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  paginationIndicator: {
    width: 32,
    height: 4,
    marginHorizontal: 4,
    position: "relative",
  },
  paginationDot: {
    width: "100%",
    height: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    height: 60,
    gap: 16,
  },
  buttonContainerFirstSlide: {
    justifyContent: "flex-end",
  },
  backButtonContainer: {
    position: "relative",
    width: 120,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
  },
  button: {
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
  },
  backButton: {
    width: "100%",
  },
  nextButton: {
    width: 200,
  },
  nextButtonFullWidth: {
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 8,
  },
  buttonIcon: {
    marginHorizontal: 4,
  },
})

