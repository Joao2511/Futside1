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

// Componente de Estatística (reutilizado)
const StatItem = ({ value, label, onPress }: { value: string | number, label: string, onPress?: () => void }) => (
    <TouchableOpacity onPress={onPress} disabled={!onPress} style={styles.statItem}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
);

export function LocadorPerfilScreen() {
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
            {/* O fundo da status bar agora é branco para esta tela */}
            <View style={{ height: insets.top, backgroundColor: theme.colors.background }} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1558507652-29952b2553e8?q=80&w=1887&auto=format&fit=crop' }}
                    style={styles.banner}
                >
                    <View style={styles.bannerOverlay} />
                </ImageBackground>

                <View style={styles.contentArea}>
                    <View style={styles.headerRow}>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity 
                            style={styles.settingsButton}
                            onPress={() => navigation.navigate('LocadorSetting')}
                        >
                            <Icon name="settings" size={24} color={theme.colors.placeholder} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://avatar.iran.liara.run/public/boy?username=Gestor' }}
                            style={styles.avatar}
                        />
                    </View>

                    <Text style={styles.userName}>{(user as any)?.name || 'Gestor'}</Text>
                    <Text style={styles.userPosition}>Gestor</Text>
                    <View style={styles.locationContainer}>
                        <Icon name="map-pin" size={16} color={theme.colors.placeholder} />
                        <Text style={styles.userLocation}>Goiânia, Goiás</Text>
                    </View>
                </View>

                {/* Estatísticas do Gestor */}
                <View style={styles.statsContainer}>
                    <StatItem value={8} label="Quadras" onPress={() => navigation.navigate('MyCourts')} />
                    <View style={styles.statsSeparator} />
                    <View style={styles.statItem}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                           <Text style={styles.statValue}>5.0</Text>
                           <Icon name="star" size={18} color={theme.colors.primary} style={{marginLeft: 4, marginTop: 4}}/>
                        </View>
                        <Text style={styles.statLabel}>AVALIAÇÃO</Text>
                    </View>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Editar Perfil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: theme.colors.surface}]}>
                        <Text style={[styles.actionButtonText, {color: theme.colors.primary}]}>Adicionar Amigos</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.galleryTitle}>Fotos</Text>
                {/* Aqui viria uma galeria de fotos */}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    banner: { height: 200, width: '100%' },
    bannerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)' },
    contentArea: { backgroundColor: theme.colors.background, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -80, paddingTop: 80, alignItems: 'center' },
    headerRow: { width: '100%', position: 'absolute', top: 0, padding: theme.spacing.medium, alignItems: 'flex-end'},
    settingsButton: { padding: 5 },
    avatarContainer: { marginTop: -155, alignSelf: 'center' },
    avatar: { width: 150, height: 150, borderRadius: 75, borderWidth: 5, borderColor: theme.colors.background },
    userName: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginTop: 10 },
    userPosition: { fontSize: 16, color: theme.colors.placeholder, marginTop: 4 },
    locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.small },
    userLocation: { fontSize: 14, color: theme.colors.placeholder, marginLeft: theme.spacing.small },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingVertical: theme.spacing.large, backgroundColor: theme.colors.background, marginTop: theme.spacing.large, borderTopWidth: 1, borderBottomWidth: 1, borderColor: theme.colors.surface},
    statItem: { alignItems: 'center', paddingHorizontal: 20 },
    statValue: { fontSize: 22, fontWeight: 'bold', color: theme.colors.primary },
    statLabel: { fontSize: 12, color: theme.colors.placeholder, marginTop: 4, textTransform: 'uppercase' },
    statsSeparator: { width: 1, backgroundColor: theme.colors.surface, marginVertical: -theme.spacing.large },
    buttonsContainer: { flexDirection: 'row', width: '100%', padding: theme.spacing.large, justifyContent: 'space-between', gap: theme.spacing.medium },
    actionButton: { flex: 1, backgroundColor: theme.colors.primary, borderRadius: theme.radius.medium, paddingVertical: 15, alignItems: 'center' },
    actionButtonText: { color: theme.colors.white, fontWeight: 'bold', fontSize: 16 },
    galleryTitle: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: theme.spacing.large, marginBottom: theme.spacing.medium },
});
