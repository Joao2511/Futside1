// src/routes/profile.stack.routes.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PerfilScreen } from '../screens/PerfilScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const { Navigator, Screen } = createNativeStackNavigator();

// Esta é a pilha de navegação exclusiva da aba Perfil
export function ProfileStackRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      {/* A primeira tela da pilha é o próprio Perfil */}
      <Screen name="ProfileMain" component={PerfilScreen} />
      {/* A segunda tela é a de Configurações, para onde vamos navegar */}
      <Screen name="Settings" component={SettingsScreen} />
    </Navigator>
  );
}
