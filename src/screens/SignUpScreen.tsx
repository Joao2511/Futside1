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
import { useAuth } from '../hooks/useAuth';

export function SignUpScreen({ navigation }: { navigation: any }) {
  const { signUp, loading } = useAuth(); // Agora usamos o 'loading' do contexto
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const brasiliaRegions = ['Asa Sul', 'Asa Norte', 'Águas Claras'];

  const handleSignUp = async () => {
    if (!name || !email || !password || !region) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos, incluindo a região.');
      return;
    }
    if (!agreedToTerms) {
      Alert.alert('Termos de Privacidade', 'Você precisa concordar com os termos para continuar.');
      return;
    }
    
    // A função signUp agora trata do loading, dos alertas e do login automático.
    // Se for bem-sucedida, o AuthProvider mudará o estado do 'user',
    // e o seu router (em Routes/index.tsx) deve automaticamente levar
    // o utilizador para a tela principal do app.
    await signUp({
      name,
      email,
      password,
      phone,
      city: region,
    });
  };

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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
            <Text style={styles.title}>Crie sua Conta</Text>
            <Text style={styles.subtitle}>Complete seus dados para encontrar o próximo jogo!</Text>
        </View>
        <View style={styles.formContainer}>
          <TextInput style={styles.input} placeholder="Nome Completo" value={name} onChangeText={setName} placeholderTextColor={'#8F8F8F'} />
          <TextInput style={styles.input} placeholder="Seu melhor e-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} placeholderTextColor={'#8F8F8F'} />
          <TextInput style={styles.input} placeholder="Crie uma senha forte" secureTextEntry value={password} onChangeText={setPassword} placeholderTextColor={'#8F8F8F'} />
          <TextInput style={styles.input} placeholder="Telefone (Opcional)" keyboardType="phone-pad" value={phone} onChangeText={setPhone} placeholderTextColor={'#8F8F8F'} />
          
          <Text style={styles.regionTitle}>Selecione sua Região Principal</Text>
          <View style={styles.regionSelector}>
            {brasiliaRegions.map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.regionButton, region === r && styles.regionButtonSelected]}
                onPress={() => setRegion(r)}
              >
                <Text style={[styles.regionButtonText, region === r && styles.regionButtonTextSelected]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.checkboxSection}>
            <CustomCheckbox label="Eu concordo com os termos de privacidade e segurança." value={agreedToTerms} onValueChange={() => setAgreedToTerms(!agreedToTerms)} />
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={loading}>
            {loading ? <ActivityIndicator color={theme.colors.white} /> : <Text style={styles.signUpButtonText}>Cadastrar</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  backButton: { position: 'absolute', top: 40, left: 10, padding: 10, zIndex: 10 },
  backButtonText: { fontSize: 45, color: theme.colors.primary },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: theme.spacing.large },
  headerContainer: { alignItems: 'center', marginBottom: theme.spacing.large, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.small },
  subtitle: { fontSize: 16, color: theme.colors.placeholder, textAlign: 'center' },
  formContainer: { width: '100%' },
  input: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.medium, padding: theme.spacing.medium, marginBottom: theme.spacing.medium, fontSize: theme.fontSizes.body, color: theme.colors.text },
  regionTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: theme.spacing.medium },
  regionSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.large },
  regionButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.primary },
  regionButtonSelected: { backgroundColor: theme.colors.primary },
  regionButtonText: { color: theme.colors.primary, fontWeight: 'bold' },
  regionButtonTextSelected: { color: theme.colors.white },
  checkboxSection: { marginBottom: theme.spacing.large },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.medium },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: theme.colors.primary, borderRadius: theme.radius.small, marginRight: theme.spacing.medium, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: theme.colors.primary },
  checkboxCheckmark: { color: theme.colors.white, fontWeight: 'bold', fontSize: 12 },
  checkboxLabel: { flex: 1, color: theme.colors.text, fontSize: 14 },
  signUpButton: { backgroundColor: theme.colors.primary, padding: theme.spacing.medium, borderRadius: theme.radius.medium, alignItems: 'center' },
  signUpButtonText: { color: theme.colors.white, fontSize: theme.fontSizes.body, fontWeight: 'bold' }
});