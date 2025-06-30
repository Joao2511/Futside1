import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import mqtt from 'mqtt';
import { MQTT_BROKER_URL, MQTT_OPTIONS } from '../services/mqttClient';
// Endereço do broker MQTT. Para emulador Android, use o IP 10.0.2.2 para se referir ao localhost da máquina.
// Se o broker estiver na nuvem, use o endereço real (ex: 'ws://broker.hivemq.com:8000/mqtt')

interface LobbyPlayer {
    id: number;
    name: string;
    avatar: string;
}

const PlayerAvatar = ({ player, onAddPress }: { player: LobbyPlayer | null, onAddPress: () => void }) => (
    <TouchableOpacity style={styles.playerSlotContainer} onPress={onAddPress} disabled={!!player}>
        <View style={[styles.avatarCircle, !player && styles.avatarEmpty]}>
            {player ? (
                <Image source={{ uri: player.avatar }} style={styles.avatar} />
            ) : (
                <Icon name="plus" size={24} color={theme.colors.placeholder} />
            )}
        </View>
        <Text style={styles.playerNameSlot} numberOfLines={1}>{player?.name || 'Vazio'}</Text>
    </TouchableOpacity>
);

export function LobbyScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { user: currentUser } = useAuth();
    const { matchId } = route.params as { matchId: number };

    const [matchDetails, setMatchDetails] = useState<api.MatchDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState<LobbyPlayer[]>([]);
    const [isJoining, setIsJoining] = useState(false);
    
    const clientRef = useRef<mqtt.MqttClient | null>(null);

    const totalPlayersPerTeam = matchDetails ? Math.floor(matchDetails.max_players / 2) : 5;

    const transformPlayerData = useCallback((apiPlayers: any[]): LobbyPlayer[] => {
        return apiPlayers.map(player => ({
            id: player.id,
            name: player.name,
            avatar: `https://avatar.iran.liara.run/public/boy?username=${player.id}`
        }));
    }, []);

    const dividePlayersIntoTeams = useCallback((allPlayers: LobbyPlayer[]) => {
        const teamA: LobbyPlayer[] = [];
        const teamB: LobbyPlayer[] = [];
        allPlayers.forEach((player, index) => {
            if (index % 2 === 0) {
                teamA.push(player);
            } else {
                teamB.push(player);
            }
        });
        return { teamA, teamB };
    }, []);

    const createPlayerSlots = useCallback((teamPlayers: LobbyPlayer[], totalSlots: number): (LobbyPlayer | null)[] => {
        const slots: (LobbyPlayer | null)[] = Array(totalSlots).fill(null);
        teamPlayers.forEach((player, index) => {
            if (index < totalSlots) {
                slots[index] = player;
            }
        });
        return slots;
    }, []);
    
    // --- LÓGICA PRINCIPAL DE DADOS (FETCH INICIAL E MQTT) ---
    useEffect(() => {
        let isMounted = true;

        const fetchInitialDetails = async () => {
            try {
                console.log('Buscando detalhes iniciais da partida:', matchId);
                const data = await api.getMatchDetails(matchId);
                if (isMounted) {
                    setMatchDetails(data);
                    const transformedPlayers = transformPlayerData(data.players || []);
                    setPlayers(transformedPlayers);
                }
            } catch (error) {
                console.error('Erro ao buscar detalhes da partida:', error);
                if (isMounted) {
                    Alert.alert("Erro", "Não foi possível carregar os detalhes do lobby.");
                    navigation.goBack();
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        // 1. Busca os dados iniciais
        fetchInitialDetails();

        // 2. Configura o cliente MQTT para atualizações em tempo real
        console.log('Configurando cliente MQTT para match:', matchId);
        
        const lobbyOptions = {
            ...MQTT_OPTIONS, // <-- Adiciona as opções de autenticação
            clientId: `lobby-client-${matchId}-${Math.random().toString(16).slice(2)}`,
        };
        
        // --- USA AS CONSTANTES E OPÇÕES IMPORTADAS ---
        const client = mqtt.connect(MQTT_BROKER_URL, lobbyOptions);
        clientRef.current = client;

        client.on('connect', () => {
            console.log('✅ MQTT Cliente conectado no Lobby');
            const topic = `futside/match/${matchId}/updates`;
            console.log('📡 Subscrevendo ao tópico:', topic);
            client.subscribe(topic, { qos: 1 }, (err) => {
                if (err) console.error('❌ Erro na subscrição MQTT:', err);
            });
        });

        client.on('message', (topic, message) => {
            if (!isMounted) return;
            
            try {
                console.log('📨 MQTT Mensagem recebida:', message.toString());
                const parsedMessage = JSON.parse(message.toString());
                if (parsedMessage.event === 'match_started') {
                    console.log('Partida iniciada! Navegando para a tela de detalhes...');
                    // Usamos 'replace' para que o usuário não possa voltar para o lobby
                    navigation.replace('MatchDetail', { 
                        matchId: parsedMessage.data.match_id 
                    });
                    return; // Evita processar outros eventos
                }            
                if (parsedMessage.event === 'player_joined') {
                    const newPlayerData = parsedMessage.data;
                    console.log('🎮 Novo jogador entrando via MQTT:', newPlayerData);
                    
                    const newPlayer: LobbyPlayer = {
                        id: newPlayerData.user_id,
                        name: newPlayerData.user_name,
                        avatar: `https://avatar.iran.liara.run/public/boy?username=${newPlayerData.user_id}`
                    };

                    // Atualiza a lista de jogadores no estado
                    setPlayers(currentPlayers => {
                        const playerExists = currentPlayers.some(p => p.id === newPlayer.id);
                        if (playerExists) {
                            return currentPlayers; // Se já existe, não faz nada
                        }
                        // Adiciona o novo jogador e retorna um novo array para o React re-renderizar
                        return [...currentPlayers, newPlayer];
                    });

                    // Atualiza os detalhes da partida (como a contagem de jogadores)
                    setMatchDetails(currentDetails => 
                        currentDetails ? { ...currentDetails, player_count: newPlayerData.player_count } : null
                    );
                }
            } catch (error) {
                console.error('❌ Erro ao processar mensagem MQTT:', error);
            }
        });
        
        client.on('error', (err) => console.error('❌ MQTT Error:', err));
        client.on('close', () => console.log('🔌 MQTT Conexão fechada'));

        // Função de limpeza ao desmontar o componente
        return () => {
            isMounted = false;
            console.log('🧹 Limpando e desconectando cliente MQTT');
            if (clientRef.current) {
                clientRef.current.end(true);
            }
        };
    }, [matchId, navigation, transformPlayerData]); // Dependências do useEffect

        const handleStartMatch = async () => {
            if (!matchDetails) return;
            Alert.alert(
                "Iniciar Partida",
                "Tem certeza que deseja iniciar a partida? Todos os jogadores serão redirecionados.",
                [
                    { text: "Cancelar", style: "cancel" },
                    { 
                        text: "Iniciar", 
                        onPress: async () => {
                            try {
                                await api.startMatch(matchId);
                                // Não precisa fazer mais nada aqui, o MQTT cuidará do redirecionamento
                            } catch (error) {
                                console.error("Erro ao iniciar a partida:", error);
                                Alert.alert("Erro", "Não foi possível iniciar a partida.");
                            }
                        },
                        style: "destructive"
                    }
                ]
            );
        };
    // --- FUNÇÃO DE ENTRAR NA PARTIDA (SEM ATUALIZAÇÃO OTIMISTA) ---
    const handleJoinTeam = async () => {
        if (!matchDetails || !currentUser || isJoining) return;
        
        if (players.some(p => p.id === currentUser.id)) {
            Alert.alert("Aviso", "Você já está nesta partida.");
            return;
        }
        
        if (players.length >= matchDetails.max_players) {
            Alert.alert("Aviso", "Esta partida já está cheia.");
            return;
        }
        
        try {
            setIsJoining(true);
            console.log('🎯 Tentando entrar na partida via API:', matchDetails.id);
            await api.joinMatch(matchDetails.id);
            console.log('✅ Sucesso ao chamar API. Aguardando MQTT para atualização da UI.');
            // A UI será atualizada pela mensagem MQTT que o backend enviará.
            
        } catch (error) {
            console.error('❌ Erro ao entrar na partida:', error);
            const errorMessage = error.response?.data?.detail || "Não foi possível entrar na partida.";
            Alert.alert("Erro", errorMessage);
        } finally {
            setIsJoining(false);
        }
    };

    const { teamA, teamB } = dividePlayersIntoTeams(players);
    const teamASlots = createPlayerSlots(teamA, totalPlayersPerTeam);
    const teamBSlots = createPlayerSlots(teamB, totalPlayersPerTeam);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {matchDetails?.title || 'Lobby'}
                </Text>
                <TouchableOpacity style={styles.shareButton}>
                    <Icon name="share-2" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.playersInfoContainer}>
                    <Text style={styles.playersInfoText}>
                        {players.length} / {matchDetails?.max_players || 0} jogadores
                    </Text>
                </View>

                <View style={styles.teamsDisplayCard}>
                    <View style={styles.teamColumn}>
                        <Text style={styles.teamColumnTitle}>TIME A</Text>
                        {teamASlots.map((player, index) => (
                            <PlayerAvatar 
                                key={`A-${index}`} 
                                player={player} 
                                onAddPress={handleJoinTeam} 
                            />
                        ))}
                    </View>
                    
                    <View style={styles.teamColumn}>
                        <Text style={styles.teamColumnTitle}>TIME B</Text>
                        {teamBSlots.map((player, index) => (
                            <PlayerAvatar 
                                key={`B-${index}`} 
                                player={player} 
                                onAddPress={handleJoinTeam} 
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.matchActionsContainer}>
                    <TouchableOpacity 
                        style={[
                            styles.joinMatchButton, 
                            (isJoining || players.some(p => p.id === currentUser?.id)) && styles.joinMatchButtonDisabled
                        ]}
                        onPress={handleJoinTeam}
                        disabled={isJoining || players.some(p => p.id === currentUser?.id)}
                    >
                        {isJoining ? (
                            <ActivityIndicator size="small" color={theme.colors.white} />
                        ) : (
                            <Text style={styles.joinMatchButtonText}>
                                {players.some(p => p.id === currentUser?.id) ? 'VOCÊ ESTÁ NA PARTIDA' : 'ENTRAR NA PARTIDA'}
                            </Text>
                        )}
                    </TouchableOpacity>
                    
                    {currentUser?.id === matchDetails?.creator_id && (
                        <TouchableOpacity style={styles.startMatchButton} onPress={handleStartMatch}>
                            <Text style={styles.startMatchButtonText}>INICIAR PARTIDA</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

// Seus estilos (styles) permanecem os mesmos
const styles = StyleSheet.create({
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    container: { 
        flex: 1, 
        backgroundColor: theme.colors.background 
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingVertical: theme.spacing.medium, 
        paddingHorizontal: theme.spacing.medium, 
        borderBottomWidth: 1, 
        borderBottomColor: theme.colors.surface 
    },
    backButton: { 
        padding: 5 
    },
    headerTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: theme.colors.text, 
        flex: 1, 
        textAlign: 'center', 
        marginHorizontal: 10 
    },
    shareButton: { 
        padding: 5 
    },
    scrollContent: { 
        paddingBottom: theme.spacing.large 
    },
    playersInfoContainer: {
        alignItems: 'center',
        marginVertical: theme.spacing.medium
    },
    playersInfoText: {
        fontSize: 16,
        color: theme.colors.text,
        fontWeight: '600'
    },
    teamsDisplayCard: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginHorizontal: theme.spacing.large, 
        backgroundColor: theme.colors.surface, 
        borderRadius: theme.radius.medium, 
        padding: theme.spacing.large, 
        elevation: 3, 
        marginTop: theme.spacing.medium, 
        marginBottom: theme.spacing.large 
    },
    teamColumn: { 
        flex: 1, 
        alignItems: 'center' 
    },
    teamColumnTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: theme.colors.text, 
        marginBottom: theme.spacing.large 
    },
    playerSlotContainer: { 
        alignItems: 'center', 
        marginBottom: theme.spacing.medium, 
        width: '100%' 
    },
    avatarCircle: { 
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        backgroundColor: theme.colors.background, 
        justifyContent: 'center', 
        alignItems: 'center', 
        overflow: 'hidden' 
    },
    avatarEmpty: { 
        borderStyle: 'dashed', 
        borderWidth: 1, 
        borderColor: theme.colors.placeholder 
    },
    avatar: { 
        width: '100%', 
        height: '100%' 
    },
    playerNameSlot: { 
        fontSize: 14, 
        color: theme.colors.text, 
        marginTop: theme.spacing.small, 
        textAlign: 'center' 
    },
    matchActionsContainer: { 
        marginHorizontal: theme.spacing.large, 
        marginTop: theme.spacing.large, 
        alignItems: 'center',
        gap: theme.spacing.medium
    },
    joinMatchButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.medium,
        paddingVertical: theme.spacing.medium,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        elevation: 3,
        minHeight: 50,
    },
    joinMatchButtonDisabled: {
        backgroundColor: theme.colors.placeholder,
        opacity: 0.8
    },
    joinMatchButtonText: {
        color: theme.colors.white || '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    startMatchButton: { 
        backgroundColor: theme.colors.yellow, 
        borderRadius: theme.radius.medium, 
        paddingVertical: theme.spacing.medium, 
        alignItems: 'center', 
        width: '100%', 
        elevation: 3 
    },
    startMatchButtonText: { 
        color: theme.colors.primary, 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
});