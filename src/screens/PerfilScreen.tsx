// src/screens/PerfilScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useAuth } from '../hooks/useAuth';

// Componente para um item de estatística
const StatItem = ({ value, label }: { value: string | number, label: string }) => (
    <View style={styles.statItem}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

export function PerfilScreen() {
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            {/* 1. View amarela que servirá como fundo para a StatusBar */}
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <ImageBackground
                    source={{ uri: 'https://i.imgur.com/u8y4ThC.jpeg' }}
                    style={styles.banner}
                >
                    <View style={styles.bannerOverlay} />
                </ImageBackground>

                <View style={styles.contentArea}>
                    {/* 2. O botão de configurações agora está DENTRO da área de conteúdo */}
                    <View style={styles.headerRow}>
                        {/* Espaço em branco para alinhar o botão à direita */}
                        <View style={{ flex: 1 }} /> 
                        <TouchableOpacity 
                            style={styles.settingsButton}
                            onPress={() => navigation.navigate('Settings')}
                        >
                            <Icon name="settings" size={24} color={theme.colors.placeholder} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://i.imgur.com/4z1kL3A.png' }}
                            style={styles.avatar}
                        />
                    </View>

                    <Text style={styles.userName}>{(user as any)?.name || 'Jogador Teste'}</Text>
                    <Text style={styles.userPosition}>Atacante</Text>
                    <View style={styles.locationContainer}>
                        <Icon name="map-pin" size={16} color={theme.colors.placeholder} />
                        <Text style={styles.userLocation}>Brasília, DF</Text>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <StatItem value={48} label="PARTIDAS" />
                    <View style={styles.statsSeparator} />
                    <StatItem value={12} label="AMIGOS" />
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="user-plus" size={20} color={theme.colors.white} />
                        <Text style={styles.actionButtonText}>ADICIONAR AMIGO</Text>
                    </TouchableOpacity>
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
    banner: {
        height: 200,
        width: '100%',
    },
    bannerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    contentArea: {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        paddingTop: 80, // Mantém o espaço para o avatar
        alignItems: 'center',
    },
    headerRow: {
        width: '100%',
        position: 'absolute',
        top: 0,
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.large,
        paddingTop: theme.spacing.medium,
    },
    settingsButton: {
        padding: 5, // Aumenta a área de toque
    },
    avatarContainer: {
        // O avatar não é mais absoluto na tela inteira, mas sim relativo ao contentArea
        marginTop: -155, // -(altura do avatar / 2) - paddingTop do contentArea
        alignSelf: 'center',
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 5,
        borderColor: theme.colors.background,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 10,
    },
    userPosition: {
        fontSize: 16,
        color: theme.colors.placeholder,
        marginTop: 4,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.small,
    },
    userLocation: {
        fontSize: 14,
        color: theme.colors.placeholder,
        marginLeft: theme.spacing.small,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: theme.spacing.large,
        backgroundColor: theme.colors.background,
        marginTop: theme.spacing.large,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.placeholder,
        marginTop: 4,
    },
    statsSeparator: {
        width: 1,
        backgroundColor: theme.colors.surface,
    },
    buttonsContainer: {
        width: '100%',
        padding: theme.spacing.large,
        backgroundColor: theme.colors.background,
    },
    actionButton: {
        flexDirection: 'row',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.medium,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.medium,
    },
    actionButtonText: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: theme.spacing.medium,
    },
});
