import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';

import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';

export function Routes() {
  const { user, loading } = useAuth();

  // Se você tiver uma lógica de carregamento inicial (ex: buscando token no AsyncStorage),
  // pode mostrar um spinner.
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Se existe um usuário, mostra as rotas do app, senão, as rotas de auth.
  return user ? <AppRoutes /> : <AuthRoutes />;
}
