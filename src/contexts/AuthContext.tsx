import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import * as api from '../services/api';

interface AuthContextData {
  user: api.PublicProfileResponse | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
  signUp(payload: api.UserCreatePayload): Promise<boolean>;
  role: 'player' | 'manager' | null;
  setRole: (role: 'player' | 'manager') => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<api.PublicProfileResponse | null>(null);
  const [role, setRole] = useState<'player' | 'manager' | null>('player');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      const storagedToken = await AsyncStorage.getItem('user_token');
      if (storagedToken) {
        try {
          const profile = await api.getMyProfile();
          setUser(profile);
        } catch (error) {
          console.error("Sessão inválida:", error);
          await api.logout();
        }
      }
      setLoading(false);
    }
    loadStoragedData();
  }, []);

  async function signIn(email: string, password: string) {
    setLoading(true);
    try {
      await api.login(email, password);
      const profile = await api.getMyProfile();
      setUser(profile);
      setRole('player');
      const fcmToken = await messaging().getToken();
      if (fcmToken) await api.registerFcmToken(fcmToken);
    } catch (error) {
      console.error(error);
      Alert.alert('Falha no Login', 'Não foi possível entrar. Verifique o seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  }

  // ATUALIZADO: signUp agora faz uma única chamada à API
  async function signUp(payload: api.UserCreatePayload): Promise<boolean> {
    setLoading(true);
    try {
      // 1. Cria o utilizador E obtém o token de volta
      await api.createUser(payload);

      // 2. Com o token já salvo pela função da API, busca o perfil
      const profile = await api.getMyProfile();
      setUser(profile);
      setRole('player');

      // 3. Tenta registrar o token FCM
      const fcmToken = await messaging().getToken();
      if (fcmToken) await api.registerFcmToken(fcmToken);
      
      return true;

    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Não foi possível criar a conta. Tente novamente.';
      Alert.alert('Falha no Cadastro', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await api.logout();
    setUser(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}