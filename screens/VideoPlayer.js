import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  PanResponder,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const { width, height } = Dimensions.get('window');

const VideoPlayer = ({ route, navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { videoUrl, title, episodeTitle, nextEpisode, prevEpisode } = route.params;
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [lastTap, setLastTap] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showSeekIndicator, setShowSeekIndicator] = useState(false);
  const [seekAmount, setSeekAmount] = useState(0);
  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, []);

  const hideControls = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowControls(false));
    }, 3000);
  };

  const showControlsWithTimeout = () => {
    const now = Date.now();
    if (lastTap && (now - lastTap) < 300) {
      // Double tap detected, don't toggle controls
      return;
    }
    setLastTap(now);
    
    if (showControls) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowControls(false));
    } else {
      setShowControls(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      hideControls();
    }
  };

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNextEpisode = () => {
    if (nextEpisode) {
      navigation.replace('VideoPlayer', {
        videoUrl: nextEpisode.videoUrl,
        title: nextEpisode.title,
        episodeTitle: nextEpisode.episodeTitle,
        nextEpisode: nextEpisode.next,
        prevEpisode: nextEpisode.prev,
      });
    }
  };

  const handlePrevEpisode = () => {
    if (prevEpisode) {
      navigation.replace('VideoPlayer', {
        videoUrl: prevEpisode.videoUrl,
        title: prevEpisode.title,
        episodeTitle: prevEpisode.episodeTitle,
        nextEpisode: prevEpisode.next,
        prevEpisode: prevEpisode.prev,
      });
    }
  };

  const handleSeek = (value) => {
    if (videoRef.current) {
      videoRef.current.setPositionAsync(value * duration);
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.setVolumeAsync(value);
    }
  };

  const handleDoubleTap = (side) => {
    if (videoRef.current) {
      const currentPosition = position;
      const seekAmount = 10; // seconds
      const newPosition = side === 'left' 
        ? Math.max(0, currentPosition - seekAmount * 1000)
        : Math.min(duration, currentPosition + seekAmount * 1000);
      
      videoRef.current.setPositionAsync(newPosition);
      setShowSeekIndicator(true);
      setSeekAmount(side === 'left' ? -seekAmount : seekAmount);
      setTimeout(() => setShowSeekIndicator(false), 1000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar hidden />
      
      <TouchableWithoutFeedback onPress={showControlsWithTimeout}>
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: videoUrl }}
            style={styles.video}
            resizeMode="contain"
            shouldPlay={isPlaying}
            isLooping={false}
            volume={volume}
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded) {
                setPosition(status.positionMillis);
                setDuration(status.durationMillis);
              }
            }}
          />

          <View style={styles.doubleTapContainer}>
            <TouchableWithoutFeedback onPress={() => handleDoubleTap('left')}>
              <View style={styles.doubleTapArea} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => handleDoubleTap('right')}>
              <View style={styles.doubleTapArea} />
            </TouchableWithoutFeedback>
          </View>

          {showSeekIndicator && (
            <View style={styles.seekIndicator}>
              <Ionicons 
                name={seekAmount > 0 ? "play-forward" : "play-back"} 
                size={40} 
                color="#fff" 
              />
              <Text style={styles.seekText}>{Math.abs(seekAmount)}s</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>

      {showControls && (
        <Animated.View style={[styles.controls, { opacity: fadeAnim }]}>
          <BlurView intensity={30} tint={isDarkMode ? "dark" : "light"} style={styles.controlsBlur}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradient}
            >
              <View style={styles.topControls}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                  <Text style={styles.title} numberOfLines={1}>{title}</Text>
                  <Text style={styles.episodeTitle} numberOfLines={1}>{episodeTitle}</Text>
                </View>
                <TouchableOpacity onPress={() => setIsFullscreen(!isFullscreen)} style={styles.fullscreenButton}>
                  <Ionicons 
                    name={isFullscreen ? "contract" : "expand"} 
                    size={24} 
                    color="#fff" 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.bottomControls}>
                <View style={styles.progressContainer}>
                  <MultiSlider
                    values={[position / duration]}
                    sliderLength={width - 32}
                    onValuesChange={([value]) => {
                      setIsSeeking(true);
                      setPosition(value * duration);
                    }}
                    onValuesChangeFinish={([value]) => {
                      setIsSeeking(false);
                      handleSeek(value);
                    }}
                    min={0}
                    max={1}
                    step={0.001}
                    allowOverlap={false}
                    snapped
                    containerStyle={styles.sliderContainer}
                    trackStyle={styles.sliderTrack}
                    selectedStyle={styles.sliderSelected}
                    markerStyle={styles.sliderMarker}
                    pressedMarkerStyle={styles.sliderMarkerPressed}
                  />
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{formatTime(position / 1000)}</Text>
                    <Text style={styles.timeText}>{formatTime(duration / 1000)}</Text>
                  </View>
                </View>

                <View style={styles.controlsRow}>
                  <View style={styles.volumeContainer}>
                    <Ionicons name="volume-medium" size={24} color="#fff" />
                    <Slider
                      style={styles.volumeSlider}
                      minimumValue={0}
                      maximumValue={1}
                      value={volume}
                      onValueChange={handleVolumeChange}
                      minimumTrackTintColor="#fff"
                      maximumTrackTintColor="rgba(255,255,255,0.3)"
                      thumbTintColor="#fff"
                    />
                  </View>

                  <View style={styles.playbackControls}>
                    <TouchableOpacity 
                      style={styles.controlButton}
                      onPress={handlePrevEpisode}
                      disabled={!prevEpisode}
                    >
                      <Ionicons 
                        name="play-skip-back" 
                        size={24} 
                        color={prevEpisode ? "#fff" : "rgba(255,255,255,0.3)"} 
                      />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.playButton}
                      onPress={handlePlayPause}
                    >
                      <Ionicons 
                        name={isPlaying ? "pause" : "play"} 
                        size={32} 
                        color="#fff" 
                      />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.controlButton}
                      onPress={handleNextEpisode}
                      disabled={!nextEpisode}
                    >
                      <Ionicons 
                        name="play-skip-forward" 
                        size={24} 
                        color={nextEpisode ? "#fff" : "rgba(255,255,255,0.3)"} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  doubleTapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  doubleTapArea: {
    flex: 1,
  },
  seekIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  seekText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
  },
  controls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  controlsBlur: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 0,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  episodeTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  fullscreenButton: {
    padding: 8,
  },
  bottomControls: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  sliderContainer: {
    height: 40,
    paddingHorizontal: 16,
  },
  sliderTrack: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  sliderSelected: {
    backgroundColor: '#fff',
  },
  sliderMarker: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sliderMarkerPressed: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  volumeSlider: {
    flex: 1,
    marginLeft: 8,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    marginHorizontal: 16,
  },
});

export default VideoPlayer;