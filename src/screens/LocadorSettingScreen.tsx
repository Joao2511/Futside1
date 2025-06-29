// src/screens/LocadorSettingsScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Switch
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

// Componente reutilizável para cada opção da lista
const SettingsItem = ({ icon, label, onPress }: { icon: string, label: string, onPress?: () => void }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <Icon name={icon} size={22} color={theme.colors.text} />
        <Text style={styles.itemLabel}>{label}</Text>
        <Icon name="chevron-right" size={22} color={theme.colors.placeholder} />
    </TouchableOpacity>
);

export function LocadorSettingScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { signOut } = useAuth();
    const [wantsEmails, setWantsEmails] = useState(true);

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            {/* 1. View amarela que servirá como fundo para a StatusBar */}
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>CONFIGURAÇÕES</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Seção Minha Conta */}
                <Text style={styles.sectionTitle}>Minha Conta</Text>
                <View style={styles.sectionContainer}>
                    <SettingsItem icon="bell" label="Notificações" 
                    onPress={() => navigation.navigate('Notifications')}
                    />
                    <View style={styles.separator} />
                    <SettingsItem icon="lock" label="Alterar senha" 
                    onPress={() => navigation.navigate('ChangePassword')}
                    />
                </View>

                {/* Seção Suporte */}
                <Text style={styles.sectionTitle}>Suporte</Text>
                <View style={styles.sectionContainer}>
                    <SettingsItem icon="help-circle" label="Ajuda & Suporte" 
                    onPress={() => navigation.navigate('HelpAndSupport')}/>
                    <View style={styles.separator} />
                    <SettingsItem icon="info" label="Termos de Privacidade & Segurança" 
                    onPress={() => navigation.navigate('TermsAndPrivacy')}
                    />
                </View>

                {/* Seção Outros */}
                <Text style={styles.sectionTitle}>Outros</Text>
                <View style={styles.sectionContainer}>
                    <SettingsItem icon="briefcase" label="Se torne um Jogador" 
                    onPress={() => navigation.navigate('BecomeAManager')}/>
                </View>

                {/* Seção Ações */}
                <Text style={styles.sectionTitle}>Ações</Text>
                <View style={styles.sectionContainer}>
                    <SettingsItem icon="flag" label="Reportar um problema" 
                    onPress={() => navigation.navigate('ReportProblem')}
                    />
                    <View style={styles.separator} />
                    <SettingsItem icon="log-out" label="Sair" onPress={signOut} />
                </View>

                {/* Checkbox de E-mails */}
                <View style={styles.emailOptionContainer}>
                    <Text style={styles.emailLabel}>Eu quero receber emails sobre notícias e atualizações do FutSide.</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: theme.colors.primary }}
                        thumbColor={theme.colors.white}
                        onValueChange={() => setWantsEmails(previousState => !previousState)}
                        value={wantsEmails}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.large,
        backgroundColor: theme.colors.background,
    },
    backButton: {
        position: 'absolute',
        left: theme.spacing.large,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    scrollContainer: {
        padding: theme.spacing.large,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 16,
        color: theme.colors.placeholder,
        fontWeight: 'bold',
        marginBottom: theme.spacing.small,
    },
    sectionContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.medium,
        marginBottom: theme.spacing.large,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.medium,
    },
    itemLabel: {
        flex: 1,
        marginLeft: theme.spacing.medium,
        fontSize: 16,
        color: theme.colors.text,
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginLeft: theme.spacing.medium * 2 + 22, // Alinha com o texto
    },
    emailOptionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.medium,
        paddingHorizontal: theme.spacing.small,
    },
    emailLabel: {
        flex: 1,
        color: theme.colors.text,
        marginRight: theme.spacing.medium,
    },
});
