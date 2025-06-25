// src/routes/app.routes.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Importar o nosso novo navegador de abas
import { TabRoutes } from './tab.routes';
// 2. Importar a nossa tela modal
import { CourtDetailScreen } from '../screens/CourtDetailScreen';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    // 3. O navegador principal agora é uma Pilha (Stack)
    <Navigator screenOptions={{ headerShown: false }}>
        {/* 4. A primeira tela da pilha é o nosso conjunto de abas */}
        <Screen 
            name="MainTabs"
            component={TabRoutes}
        />

        {/* 5. A segunda tela é o nosso modal, que abrirá por cima de tudo */}
        <Screen 
            name="CourtDetail"
            component={CourtDetailScreen}
            options={{ presentation: 'modal' }}
        />
    </Navigator>
  );
}
