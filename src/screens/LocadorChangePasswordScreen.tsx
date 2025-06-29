// src/screens/LocadorChangePasswordScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, TextInput, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

export function LocadorChangePasswordScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ALTERAR SENHA</Text>
                <View style={{width: 30}} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Senha Atual</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        secureTextEntry={!showCurrent}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Digite sua senha atual"
                    />
                    <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeIcon}>
                        <Icon name={showCurrent ? 'eye' : 'eye-off'} size={22} color={theme.colors.placeholder} />
                    </TouchableOpacity>
                </View>
                
                <Text style={styles.label}>Nova Senha</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        secureTextEntry={!showNew}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Digite sua nova senha"
                    />
                    <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeIcon}>
                        <Icon name={showNew ? 'eye' : 'eye-off'} size={22} color={theme.colors.placeholder} />
                    </TouchableOpacity>
                </View>
                
                <Text style={styles.label}>Confirmar Nova Senha</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        secureTextEntry={!showNew}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirme sua nova senha"
                    />
                    <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeIcon}>
                        <Icon name={showNew ? 'eye' : 'eye-off'} size={22} color={theme.colors.placeholder} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: theme.spacing.medium, paddingHorizontal: theme.spacing.medium, borderBottomWidth: 1, borderBottomColor: theme.colors.surface },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
    content: { padding: theme.spacing.large },
    label: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.small },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radius.medium, marginBottom: theme.spacing.large, },
    input: { flex: 1, height: 50, paddingHorizontal: theme.spacing.medium, fontSize: 16 },
    eyeIcon: { padding: theme.spacing.medium },
    saveButton: { backgroundColor: theme.colors.primary, padding: theme.spacing.medium, borderRadius: theme.radius.medium, alignItems: 'center', marginTop: theme.spacing.large },
    saveButtonText: { color: theme.colors.white, fontWeight: 'bold', fontSize: 16 },
});
