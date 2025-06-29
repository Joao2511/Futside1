import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';

import { LocadorHomeScreen } from '../screens/LocadorHomeScreen.tsx';
import { MinhasQuadrasScreen } from '../screens/MinhasQuadrasScreen.tsx';
import { LocadorLocacaoScreen } from '../screens/LocadorLocacaoScreen.tsx';
import { LocadorPerfilStackRoutes } from './locadorPerfil.stack.routes';

const { Navigator, Screen } = createBottomTabNavigator();

export function LocadorTabRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.colors.yellow || '#FDB813',
        tabBarInactiveTintColor: theme.colors.white,
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Screen
        name="LocadorHome"
        component={LocadorHomeScreen}
        options={{
          tabBarLabel: 'HOME',
          tabBarIcon: ({ color, size }) => (<Icon name="home" color={color} size={size} />),
        }}
      />
      <Screen
        name="MinhasQuadras"
        component={MinhasQuadrasScreen}
        options={{
          tabBarLabel: 'QUADRAS',
          tabBarIcon: ({ color, size }) => (<Icon name="grid" color={color} size={size} />),
        }}
      />
      <Screen
        name="LocadorLocacao"
        component={LocadorLocacaoScreen}
        options={{
          tabBarLabel: 'LOCAÇÃO',
          tabBarIcon: ({ color, size }) => (<Icon name="calendar" color={color} size={size} />),
        }}
      />
      <Screen
        name="LocadorPerfil"
        component={LocadorPerfilStackRoutes}
        options={{
          tabBarLabel: 'PERFIL',
          tabBarIcon: ({ color, size }) => (<Icon name="user" color={color} size={size} />),
        }}
      />

    </Navigator>
  );
}
