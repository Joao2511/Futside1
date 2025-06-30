import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme'; // Importando nosso tema

// A navegação é injetada automaticamente pelo Stack Navigator
export function SignInScreen({ navigation }: { navigation: any }) {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha e-mail e senha.');
      return;
    }
    // A lógica de login agora é centralizada no nosso hook!
    // O hook se encarrega de tudo, inclusive da navegação após o sucesso.
    await signIn(email, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Usando a imagem que você especificou */}
        <Image
          source={require('../assets/logo2.png')}
          style={styles.logoWithText}
          resizeMode="contain"
        />
      </View>

      {/* Mensagem de boas-vindas estilizada */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Olá, <Text style={styles.welcomeTextHighlight}>Jogador!</Text>
        </Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="exemplo@email.com"
          placeholderTextColor={'#8F8F8F'} 
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={'#8F8F8F'} 
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <Text style={styles.loginButtonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotPassword}
        >
          <Text style={styles.linkText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>ou</Text>
          <View style={styles.separatorLine} />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')} // <--- Nome correto!
          style={styles.registerButton}
        >
          <Text style={styles.registerButtonText}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Estilos usando nosso objeto de tema para consistência
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 20, // Reduzi a margem para acomodar o texto de boas-vindas
  },
  logoWithText: { // Estilo para sua imagem real
    width: '100%',
    height: 250,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.large,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  welcomeTextHighlight: {
    color: theme.colors.primary, // Cor verde do tema
  },
  formContainer: {
    paddingHorizontal: theme.spacing.large,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    fontSize: theme.fontSizes.body,
    color: theme.colors.text,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.body,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: theme.spacing.medium,
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.large,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  separatorText: {
    marginHorizontal: theme.spacing.small,
    color: theme.colors.placeholder,
  },
  registerButton: {
    marginTop: theme.spacing.medium,
    alignItems: 'center',
  },
  registerButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.body,
    fontWeight: 'bold',
  },
});