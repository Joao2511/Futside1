import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useAuth } from '../hooks/useAuth';

export function RoleSelectionScreen() {
    const insets = useSafeAreaInsets();
    const { setRole } = useAuth();

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <View style={styles.content}>
                <Image source={require('../assets/logo2.png')} style={styles.logo} resizeMode="contain" />
                <Text style={styles.title}>Como você quer entrar?</Text>
                <Text style={styles.subtitle}>Escolha seu perfil para continuar.</Text>

                <View style={styles.optionsContainer}>
                    <TouchableOpacity style={styles.optionButton} onPress={() => setRole('player')}>
                        <Icon name="user" size={40} color={theme.colors.primary} />
                        <Text style={styles.optionText}>Entrar como Jogador</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={() => setRole('manager')}>
                        <Icon name="briefcase" size={40} color={theme.colors.primary} />
                        <Text style={styles.optionText}>Entrar como Locador</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.large },
    logo: { height: 100, marginBottom: theme.spacing.large * 2 },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, textAlign: 'center' },
    subtitle: { fontSize: 16, color: theme.colors.placeholder, textAlign: 'center', marginBottom: theme.spacing.large * 2 },
    optionsContainer: { width: '100%' },
    optionButton: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.medium, padding: theme.spacing.large, width: '100%', alignItems: 'center', marginBottom: theme.spacing.large, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    optionText: { fontSize: 18, fontWeight: 'bold', color: theme.colors.primary, marginTop: theme.spacing.medium },
});
