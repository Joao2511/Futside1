// src/screens/LocadorHelpAndSupportScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Linking
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

// Componente reutilizável para cada pergunta e resposta
const FaqItem = ({ question, answer }: { question: string, answer: string }) => (
    <View style={styles.paragraphContainer}>
        <Text style={styles.paragraphTitle}>{question}</Text>
        <Text style={styles.paragraphContent}>{answer}</Text>
    </View>
);

export function LocadorHelpAndSupportScreen() {
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
                <Text style={styles.headerTitle}>AJUDA & SUPORTE</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.pageSubtitle}>Perguntas Frequentes</Text>
                <FaqItem 
                    question="Como crio uma partida?"
                    answer="Vá até a aba 'Partidas', clique em 'CRIAR PARTIDA', selecione uma quadra no mapa e preencha as informações do formulário para criar o seu lobby."
                />
                {/* CORREÇÃO AQUI: A propriedade 'content' foi alterada para 'answer' */}
                <FaqItem 
                    question="Como adiciono um amigo?"
                    answer="Aceda ao seu Perfil, clique em 'ADICIONAR AMIGO' e insira o ID ou nome de utilizador do seu amigo para enviar um pedido de amizade."
                />
                {/* CORREÇÃO AQUI: A propriedade 'content' foi alterada para 'answer' */}
                <FaqItem 
                    question="Esqueci a minha senha. O que faço?"
                    answer="Na tela de Login, clique em 'Esqueceu a senha?' e siga as instruções enviadas para o seu e-mail para redefinir a sua senha."
                />

                <View style={styles.divider} />

                <Text style={styles.pageSubtitle}>Ainda precisa de ajuda?</Text>
                <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('mailto:suporte@futside.com')}>
                    <Icon name="mail" size={20} color={theme.colors.white} />
                    <Text style={styles.contactButtonText}>Contacte o Suporte</Text>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.medium,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surface,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    scrollContainer: {
        padding: theme.spacing.large,
    },
    pageSubtitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.large,
    },
    paragraphContainer: {
        marginBottom: theme.spacing.large,
    },
    paragraphTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.small,
    },
    paragraphContent: {
        fontSize: 16,
        lineHeight: 24,
        color: '#616161',
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.surface,
        marginVertical: theme.spacing.medium,
    },
    contactButton: {
        flexDirection: 'row',
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.medium,
        borderRadius: theme.radius.medium,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactButtonText: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: theme.spacing.medium,
    },
});
