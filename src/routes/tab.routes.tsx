// src/routes/tab.routes.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import { HomeScreen } from '../screens/HomeScreen';
import { MapaScreen } from '../screens/MapaScreen';
import { LocacaoScreen } from '../screens/LocacaoScreen';
import { ProfileStackRoutes } from './profile.stack.routes';
import { PartidasStackRoutes } from './partidas.stack.routes'; // Importa a nova pilha
import { theme } from '../theme';

const { Navigator, Screen } = createBottomTabNavigator();

const CustomMapButton = ({ children, onPress }: { children: any, onPress: any }) => (
    <TouchableOpacity
        style={styles.mapButtonContainer}
        onPress={onPress}
    >
        <View style={styles.mapButton}>
            {children}
        </View>
    </TouchableOpacity>
);

export function TabRoutes() {
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
            name="Home"
            component={HomeScreen}
            options={{
                tabBarLabel: 'Início',
                tabBarIcon: ({ color, size }) => (<Icon name="home" color={color} size={size} />),
            }}
        />
        <Screen
            name="PartidasStack" // A aba agora aponta para a pilha
            component={PartidasStackRoutes}
            options={{
                tabBarLabel: 'Partidas',
                tabBarIcon: ({ color, size }) => (<Icon name="shield" color={color} size={size} />),
            }}
        />
        <Screen
            name="Mapa"
            component={MapaScreen}
            options={{
                tabBarLabel: '',
                tabBarButton: (props) => (
                    <CustomMapButton {...props}>
                        <Icon name="map" color={theme.colors.primary} size={30} />
                    </CustomMapButton>
                )
            }}
        />
        <Screen
            name="Locação"
            component={LocacaoScreen}
            options={{
                tabBarLabel: 'Locação',
                tabBarIcon: ({ color, size }) => (<Icon name="calendar" color={color} size={size} />),
            }}
        />
        <Screen
            name="Perfil"
            component={ProfileStackRoutes}
            options={{
                tabBarLabel: 'Perfil',
                tabBarIcon: ({ color, size }) => (<Icon name="user" color={color} size={size} />),
            }}
        />
    </Navigator>
  );
}

const styles = StyleSheet.create({
    mapButtonContainer: {
        top: -25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: theme.colors.yellow,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
});
