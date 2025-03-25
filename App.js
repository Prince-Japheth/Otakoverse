import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { ThemeProvider } from './context/ThemeContext';
import AppNavigator from './navigation/AppNavigator';
import { preloadAssets } from './utils/preloadAssets';

export default function App() {
  useEffect(() => {
    preloadAssets();
  }, []);

  return (
    <ThemeProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000'}}>
        <AppNavigator />
      </SafeAreaView>
    </ThemeProvider>
  );
}
