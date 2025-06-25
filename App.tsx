/**
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// 1. Importe o componente Toast
import Toast from 'react-native-toast-message';

import { AuthProvider } from './src/contexts/AuthContext';
import { Routes } from './src/routes';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <Routes />
          {/* 2. Adicione o componente Toast aqui. Ele ficará "invisível" até ser chamado. */}
          <Toast />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
