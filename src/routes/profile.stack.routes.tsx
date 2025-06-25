// src/routes/profile.stack.routes.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa todas as telas que fazem parte desta "pilha" de navegação
import { PerfilScreen } from '../screens/PerfilScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { FriendsScreen } from '../screens/FriendsScreen';

const { Navigator, Screen } = createNativeStackNavigator();

// Esta é a pilha de navegação exclusiva da aba Perfil.
// O React Navigation irá renderizar a primeira tela da lista ("ProfileMain") por padrão.
export function ProfileStackRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      {/* Tela principal da aba de Perfil */}
      <Screen 
        name="ProfileMain" 
        component={PerfilScreen} 
      />
      {/* Tela de Configurações, acedida a partir do ícone de engrenagem */}
      <Screen 
        name="Settings" 
        component={SettingsScreen} 
      />
      {/* Tela de Amigos, acedida a partir da estatística de amigos */}
      <Screen 
        name="Friends" 
        component={FriendsScreen} 
      />
    </Navigator>
  );
}
