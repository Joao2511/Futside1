import React, { useState, useEffect, useRef } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { AddPlayerModal } from '../components/AddPlayerModal'; // Importar o novo modal

// Tipagem para um jogador
interface Player {
    id: string;
    name: string;
    avatar: string;
    role: string;
    isLeader: boolean;
}

// Mock de dados para os times, agora com jogadores vazios por padrão
const initialMockTeamA = {
    name: 'TIME A',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/ff/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png',
    players: [] as Player[] // Vazio por padrão
};

const initialMockTeamB = {
    name: 'TIME B',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/Leicester_City_FC.svg/1200px-Leicester_City_FC_logo.svg.png',
    players: [] as Player[] // Vazio por padrão
};

// Componente para exibir o avatar do jogador
const PlayerAvatar = ({ player }: { player: Player | null }) => ( // Tipo Player agora é mais específico
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

    // Estados para o placar, status da partida e agora as listas de jogadores
    const [scoreA, setScoreA] = useState(0);
    const [scoreB, setScoreB] = useState(0);
    const [isMatchStarted, setIsMatchStarted] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Estados para gerenciar a lista de jogadores dinamicamente
    const [teamAPlayers, setTeamAPlayers] = useState<Player[]>(initialMockTeamA.players);
    const [teamBPlayers, setTeamBPlayers] = useState<Player[]>(initialMockTeamB.players);

    // Estado e ID do time para o modal de adicionar jogador
    const [isAddPlayerModalVisible, setIsAddPlayerModalVisible] = useState(false);
    const [teamToAddPlayer, setTeamToAddPlayer] = useState<'A' | 'B'>('A'); // Qual time o modal está adicionando jogador

    // Função para analisar o tempo (hh:mm) e converter para segundos
    const parseMatchTime = (timeString: string): number => {
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

    // Função para formatar segundos em HH:MM (para exibição no cronômetro)
    const formatDuration = (totalSeconds: number): string => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}`;
    };

    // Lógica para iniciar o cronômetro
    useEffect(() => {
        if (isMatchStarted) {
            const initialTimeInSeconds = parseMatchTime(matchTime);
            setRemainingTime(initialTimeInSeconds);

            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }

            timerIntervalRef.current = setInterval(() => {
                setRemainingTime(prevTime => {
                    if (prevTime <= 0) {
                        clearInterval(timerIntervalRef.current!);
                        timerIntervalRef.current = null;
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [isMatchStarted, matchTime]);

    // Criar um array de slots para cada time (incluindo slots vazios)
    const createPlayerSlots = (players: Player[], count: number) => {
        const slots: (Player | null)[] = [];
        // Preenche os slots com jogadores mockados ou null se não houver jogador
        for (let i = 0; i < count; i++) {
            slots.push(players[i] || null);
        }
        return slots;
    };

    const teamASlots = createPlayerSlots(teamAPlayers, totalPlayersPerTeam).map((player, index) => ({
        player: player,
        key: player?.id || `empty-teamA-${index}`
    }));
    const teamBSlots = createPlayerSlots(teamBPlayers, totalPlayersPerTeam).map((player, index) => ({
        player: player,
        key: player?.id || `empty-teamB-${index}`
    }));

    // Funções de lógica da partida
    const handleStartMatch = () => {
        setIsMatchStarted(true);
        setScoreA(0);
        setScoreB(0);
    };

    const handleScoreGoal = (team: 'A' | 'B') => {
        if (isMatchStarted) {
            if (team === 'A') {
                setScoreA(prev => prev + 1);
            } else {
                setScoreB(prev => prev + 1);
            }
        }
    };

    const handleRemoveGoal = (team: 'A' | 'B') => {
        if (isMatchStarted) {
            if (team === 'A') {
                setScoreA(prev => Math.max(0, prev - 1));
            } else {
                setScoreB(prev => Math.max(0, prev - 1));
            }
        }
    };

    const handleEndMatch = () => {
        setIsMatchStarted(false);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };

    // Lógica para adicionar jogador através do modal
    const handleAddPlayer = (name: string, role: string, teamId: 'A' | 'B') => {
        const newPlayer: Player = {
            id: `player_${teamId.toLowerCase()}_${Date.now()}`, // ID único
            name: name,
            avatar: `https://avatar.iran.liara.run/public/${Math.random() > 0.5 ? 'boy' : 'girl'}?username=${name.replace(/\s/g, '')}`, // Avatar aleatório
            role: role,
            isLeader: false, // Novo jogador não é líder por padrão
        };

        if (teamId === 'A') {
            if (teamAPlayers.length < totalPlayersPerTeam) {
                setTeamAPlayers(prevPlayers => [...prevPlayers, newPlayer]);
            } else {
                alert(`O ${initialMockTeamA.name} já está completo (${totalPlayersPerTeam} jogadores).`);
            }
        } else {
            if (teamBPlayers.length < totalPlayersPerTeam) {
                setTeamBPlayers(prevPlayers => [...prevPlayers, newPlayer]);
            } else {
                alert(`O ${initialMockTeamB.name} já está completo (${totalPlayersPerTeam} jogadores).`);
            }
        }
    };

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
                <Text style={styles.headerTitle}>{courtName}</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Seção do placar e localização */}
                <View style={styles.scoreSection}>
                    <View style={styles.teamScoreContainer}>
                        <Image source={{ uri: initialMockTeamA.logo }} style={styles.teamLogo} />
                        <Text style={styles.teamNameScore}>{initialMockTeamA.name}</Text>
                        {isMatchStarted && (
                            <View style={styles.scoreButtonsContainer}>
                                <TouchableOpacity onPress={() => handleRemoveGoal('A')} style={styles.removeGoalButton}>
                                    <Icon name="minus" size={16} color={theme.colors.white} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleScoreGoal('A')} style={styles.addGoalButton}>
                                    <Icon name="plus" size={16} color={theme.colors.white} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={styles.centralScoreContainer}>
                        <Text style={styles.scoreText}>{scoreA} - {scoreB}</Text>
                        <View style={styles.timeTextContainer}>
                            <View style={styles.liveDot} />
                            <Text style={styles.timeTextContent}>
                                {isMatchStarted && remainingTime > 0 ? formatDuration(remainingTime) : '18H'}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.locationButton}>
                            <Icon name="map-pin" size={16} color={theme.colors.primary} />
                            <Text style={styles.locationButtonText}>Localização</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.teamScoreContainer}>
                        <Image source={{ uri: initialMockTeamB.logo }} style={styles.teamLogo} />
                        <Text style={styles.teamNameScore}>{initialMockTeamB.name}</Text>
                        {isMatchStarted && (
                            <View style={styles.scoreButtonsContainer}>
                                <TouchableOpacity onPress={() => handleRemoveGoal('B')} style={styles.removeGoalButton}>
                                    <Icon name="minus" size={16} color={theme.colors.white} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleScoreGoal('B')} style={styles.addGoalButton}>
                                    <Icon name="plus" size={16} color={theme.colors.white} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                {/* Estrutura para exibir os dois times lado a lado */}
                <View style={styles.teamsDisplayCard}>
                    <View style={styles.teamColumn}>
                        <Text style={styles.teamColumnTitle}>{initialMockTeamA.name}</Text>
                        {teamASlots.map((slot, index) => (
                            <TouchableOpacity
                                key={slot.key}
                                onPress={() => {
                                    // Abre o modal de adição de jogador apenas se o slot estiver vazio
                                    // E o time ainda não estiver cheio
                                    if (!slot.player && teamAPlayers.length < totalPlayersPerTeam) {
                                        setTeamToAddPlayer('A');
                                        setIsAddPlayerModalVisible(true);
                                    }
                                }}
                                style={{ width: '100%', alignItems: 'center' }}
                            >
                                <PlayerAvatar player={slot.player} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.teamColumn}>
                        <Text style={styles.teamColumnTitle}>{initialMockTeamB.name}</Text>
                        {teamBSlots.map((slot, index) => (
                            <TouchableOpacity
                                key={slot.key}
                                onPress={() => {
                                    // Abre o modal de adição de jogador apenas se o slot estiver vazio
                                    // E o time ainda não estiver cheio
                                    if (!slot.player && teamBPlayers.length < totalPlayersPerTeam) {
                                        setTeamToAddPlayer('B');
                                        setIsAddPlayerModalVisible(true);
                                    }
                                }}
                                style={{ width: '100%', alignItems: 'center' }}
                            >
                                <PlayerAvatar player={slot.player} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Botão de Partida Iniciada / Encerrar */}
                <View style={styles.matchActionsContainer}>
                    {!isMatchStarted ? (
                        <TouchableOpacity style={styles.startMatchButton} onPress={handleStartMatch}>
                            <Text style={styles.startMatchButtonText}>INICIAR PARTIDA</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <View style={styles.matchStartedCard}>
                                <View style={styles.matchStartedInfo}>
                                    <Icon name="clock" size={20} color={theme.colors.text} />
                                    <Text style={styles.matchStartedText}>
                                        {`${remainingTime > 0 ? formatDuration(remainingTime) : 'Tempo Esgotado'} para o fim de partida`}
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.endMatchButton} onPress={handleEndMatch}>
                                    <Text style={styles.endMatchButtonText}>ENCERRAR</Text>
                                    <Icon name="arrow-right" size={18} color={theme.colors.text} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.disclaimerText}>
                                Uma partida só pode ser encerrada após o tempo definido em sua criação se concluir.
                            </Text>
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Modal de Adicionar Jogador */}
            <AddPlayerModal
                isVisible={isAddPlayerModalVisible}
                onClose={() => setIsAddPlayerModalVisible(false)}
                onAddPlayer={handleAddPlayer}
                teamId={teamToAddPlayer}
                // Passa a contagem atual de jogadores para o modal
                currentPlayersCount={teamToAddPlayer === 'A' ? teamAPlayers.length : teamBPlayers.length}
                totalPlayersPerTeam={totalPlayersPerTeam}
            />
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
        flex: 1,
        textAlign: 'center',
    },
    shareButton: {
        padding: 5,
    },
    scrollContent: {
        paddingBottom: theme.spacing.large,
    },
    // --- Seção do Placar ---
    scoreSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: theme.spacing.large,
        backgroundColor: theme.colors.primary,
        marginBottom: theme.spacing.large,
        paddingHorizontal: theme.spacing.medium,
    },
    teamScoreContainer: {
        alignItems: 'center',
        flex: 1,
        position: 'relative',
        paddingBottom: 30,
    },
    teamLogo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.surface,
        marginBottom: theme.spacing.small,
    },
    teamNameScore: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    scoreButtonsContainer: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 0,
        right: theme.spacing.small,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 'auto',
    },
    addGoalButton: {
        backgroundColor: theme.colors.yellow,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    removeGoalButton: {
        backgroundColor: theme.colors.gray,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    centralScoreContainer: {
        alignItems: 'center',
        marginHorizontal: theme.spacing.medium,
        flex: 1,
    },
    scoreText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: theme.colors.white,
    },
    timeTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeTextContent: {
        fontSize: 16,
        color: theme.colors.white,
        opacity: 0.8,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF6347',
        marginRight: 5,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.yellow,
        borderRadius: theme.radius.medium,
        paddingVertical: theme.spacing.small - 2,
        paddingHorizontal: theme.spacing.medium,
        marginTop: theme.spacing.medium,
    },
    locationButtonText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: theme.spacing.small,
    },
    // --- Seção de Times Lado a Lado ---
    teamsDisplayCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: theme.spacing.large,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.medium,
        padding: theme.spacing.large,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginBottom: theme.spacing.large,
    },
    teamColumn: {
        flex: 1,
        alignItems: 'center',
    },
    teamColumnTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.large,
    },
    playerSlotContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.medium,
    },
    avatarCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarEmpty: {
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: theme.colors.placeholder,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    playerNameSlot: {
        fontSize: 14,
        color: theme.colors.text,
        marginTop: theme.spacing.small,
        textAlign: 'center',
    },
    // --- Seção de Ações da Partida (Bottom) ---
    matchActionsContainer: {
        marginHorizontal: theme.spacing.large,
        marginTop: theme.spacing.large,
        alignItems: 'center',
    },
    startMatchButton: {
        backgroundColor: theme.colors.yellow,
        borderRadius: theme.radius.medium,
        paddingVertical: theme.spacing.medium,
        alignItems: 'center',
        width: '100%',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    startMatchButtonText: {
        color: theme.colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    matchStartedCard: {
        backgroundColor: '#4CAF50',
        borderRadius: theme.radius.medium,
        padding: theme.spacing.medium,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        flexWrap: 'wrap',
    },
    matchStartedInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
        marginRight: theme.spacing.small,
    },
    matchStartedText: {
        color: theme.colors.white,
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: theme.spacing.small,
        flexShrink: 1,
    },
    endMatchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.small,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexShrink: 0,
        minWidth: 90,
        justifyContent: 'center',
    },
    endMatchButtonText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: theme.spacing.small,
    },
    disclaimerText: {
        fontSize: 12,
        color: theme.colors.placeholder,
        textAlign: 'center',
        marginTop: theme.spacing.medium,
        lineHeight: 18,
    },
});
