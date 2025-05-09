import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DownloadsScreen from '../screens/DownloadsScreen';
import DownloadsSettingsScreen from '../screens/DownloadsSettingsScreen';
import StorageSettingsScreen from '../screens/StorageSettingsScreen';

const Stack = createStackNavigator();

const DownloadsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DownloadsScreen" component={DownloadsScreen} />
      <Stack.Screen name="DownloadsSettings" component={DownloadsSettingsScreen} />
      <Stack.Screen name="StorageSettings" component={StorageSettingsScreen} />
    </Stack.Navigator>
  );
};

export default DownloadsStack; 