import React, { createContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

interface AuthContextData {
  user: object | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
  role: 'player' | 'manager' | null;
  setRole: (role: 'player' | 'manager') => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<object | null>(null);
  const [role, setRole] = useState<'player' | 'manager' | null>(null);
  const [loading, setLoading] = useState(false);

  async function signIn(email: string, password: string) {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (email.includes('@') && password.length > 5) {
      setUser({ name: 'Jogador Teste', email });
    } else {
      Alert.alert('Erro no Login', 'Credenciais inválidas. Tente novamente.');
    }
    setLoading(false);
  }

  function signOut() {
    setUser(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}
