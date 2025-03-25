import { Asset } from 'expo-asset';

export const preloadAssets = async () => {
  try {
    // Preload static assets here
    // For example:
    // await Asset.loadAsync(require('../assets/images/logo.png'));
    
    console.log('All assets preloaded successfully');
  } catch (error) {
    console.error('Error preloading assets:', error);
  }
}; 