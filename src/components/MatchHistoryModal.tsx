import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation

// Removida a interface MatchHistoryModalProps porque a tela será gerenciada pelo navegador
// interface MatchHistoryModalProps {
//     isVisible: boolean;
//     onClose: () => void;
// }

const { width } = Dimensions.get('window');

// Mock de dados para o histórico de partidas
const mockMatchHistory = [
    {
        id: '1',
        courtName: 'Quadra 209 Norte',
        score: '3 - 2',
        teamA: { name: 'Time Vermelho', logo: 'https://placehold.co/40x40/FF5733/FFFFFF?text=TV' },
        teamB: { name: 'Time Azul', logo: 'https://placehold.co/40x40/3366FF/FFFFFF?text=TA' },
        date: '2024-06-20',
    },
    {
        id: '2',
        courtName: 'Campo Society - Lago Norte',
        score: '1 - 1',
        teamA: { name: 'Time A', logo: 'https://placehold.co/40x40/008000/FFFFFF?text=OF' },
        teamB: { name: 'Time B', logo: 'https://placehold.co/40x40/800080/FFFFFF?text=OI' },
        date: '2024-06-18',
    },
    {
        id: '3',
        courtName: 'Quadra da 405 Norte',
        score: '5 - 0',
        teamA: { name: 'Time Amarelo', logo: 'https://placehold.co/40x40/FFC300/000000?text=TM' },
        teamB: { name: 'Time Verde', logo: 'https://placehold.co/40x40/00FF00/000000?text=TV' },
        date: '2024-06-15',
    },
];

// O componente não recebe mais isVisible ou onClose como props
export function MatchHistoryModal() {
    const navigation = useNavigation(); // Usar o hook useNavigation para fechar a tela

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="x" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Histórico de Partidas</Text>
                <View style={{ width: 24 }} /> 
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {mockMatchHistory.map(match => (
                    <View key={match.id} style={styles.matchCard}>
                        {/* AQUI ESTÁ A CORREÇÃO: Certifique-se que não há espaços/quebras de linha fora das tags Text */}
                        <Text style={styles.matchCourtName}>{match.courtName}</Text>
                        <Text style={styles.matchDate}>{match.date}</Text>
                        <View style={styles.matchDetails}>
                            <View style={styles.matchTeam}>
                                <Image source={{ uri: match.teamA.logo }} style={styles.teamLogo} />
                                {/* Garantindo que o nome do time esteja sempre dentro de um <Text> */}
                                <Text style={styles.teamName}>{match.teamA.name}</Text>
                            </View>
                            <Text style={styles.matchScore}>{match.score}</Text>
                            <View style={styles.matchTeam}>
                                <Image source={{ uri: match.teamB.logo }} style={styles.teamLogo} />
                                {/* Garantindo que o nome do time esteja sempre dentro de um <Text> */}
                                <Text style={styles.teamName}>{match.teamB.name}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background, // Fundo principal
        paddingTop: StatusBar.currentHeight, // Garante que o conteúdo comece abaixo da status bar
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.medium,
        paddingVertical: theme.spacing.small,
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
    scrollContent: {
        padding: theme.spacing.large,
    },
    matchCard: {
        backgroundColor: theme.colors.surface, // Fundo do card
        borderRadius: theme.radius.medium,
        padding: theme.spacing.medium,
        marginBottom: theme.spacing.medium,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    matchCourtName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.small / 2,
    },
    matchDate: {
        fontSize: 12,
        color: theme.colors.placeholder,
        marginBottom: theme.spacing.medium,
    },
    matchDetails: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    matchTeam: {
        alignItems: 'center',
        flex: 1,
    },
    teamLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.background,
        marginBottom: theme.spacing.small,
    },
    teamName: { // Este estilo já existe e está correto
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
    },
    matchScore: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginHorizontal: theme.spacing.medium,
    },
});
