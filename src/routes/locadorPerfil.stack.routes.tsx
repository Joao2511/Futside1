import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LocadorPerfilScreen } from '../screens/LocadorPerfilScreen';
import { LocadorSettingScreen } from '../screens/LocadorSettingScreen';

const { Navigator, Screen } = createNativeStackNavigator();

export function LocadorPerfilStackRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="LocadorPerfilMain" component={LocadorPerfilScreen} />
      <Screen name="LocadorSetting" component={LocadorSettingScreen} />
    </Navigator>
  );
}
