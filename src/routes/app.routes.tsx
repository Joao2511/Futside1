import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabRoutes } from './tab.routes';
// Remova a importação da CourtDetailScreen daqui
// import { CourtDetailScreen } from '../screens/CourtDetailScreen';
import { LocationDetailScreen } from '../screens/LocationDetailScreen';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen
          name="MainTabs"
          component={TabRoutes}
      />

      {/* Remova a tela CourtDetail daqui */}
      {/* <Screen
          name="CourtDetail"
          component={CourtDetailScreen}
          options={{ presentation: 'modal' }}
      /> */}
      <Screen
          name="LocationDetail"
          component={LocationDetailScreen}
      />
    </Navigator>
  );
}