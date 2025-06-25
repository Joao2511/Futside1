// src/contexts/AuthContext.tsx

import React, { createContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

interface AuthContextData {
  user: object | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);

  async function signIn(email: string, password: string) {
    setLoading(true);
    
    // Simula uma chamada de API e validação
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    // Em uma aplicação real, aqui você chamaria sua API:
    // const response = await api.post('/login', { email, password });
    // if (response.data.token) { ... }

    if (email.includes('@') && password.length > 5) {
      setUser({ name: 'Jogador Teste', email: email });
    } else {
      Alert.alert('Erro no Login', 'Credenciais inválidas. Tente novamente.');
    }

    setLoading(false);
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
