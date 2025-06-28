// src/screens/TermsAndPrivacyScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

// Componente para um parágrafo de texto
const Paragraph = ({ title, content }: { title: string, content: string }) => (
    <View style={styles.paragraphContainer}>
        <Text style={styles.paragraphTitle}>{title}</Text>
        <Text style={styles.paragraphContent}>{content}</Text>
    </View>
);

export function TermsAndPrivacyScreen() {
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
                <Text style={styles.headerTitle}>TERMOS E PRIVACIDADE</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Paragraph 
                    title="1. Coleta de Informações"
                    content="Coletamos informações que você nos fornece diretamente, como nome, e-mail e localização ao criar sua conta. Também coletamos dados gerados durante o uso do aplicativo, como histórico de partidas e interações."
                />
                <Paragraph 
                    title="2. Uso das Informações"
                    content="As suas informações são utilizadas para personalizar a sua experiência, conectar você a outros jogadores e quadras, e para melhorar a segurança e funcionalidade do nosso serviço. A sua localização é usada para sugerir partidas e locais próximos a você."
                />
                <Paragraph 
                    title="3. Segurança dos Dados"
                    content="Implementamos medidas de segurança robustas, incluindo criptografia, para proteger os seus dados contra acesso não autorizado, alteração ou destruição. A sua senha é armazenada de forma segura e nunca é visível para nós."
                />
                 <Paragraph 
                    title="4. Compartilhamento de Informações"
                    content="Não compartilhamos as suas informações pessoais com terceiros para fins de marketing sem o seu consentimento explícito. Informações como o seu nome de utilizador e avatar são visíveis para outros utilizadores dentro do aplicativo para facilitar a organização das partidas."
                />
                 <Paragraph 
                    title="5. Seus Direitos"
                    content="Você tem o direito de aceder, corrigir ou excluir as suas informações pessoais a qualquer momento através das configurações do seu perfil. Você também pode desativar a sua conta, o que removerá o seu perfil de visualização pública."
                />
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
    paragraphContainer: {
        marginBottom: theme.spacing.large,
    },
    paragraphTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.small,
    },
    paragraphContent: {
        fontSize: 16,
        lineHeight: 24,
        color: '#616161',
    },
});
