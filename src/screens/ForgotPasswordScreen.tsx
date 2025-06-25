import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { theme } from '../theme';

export function ForgotPasswordScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      <Text>Aqui você irá construir o fluxo de recuperação de senha.</Text>
       <View style={styles.button}>
        <Button title="Voltar para o Login" onPress={() => navigation.goBack()} color={theme.colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  title: {
    fontSize: theme.fontSizes.heading,
    color: theme.colors.primary,
    marginBottom: theme.spacing.medium,
  },
  button: {
    marginTop: theme.spacing.large,
  }
});
