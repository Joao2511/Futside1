// src/screens/LobbyScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert // 1. Importar o Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { AddPlayerModal } from '../components/AddPlayerModal';
import Toast from 'react-native-toast-message'; // 2. Importar o Toast

// Tipagem para um jogador
interface Player {
    id: string;
    name: string;
    avatar: string;
    role: string;
    isLeader: boolean;
}

// Mock de dados para os times
const initialMockTeamA = {
    name: 'TIME A',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/ff/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png',
};
const initialMockTeamB = {
    name: 'TIME B',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/Leicester_City_FC.svg/1200px-Leicester_City_FC_logo.svg.png',
};

// Componente para exibir o avatar do jogador
const PlayerAvatar = ({ player }: { player: Player | null }) => (
    <View style={styles.playerSlotContainer}>
        <View style={[styles.avatarCircle, !player && styles.avatarEmpty]}>
            {player ? (
                <Image source={{ uri: player.avatar }} style={styles.avatar} />
            ) : (
                <Icon name="plus" size={24} color={theme.colors.placeholder} />
            )}
        </View>
        <Text style={styles.playerNameSlot}>{player?.name || 'Vazio'}</Text>
        {player?.role && (
            <Text style={styles.playerRole}>
                <Icon name="hexagon" size={10} color={theme.colors.text} />{' '}
                {player.role}
            </Text>
        )}
    </View>
);

export function LobbyScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { courtName, selectedPlayers, matchTime, organizer } = route.params as { courtName: string, selectedPlayers: string, matchTime: string, organizer: string };

    const totalPlayersPerTeam = parseInt(selectedPlayers.split('V')[0]);

    const [scoreA, setScoreA] = useState(0);
    const [scoreB, setScoreB] = useState(0);
    const [isMatchStarted, setIsMatchStarted] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [teamAPlayers, setTeamAPlayers] = useState<Player[]>([]);
    const [teamBPlayers, setTeamBPlayers] = useState<Player[]>([]);
    const [isAddPlayerModalVisible, setIsAddPlayerModalVisible] = useState(false);
    const [teamToAddPlayer, setTeamToAddPlayer] = useState<'A' | 'B'>('A');
    const [message, setMessage] = useState('');

    const parseMatchTime = (timeString: string): number => {
        if (!timeString) return 0;
        const parts = timeString.split(':');
        if (parts.length === 2) {
            const hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);
            if (!isNaN(hours) && !isNaN(minutes)) {
                return (hours * 3600) + (minutes * 60);
            }
        }
        return 0;
    };
    
    const formatDuration = (totalSeconds: number): string => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    useEffect(() => {
        if (isMatchStarted) {
            const initialTimeInSeconds = parseMatchTime(matchTime || '00:00');
            setRemainingTime(initialTimeInSeconds > 0 ? initialTimeInSeconds : 60 * 45);

            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

            timerIntervalRef.current = setInterval(() => {
                setRemainingTime(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timerIntervalRef.current!);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        }

        return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current) };
    }, [isMatchStarted, matchTime]);

    const createPlayerSlots = (players: Player[], count: number) => {
        const slots: (Player | null)[] = Array(count).fill(null);
        players.forEach((player, index) => {
            if (index < count) slots[index] = player;
        });
        return slots;
    };

    const teamASlots = createPlayerSlots(teamAPlayers, totalPlayersPerTeam);
    const teamBSlots = createPlayerSlots(teamBPlayers, totalPlayersPerTeam);

    const handleStartMatch = () => { setIsMatchStarted(true); };
    const handleScoreGoal = (team: 'A' | 'B') => { if (isMatchStarted) team === 'A' ? setScoreA(p => p + 1) : setScoreB(p => p + 1); };
    const handleRemoveGoal = (team: 'A' | 'B') => { if (isMatchStarted) team === 'A' ? setScoreA(p => Math.max(0, p - 1)) : setScoreB(p => Math.max(0, p - 1)); };

    // 3. Função de Encerrar Partida com o Alert, Toast e Navegação
    const handleEndMatch = () => {
        Alert.alert(
            "Encerrar Partida",
            "Você realmente deseja terminar a partida?",
            [
                {
                    text: "Não",
                    style: "cancel"
                },
                { 
                    text: "Sim", 
                    onPress: () => {
                        setIsMatchStarted(false);
                        if (timerIntervalRef.current) {
                            clearInterval(timerIntervalRef.current);
                        }

                        Toast.show({
                            type: 'success',
                            text1: 'Partida Encerrada!',
                            text2: 'O resultado foi salvo no seu histórico.'
                        });
                        
                        // Redireciona para o resumo da partida, resetando a pilha de navegação
                        // para que o utilizador não consiga voltar para o lobby finalizado.
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [
                                    { name: 'PartidasList' }, // Volta para a lista principal de partidas
                                    { 
                                        name: 'MatchSummary',
                                        params: { 
                                            scoreA, 
                                            scoreB,
                                            teamA: initialMockTeamA,
                                            teamB: initialMockTeamB,
                                        },
                                    },
                                ],
                            })
                        );
                    }
                }
            ]
        );
    };

    const handleAddPlayer = (name: string, role: string, teamId: 'A' | 'B') => {
        const newPlayer: Player = { id: `player_${Date.now()}`, name, avatar: `https://avatar.iran.liara.run/public/${Math.random() > 0.5 ? 'boy' : 'girl'}?username=${name.replace(/\s/g, '')}`, role, isLeader: false };
        if (teamId === 'A' && teamAPlayers.length < totalPlayersPerTeam) setTeamAPlayers(p => [...p, newPlayer]);
        else if (teamId === 'B' && teamBPlayers.length < totalPlayersPerTeam) setTeamBPlayers(p => [...p, newPlayer]);
        else Alert.alert("Time Cheio", `O time já está completo.`);
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{courtName}</Text>
                <TouchableOpacity style={styles.shareButton}><Icon name="share-2" size={24} color={theme.colors.text} /></TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Seção do placar e localização */}
                    <View style={styles.scoreSection}>
                        <View style={styles.teamScoreContainer}>
                            <Image source={{ uri: initialMockTeamA.logo }} style={styles.teamLogo} />
                            <Text style={styles.teamNameScore}>{initialMockTeamA.name}</Text>
                            {isMatchStarted && (
                                <View style={styles.scoreButtonsContainer}>
                                    <TouchableOpacity onPress={() => handleRemoveGoal('A')} style={styles.removeGoalButton}><Icon name="minus" size={16} color={theme.colors.text} /></TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleScoreGoal('A')} style={styles.addGoalButton}><Icon name="plus" size={16} color={theme.colors.text} /></TouchableOpacity>
                                </View>
                            )}
                        </View>
                        <View style={styles.centralScoreContainer}>
                            <Text style={styles.scoreText}>{scoreA} - {scoreB}</Text>
                            <View style={styles.timeTextContainer}>
                                <View style={styles.liveDot} />
                                <Text style={styles.timeTextContent}>{isMatchStarted && remainingTime > 0 ? formatDuration(remainingTime) : 'Aguardando'}</Text>
                            </View>
                        </View>
                        <View style={styles.teamScoreContainer}>
                            <Image source={{ uri: initialMockTeamB.logo }} style={styles.teamLogo} />
                            <Text style={styles.teamNameScore}>{initialMockTeamB.name}</Text>
                            {isMatchStarted && (
                                <View style={styles.scoreButtonsContainer}>
                                    <TouchableOpacity onPress={() => handleRemoveGoal('B')} style={styles.removeGoalButton}><Icon name="minus" size={16} color={theme.colors.text} /></TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleScoreGoal('B')} style={styles.addGoalButton}><Icon name="plus" size={16} color={theme.colors.text} /></TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Estrutura para exibir os dois times lado a lado */}
                    <View style={styles.teamsDisplayCard}>
                        <View style={styles.teamColumn}>
                            <Text style={styles.teamColumnTitle}>{initialMockTeamA.name}</Text>
                            {teamASlots.map((player, index) => (
                                <TouchableOpacity key={index} onPress={() => { if (!player) { setTeamToAddPlayer('A'); setIsAddPlayerModalVisible(true); }}}>
                                    <PlayerAvatar player={player} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.teamColumn}>
                            <Text style={styles.teamColumnTitle}>{initialMockTeamB.name}</Text>
                            {teamBSlots.map((player, index) => (
                                <TouchableOpacity key={index} onPress={() => { if (!player) { setTeamToAddPlayer('B'); setIsAddPlayerModalVisible(true); }}}>
                                    <PlayerAvatar player={player} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.matchActionsContainer}>
                        {!isMatchStarted ? (
                            <TouchableOpacity style={styles.startMatchButton} onPress={handleStartMatch}>
                                <Text style={styles.startMatchButtonText}>INICIAR PARTIDA</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={[styles.startMatchButton, styles.endMatchButton]} onPress={handleEndMatch}>
                                <Text style={[styles.startMatchButtonText, styles.endMatchButtonText]}>ENCERRAR PARTIDA</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <AddPlayerModal
                isVisible={isAddPlayerModalVisible}
                onClose={() => setIsAddPlayerModalVisible(false)}
                onAddPlayer={handleAddPlayer}
                teamId={teamToAddPlayer}
            />
        </View>
    );
}

// ... (seus estilos existentes)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.medium, paddingHorizontal: theme.spacing.medium, borderBottomWidth: 1, borderBottomColor: theme.colors.surface },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text, flex: 1, textAlign: 'center' },
    shareButton: { padding: 5 },
    scrollContent: { paddingBottom: theme.spacing.large },
    scoreSection: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: theme.spacing.large, backgroundColor: theme.colors.primary, paddingHorizontal: theme.spacing.medium, marginBottom: theme.spacing.large },
    teamScoreContainer: { alignItems: 'center', flex: 1, position: 'relative' },
    teamLogo: { width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.surface, marginBottom: theme.spacing.small },
    teamNameScore: { color: theme.colors.white, fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
    scoreButtonsContainer: { flexDirection: 'row', marginTop: theme.spacing.small },
    addGoalButton: { backgroundColor: 'rgba(255,255,255,0.3)', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
    removeGoalButton: { backgroundColor: 'rgba(255,255,255,0.3)', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 4 },
    centralScoreContainer: { alignItems: 'center', marginHorizontal: theme.spacing.small },
    scoreText: { fontSize: 48, fontWeight: 'bold', color: theme.colors.white },
    timeTextContainer: { flexDirection: 'row', alignItems: 'center' },
    timeTextContent: { fontSize: 16, color: theme.colors.white, opacity: 0.8 },
    liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6347', marginRight: 5 },
    locationButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.yellow, borderRadius: theme.radius.medium, paddingVertical: theme.spacing.small - 2, paddingHorizontal: theme.spacing.medium, marginTop: theme.spacing.medium },
    locationButtonText: { color: theme.colors.primary, fontSize: 12, fontWeight: 'bold', marginLeft: theme.spacing.small },
    teamsDisplayCard: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: theme.spacing.large, backgroundColor: theme.colors.surface, borderRadius: theme.radius.medium, padding: theme.spacing.large, elevation: 3, marginBottom: theme.spacing.large },
    teamColumn: { flex: 1, alignItems: 'center' },
    teamColumnTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.large },
    playerSlotContainer: { alignItems: 'center', marginBottom: theme.spacing.medium, width: '100%' },
    avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    avatarEmpty: { borderStyle: 'dashed', borderWidth: 1, borderColor: theme.colors.placeholder },
    avatar: { width: '100%', height: '100%' },
    playerNameSlot: { fontSize: 14, color: theme.colors.text, marginTop: theme.spacing.small, textAlign: 'center' },
    playerRole: { fontSize: 10, color: theme.colors.placeholder },
    matchActionsContainer: { marginHorizontal: theme.spacing.large, marginTop: theme.spacing.large, alignItems: 'center' },
    startMatchButton: { backgroundColor: theme.colors.yellow, borderRadius: theme.radius.medium, paddingVertical: theme.spacing.medium, alignItems: 'center', width: '100%', elevation: 3 },
    startMatchButtonText: { color: theme.colors.primary, fontSize: 18, fontWeight: 'bold' },
    endMatchButton: { backgroundColor: theme.colors.danger },
    endMatchButtonText: { color: theme.colors.white, fontSize: 18, fontWeight: 'bold' },
});
