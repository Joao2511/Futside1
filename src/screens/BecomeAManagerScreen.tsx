// src/screens/BecomeAManagerScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

const FeaturePoint = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
    <View style={styles.featurePoint}>
        <Icon name={icon} size={28} color={theme.colors.primary} style={styles.featureIcon} />
        <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDescription}>{description}</Text>
        </View>
    </View>
);

export function BecomeAManagerScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SEJA UM LOCADOR</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image
                    source={require('../assets/logo2.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.mainTitle}>Divulgue sua quadra e aumente seus agendamentos!</Text>
                <Text style={styles.subtitle}>
                    Ao se tornar um locador parceiro do Futside, você ganha acesso a uma comunidade de jogadores apaixonados e a ferramentas para gerir suas locações de forma simples e eficiente.
                </Text>

                <View style={styles.featuresSection}>
                    <FeaturePoint 
                        icon="calendar" 
                        title="Gestão de Agenda" 
                        description="Controle seus horários, preços e disponibilidade em tempo real." 
                    />
                    <FeaturePoint 
                        icon="users" 
                        title="Alcance Novos Clientes" 
                        description="Apareça para milhares de jogadores que procuram um lugar para jogar." 
                    />
                    <FeaturePoint 
                        icon="bar-chart-2" 
                        title="Aumente sua Renda" 
                        description="Otimize a ocupação da sua quadra e veja o seu faturamento crescer." 
                    />
                </View>

                <TouchableOpacity style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>QUERO SER UM LOCADOR</Text>
                </TouchableOpacity>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.medium,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surface,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    scrollContainer: {
        padding: theme.spacing.large,
    },
    logo: {
        height: 80,
        width: '80%',
        alignSelf: 'center',
        marginBottom: theme.spacing.large,
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme.colors.text,
        marginBottom: theme.spacing.medium,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: theme.colors.placeholder,
        lineHeight: 24,
        marginBottom: theme.spacing.large,
    },
    featuresSection: {
        marginVertical: theme.spacing.large,
    },
    featurePoint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.large,
    },
    featureIcon: {
        marginRight: theme.spacing.medium,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    featureDescription: {
        fontSize: 14,
        color: theme.colors.placeholder,
        marginTop: 4,
        lineHeight: 20,
    },
    registerButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.medium,
        borderRadius: theme.radius.medium,
        alignItems: 'center',
        marginTop: theme.spacing.medium,
        marginBottom: 16
    },
    registerButtonText: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
