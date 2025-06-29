import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { RoleSelectionScreen } from '../screens/RoleSelectionScreen';
import { TabRoutes } from './tab.routes';
import { LocadorTabRoutes } from './locador.tab.routes';

const Stack = createNativeStackNavigator();

export function AppRoutes() {
  const { role } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!role && <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />}
      {role === 'player' && <Stack.Screen name="MainTabs" component={TabRoutes} />}
      {role === 'manager' && <Stack.Screen name="LocadorTabs" component={LocadorTabRoutes} />}
    </Stack.Navigator>
  );
}
