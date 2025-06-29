import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useAuth } from '../hooks/useAuth';

export function RoleSelectionScreen() {
  const insets = useSafeAreaInsets();
  const { setRole } = useAuth();

  const handleSelect = (role: 'player' | 'manager') => {
    setRole(role);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={{ height: insets.top }} />
      <View style={styles.content}>
        <Image source={require('../assets/logo2.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Como você deseja continuar?</Text>

        <TouchableOpacity style={styles.option} onPress={() => handleSelect('player')}>
          <Icon name="user" size={32} color={theme.colors.primary} />
          <Text style={styles.optionText}>Entrar como Jogador</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => handleSelect('manager')}>
          <Icon name="briefcase" size={32} color={theme.colors.primary} />
          <Text style={styles.optionText}>Entrar como Locador</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    alignItems: 'center',
    padding: theme.spacing.large
  },
  logo: {
    height: 120,
    marginBottom: theme.spacing.large
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.large
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    width: '100%',
    marginBottom: theme.spacing.medium
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginLeft: theme.spacing.medium
  }
});
