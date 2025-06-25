/**
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// 1. Importar o SafeAreaProvider
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/contexts/AuthContext';
import { Routes } from './src/routes';

function App(): React.JSX.Element {
  return (
    // 2. Envolver tudo com o SafeAreaProvider
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
