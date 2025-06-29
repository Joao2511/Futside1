// src/screens/LocadorHomeScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
    ImageBackground
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

export function LocadorHomeScreen() {
    const insets = useSafeAreaInsets();
    const { user, switchUserType } = useAuth();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Image
                        source={require('../assets/logo2.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                
                <View style={styles.welcomeSection}>
                     <Text style={styles.welcomeText}>
                        Bem-vindo, <Text style={styles.welcomeName}>{user?.name || 'Gestor'}.</Text>
                    </Text>
                </View>

                {/* Card de Locação */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>LOCAÇÃO</Text>
                    <TouchableOpacity>
                        <ImageBackground
                            source={{ uri: 'https://images.unsplash.com/photo-1599422484263-549b73a21534?w=800' }}
                            style={styles.actionCard}
                            imageStyle={{ borderRadius: theme.radius.medium }}
                        >
                            <View style={styles.cardOverlay} />
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <Icon name="arrow-right-circle" size={18} color={theme.colors.white} />
                                    <Text style={styles.cardHeaderText}>REGISTRAR SUA QUADRA</Text>
                                </View>
                                <Text style={styles.cardTitle}>FAÇA SUA LOCAÇÃO</Text>
                                <View style={styles.tag}>
                                    <Icon name="dribbble" size={14} color={theme.colors.text} />
                                    <Text style={styles.tagText}>Football</Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

                {/* Card Minhas Quadras */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>MINHAS QUADRAS</Text>
                    <TouchableOpacity>
                        <ImageBackground
                            source={{ uri: 'https://images.unsplash.com/photo-1558507652-29952b2553e8?q=80&w=1887&auto=format&fit=crop' }}
                            style={styles.actionCard}
                            imageStyle={{ borderRadius: theme.radius.medium }}
                        >
                            <View style={styles.cardOverlay} />
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <Icon name="arrow-right-circle" size={18} color={theme.colors.white} />
                                    <Text style={styles.cardHeaderText}>VER SUAS QUADRAS</Text>
                                </View>
                                <Text style={styles.cardTitle}>MINHAS QUADRAS</Text>
                            </View>
                        </ImageBackground>
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
    scrollContent: {
        paddingBottom: 90,
    },
    header: {
        alignItems: 'center',
        padding: theme.spacing.large,
    },
    logo: {
        height: 60,
        width: '60%',
    },
    welcomeSection: {
        paddingHorizontal: theme.spacing.large,
        marginBottom: theme.spacing.medium,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    welcomeName: {
        color: theme.colors.primary,
    },
    section: {
        paddingHorizontal: theme.spacing.large,
        marginBottom: theme.spacing.large,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.medium,
        textTransform: 'uppercase',
    },
    actionCard: {
        height: 180,
        borderRadius: theme.radius.medium,
        justifyContent: 'space-between',
        backgroundColor: theme.colors.primary,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 80, 0, 0.4)',
    },
    cardContent: {
        padding: theme.spacing.medium,
        justifyContent: 'space-between',
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardHeaderText: {
        color: theme.colors.white,
        marginLeft: theme.spacing.small,
        fontWeight: 'bold',
        opacity: 0.9,
        fontSize: 12,
        textTransform: 'uppercase',
    },
    cardTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.white,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    tag: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        alignItems: 'center',
    },
    tagText: {
        color: theme.colors.text,
        marginLeft: theme.spacing.small,
        fontWeight: 'bold',
        fontSize: 12,
    },
    switchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: theme.spacing.large,
        marginTop: theme.spacing.small,
        padding: theme.spacing.medium,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.medium,
    },
    switchButtonText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: theme.spacing.medium,
    },
});
