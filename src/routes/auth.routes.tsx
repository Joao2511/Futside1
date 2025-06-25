// src/routes/auth.routes.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SignInScreen } from '../screens/SignInScreen';
// --- Certifique-se de importar a nova tela ---
import { SignUpScreen } from '../screens/SignUpScreen'; 
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';

const { Navigator, Screen } = createNativeStackNavigator();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="SignIn" component={SignInScreen} />
      {/* --- Adicione esta linha para registrar a rota --- */}
      <Screen name="SignUp" component={SignUpScreen} /> 
      <Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Navigator>
  );
}