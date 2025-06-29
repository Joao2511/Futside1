// src/screens/LocadorLocacaoScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
    ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

export function LocadorLocacaoScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <View style={{ height: insets.top, backgroundColor: theme.colors.background }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>LOCAÇÃO</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1558507652-29952b2553e8?q=80&w=1887&auto=format&fit=crop' }}
                    style={styles.mainCard}
                    imageStyle={{ borderRadius: theme.radius.medium }}
                >
                    <View style={styles.overlay}>
                        <View style={styles.topContent}>
                            <Text style={styles.title}>VENHA FAZER PARTE.</Text>
                            <Text style={styles.subtitle}>SEJA UM DOS NOSSOS GESTORES.</Text>
                        </View>

                        <Image 
                            source={require('../assets/logo2.png')} // Usando logo2 como placeholder
                            style={styles.logo}
                            resizeMode="contain"
                        />

                        <View style={styles.bottomContent}>
                            <Text style={styles.registerTitle}>REGISTRE SUA QUADRA</Text>
                            <TouchableOpacity style={styles.registerButton}>
                                <Text style={styles.registerButtonText}>Registre Aqui</Text>
                                <Icon name="arrow-right" size={20} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
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
    mainCard: {
        height: 600, // Altura aumentada para um card mais imponente
        borderRadius: theme.radius.medium,
        overflow: 'hidden', // Garante que a imagem de fundo respeite o borderRadius
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 80, 0, 0.7)', // Overlay verde escuro mais forte
        padding: theme.spacing.large,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topContent: {
        alignItems: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: theme.colors.white,
        textAlign: 'center',
        lineHeight: 50,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.white,
        opacity: 0.9,
        marginTop: theme.spacing.small,
        fontWeight: '600',
    },
    logo: {
        width: 150,
        height: 150,
    },
    bottomContent: {
        width: '100%',
        alignItems: 'center',
    },
    registerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.white,
        textAlign: 'center',
        marginBottom: theme.spacing.medium,
        textTransform: 'uppercase',
    },
    registerButton: {
        flexDirection: 'row',
        backgroundColor: theme.colors.white,
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.large,
        borderRadius: theme.radius.medium,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    registerButtonText: {
        color: theme.colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: theme.spacing.small,
    },
});
