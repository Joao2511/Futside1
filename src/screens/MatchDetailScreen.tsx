import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import * as api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import mqtt from 'mqtt';
import { MQTT_BROKER_URL, MQTT_OPTIONS } from '../services/mqttClient';

// Use o IP da sua máquina se estiver no celular físico, ou 10.0.2.2 para emulador

// Componente para a linha de estatística
const StatRow = ({ label, valueA, valueB }: { label: string, valueA: number, valueB: number }) => (
    <View style={styles.statRow}>
        <Text style={styles.statValue}>{valueA}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{valueB}</Text>
    </View>
);

export function MatchDetailScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<StackNavigationProp<PartidasStackParamList>>();
    const route = useRoute<RouteProp<PartidasStackParamList, 'MatchDetail'>>();
    const { user: currentUser } = useAuth();
    const { matchId } = route.params;

    const [match, setMatch] = useState<api.MatchDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchMatchData = async () => {
            try {
                const data = await api.getMatchDetails(matchId);
                if (isMounted) setMatch(data);
            } catch (error) {
                console.error("Erro ao buscar detalhes da partida:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados da partida.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchMatchData();

        // Conecta ao MQTT apenas se a partida estiver em andamento
        let client: mqtt.MqttClient | null = null;
       if (match?.status === 'in_progress') {
            const liveOptions = {
                ...MQTT_OPTIONS, // <-- Adiciona as opções de autenticação
                clientId: `live-match-client-${matchId}-${Math.random().toString(16).slice(2)}`,
            };
            
            // --- USA AS CONSTANTES E OPÇÕES IMPORTADAS ---
            client = mqtt.connect(MQTT_BROKER_URL, liveOptions);
            const liveTopic = `futside/match/${matchId}/live_updates`;
            client.on('connect', () => {
                console.log(`✅ Conectado ao MQTT para partida ao vivo ${matchId}`);
                client.subscribe(liveTopic, { qos: 1 });
            });
            client.on('message', (topic, message) => {
                if (!isMounted) return;
                const parsedMessage = JSON.parse(message.toString());
                if (parsedMessage.event === 'score_update') {
                    setMatch(currentMatch => currentMatch ? { ...currentMatch, ...parsedMessage.data } : null);
                }
            });
        }

        return () => {
            isMounted = false;
            if (client) client.end(true);
        };
    }, [matchId, match?.status]); // Re-executa se o status mudar

    const handleScoreChange = async (team: 'a' | 'b', delta: 1 | -1) => {
        if (!match) return;
        const newScoreA = team === 'a' ? match.score_a + delta : match.score_a;
        const newScoreB = team === 'b' ? match.score_b + delta : match.score_b;
        if (newScoreA < 0 || newScoreB < 0) return;

        try {
            await api.updateScore(matchId, { score_a: newScoreA, score_b: newScoreB });
        } catch (error) {
            console.error("Erro ao atualizar placar:", error);
            Alert.alert("Erro", "Não foi possível atualizar o placar.");
        }
    };

    if (loading || !match) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
    }

    const isCreator = currentUser?.id === match.creator_id;

    // --- RENDERIZAÇÃO CONDICIONAL BASEADA NO STATUS DA PARTIDA ---
    
    // -- Visualização de Partida Agendada / Pré-Jogo --
    if (match.status === 'scheduled' || match.status === 'confirmed') {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="chevron-left" size={30} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>{match.title}</Text>
                    <View style={{ width: 30 }} />
                </View>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.preMatchContainer}>
                        <Icon name="info" size={60} color={theme.colors.primary} />
                        <Text style={styles.preMatchTitle}>Detalhes da Partida</Text>
                        <Text style={styles.preMatchInfo}><Text style={styles.bold}>Local:</Text> {match.field.name} - {match.field.city}</Text>
                        <Text style={styles.preMatchInfo}><Text style={styles.bold}>Data:</Text> {new Date(match.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</Text>
                        <Text style={styles.preMatchInfo}><Text style={styles.bold}>Horário:</Text> {match.start_time.slice(0, 5)}</Text>
                        <Text style={styles.preMatchInfo}><Text style={styles.bold}>Vagas:</Text> {match.player_count} / {match.max_players}</Text>
                        
                        <TouchableOpacity style={styles.joinLobbyButton} onPress={() => navigation.navigate('Lobby', { matchId })}>
                            <Text style={styles.joinLobbyButtonText}>ENTRAR NO LOBBY</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // -- Visualização de Partida Ao Vivo / Encerrada --
    // A lógica é a mesma, só mudamos o texto e desabilitamos os controles se estiver 'completed'
    const isLive = match.status === 'in_progress';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Icon name="chevron-left" size={30} color={theme.colors.text} /></TouchableOpacity>
                <Text style={styles.headerTitle}>{match.field.name}</Text>
                <View style={{ width: 30 }} />
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.matchHeader}>
                    <View style={styles.teamContainer}>
                        <Image source={{ uri: `https://avatar.iran.liara.run/public/boy?username=TeamA` }} style={styles.teamLogo} />
                        <Text style={styles.teamName}>Time A</Text>
                        {isCreator && isLive && (
                            <View style={styles.scoreControls}><TouchableOpacity onPress={() => handleScoreChange('a', -1)}><Icon name="minus-circle" size={24} color={theme.colors.placeholder} /></TouchableOpacity><TouchableOpacity onPress={() => handleScoreChange('a', 1)}><Icon name="plus-circle" size={24} color={theme.colors.primary} /></TouchableOpacity></View>
                        )}
                    </View>
                    <Text style={styles.scoreText}>{match.score_a} - {match.score_b}</Text>
                    <View style={styles.teamContainer}>
                        <Image source={{ uri: `https://avatar.iran.liara.run/public/boy?username=TeamB` }} style={styles.teamLogo} />
                        <Text style={styles.teamName}>Time B</Text>
                        {isCreator && isLive && (
                            <View style={styles.scoreControls}><TouchableOpacity onPress={() => handleScoreChange('b', -1)}><Icon name="minus-circle" size={24} color={theme.colors.placeholder} /></TouchableOpacity><TouchableOpacity onPress={() => handleScoreChange('b', 1)}><Icon name="plus-circle" size={24} color={theme.colors.primary} /></TouchableOpacity></View>
                        )}
                    </View>
                </View>

                <View style={styles.liveStatusContainer}>
                    <View style={[styles.liveDot, !isLive && { backgroundColor: theme.colors.placeholder }]} />
                    <Text style={[styles.liveText, !isLive && { color: theme.colors.placeholder }]}>{isLive ? 'Ao vivo' : 'Encerrada'}</Text>
                </View>
                
                <View style={styles.statsTable}><StatRow label="Faltas" valueA={2} valueB={4} /></View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // ... estilos existentes
    container: { flex: 1, backgroundColor: theme.colors.background },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.medium, paddingHorizontal: theme.spacing.medium, borderBottomWidth: 1, borderBottomColor: theme.colors.surface },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
    scrollContainer: { padding: theme.spacing.large },
    matchHeader: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    teamContainer: { alignItems: 'center', width: 100 },
    teamLogo: { width: 80, height: 80, borderRadius: 40, marginBottom: theme.spacing.small },
    teamName: { fontSize: 16, fontWeight: 'bold' },
    scoreText: { fontSize: 48, fontWeight: 'bold', marginHorizontal: theme.spacing.medium },
    liveStatusContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: theme.spacing.small },
    liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'red', marginRight: 5 },
    liveText: { color: 'red', fontWeight: 'bold' },
    statsTable: { marginTop: theme.spacing.large, borderTopWidth: 1, borderTopColor: theme.colors.surface, paddingTop: theme.spacing.medium },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.medium },
    statValue: { fontSize: 16, fontWeight: 'bold', width: 40, textAlign: 'center' },
    statLabel: { fontSize: 16, color: theme.colors.placeholder },
    scoreControls: { flexDirection: 'row', justifyContent: 'space-around', width: 80, marginTop: theme.spacing.small },
    
    // --- Novos estilos para a visualização de pré-jogo ---
    preMatchContainer: {
        alignItems: 'center',
        padding: theme.spacing.large,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.medium,
    },
    preMatchTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginVertical: theme.spacing.medium,
    },
    preMatchInfo: {
        fontSize: 16,
        color: theme.colors.text,
        lineHeight: 24,
        marginBottom: theme.spacing.small,
    },
    bold: {
        fontWeight: 'bold',
    },
    joinLobbyButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: theme.radius.medium,
        marginTop: theme.spacing.large,
    },
    joinLobbyButtonText: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    }
});