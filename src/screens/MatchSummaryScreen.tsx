// src/screens/MatchSummaryScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';

const StatRow = ({ label, valueA, valueB }: { label: string, valueA: number, valueB: number }) => (
    <View style={styles.statRow}>
        <Text style={styles.statValue}>{valueA}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{valueB}</Text>
    </View>
);

export function MatchSummaryScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    // Recebe os dados da partida finalizada que foram passados pelo LobbyScreen
    const { scoreA, scoreB, teamA, teamB } = route.params as { scoreA: number, scoreB: number, teamA: any, teamB: any };

    const winner = scoreA > scoreB ? teamA.name : (scoreB > scoreA ? teamB.name : 'Empate');

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>FIM DE JOGO</Text>
                </View>

                <View style={styles.resultContainer}>
                    <Text style={styles.winnerText}>VENCEDOR</Text>
                    <Text style={styles.winnerTeamName}>{winner}</Text>
                    
                    <View style={styles.finalScore}>
                        <Image source={{ uri: teamA.logo }} style={styles.teamLogo} />
                        <Text style={styles.scoreText}>{scoreA} - {scoreB}</Text>
                        <Image source={{ uri: teamB.logo }} style={styles.teamLogo} />
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <Text style={styles.statsHeader}>ESTATÍSTICAS DA PARTIDA</Text>
                    <StatRow label="Gols" valueA={scoreA} valueB={scoreB} />
                    <StatRow label="Chutes" valueA={8} valueB={12} />
                    <StatRow label="Faltas" valueA={5} valueB={3} />
                </View>

                <TouchableOpacity 
                    style={styles.doneButton}
                    // Volta para a lista de partidas na pilha, limpando o histórico de lobby e resumo
                    onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'PartidasList' }))}
                >
                    <Text style={styles.doneButtonText}>CONCLUÍDO</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingBottom: 40 },
    header: { paddingVertical: theme.spacing.medium, alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
    resultContainer: { backgroundColor: theme.colors.primary, padding: theme.spacing.large, alignItems: 'center' },
    winnerText: { fontSize: 16, color: theme.colors.white, opacity: 0.8 },
    winnerTeamName: { fontSize: 32, fontWeight: 'bold', color: theme.colors.white, marginVertical: theme.spacing.small },
    finalScore: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    teamLogo: { width: 50, height: 50, borderRadius: 25 },
    scoreText: { fontSize: 48, fontWeight: 'bold', color: theme.colors.white, marginHorizontal: theme.spacing.large },
    statsContainer: { padding: theme.spacing.large },
    statsHeader: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, textAlign: 'center', marginBottom: theme.spacing.large },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.medium, borderBottomWidth: 1, borderBottomColor: theme.colors.surface },
    statValue: { fontSize: 18, fontWeight: 'bold', width: 50, textAlign: 'center' },
    statLabel: { fontSize: 16, color: theme.colors.placeholder },
    doneButton: { backgroundColor: theme.colors.yellow, margin: theme.spacing.large, padding: theme.spacing.medium, borderRadius: theme.radius.medium, alignItems: 'center' },
    doneButtonText: { fontSize: 18, fontWeight: 'bold', color: theme.colors.primary },
});
