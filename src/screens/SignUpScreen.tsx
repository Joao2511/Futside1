// src/screens/SignUpScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../theme';

export function SignUpScreen({ navigation }: { navigation: any }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados para os checkboxes
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [wantsNewsletter, setWantsNewsletter] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !location) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    // Validação do checkbox de termos
    if (!agreedToTerms) {
        Alert.alert('Termos de Privacidade', 'Você precisa concordar com os termos de privacidade e segurança para continuar.');
        return;
    }

    setLoading(true);
    // Simula uma chamada de API para cadastro
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Em um app real, aqui você chamaria sua API
    // const response = await api.post('/register', { name, email, password, location, newsletter: wantsNewsletter });

    setLoading(false);
    Alert.alert('Sucesso!', 'Sua conta foi criada. Faça o login para continuar.');
    navigation.navigate('SignIn');
  };

  // Componente de checkbox customizado
  const CustomCheckbox = ({ label, value, onValueChange }: { label: string, value: boolean, onValueChange: () => void }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onValueChange}>
      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <Text style={styles.checkboxCheckmark}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Botão de Voltar com onPress para voltar à tela anterior (Login) */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
            <Text style={styles.title}>Crie sua Conta</Text>
            <Text style={styles.subtitle}>Complete seus dados para encontrar o próximo jogo!</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            placeholderTextColor={theme.colors.placeholder}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Seu melhor e-mail"
            placeholderTextColor={theme.colors.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Crie uma senha forte"
            placeholderTextColor={theme.colors.placeholder}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Sua cidade / bairro"
            placeholderTextColor={theme.colors.placeholder}
            value={location}
            onChangeText={setLocation}
          />

          {/* Checkboxes */}
          <View style={styles.checkboxSection}>
            <CustomCheckbox
                label="Eu concordo com os termos de privacidade e segurança."
                value={agreedToTerms}
                onValueChange={() => setAgreedToTerms(!agreedToTerms)}
            />
            <CustomCheckbox
                label="Eu quero receber e-mails sobre notícias e atualizações do FutSide."
                value={wantsNewsletter}
                onValueChange={() => setWantsNewsletter(!wantsNewsletter)}
            />
          </View>

          <TouchableOpacity 
            style={styles.signUpButton}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
                <ActivityIndicator color={theme.colors.white} />
            ) : (
                <Text style={styles.signUpButtonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn')}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>Já tem uma conta? <Text style={styles.loginLinkHighlight}>Faça Login</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    position: 'absolute',
    top: 40,      // Ajustado para descer um pouco
    left: 10,
    padding: 10,
    zIndex: 10,   // Garante que o botão fique sobre os outros elementos
  },
  backButtonText: {
      fontSize: 45, // Aumentado para a seta ficar maior
      color: theme.colors.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.large,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.large,
    paddingTop: 40, // Adiciona espaço no topo para não sobrepor o botão de voltar
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: 'center'
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    fontSize: theme.fontSizes.body,
    color: theme.colors.text,
  },
  checkboxSection: {
    marginBottom: theme.spacing.large,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.small,
    marginRight: theme.spacing.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
  },
  checkboxCheckmark: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  checkboxLabel: {
    flex: 1, 
    color: theme.colors.text,
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.body,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: theme.spacing.large,
  },
  loginLinkText: {
      color: theme.colors.text,
      fontSize: 14,
  },
  loginLinkHighlight: {
      color: theme.colors.primary,
      fontWeight: 'bold'
  }
});
