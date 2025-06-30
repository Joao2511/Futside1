import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, ImageBackground, ActivityIndicator, FlatList, TextInput, Alert, DeviceEventEmitter } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import { theme } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as api from '../services/api';

const FieldCard = ({ field, onPress }: { field: api.FieldResponse, onPress: () => void }) => (
    <TouchableOpacity onPress={onPress}>
        <ImageBackground source={require('../assets/card.png')} style={styles.fieldCardBackground} imageStyle={{ borderRadius: theme.radius.medium }}>
            <View style={styles.cardContent}>
                <View style={styles.tag}><Icon name="map-pin" size={14} color={theme.colors.text} /><Text style={styles.tagText}>{field.city}</Text></View>
                <Text style={styles.locationTitle}>{field.name}</Text>
                <Text style={styles.locationAddress}>{field.address}</Text>
            </View>
        </ImageBackground>
    </TouchableOpacity>
);

const RegionCheckbox = ({ label, isSelected, onToggle, disabled }: { label: string, isSelected: boolean, onToggle: () => void, disabled: boolean }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle} disabled={disabled}>
        <Icon name={isSelected ? 'check-square' : 'square'} size={24} color={disabled ? theme.colors.placeholder : theme.colors.primary} />
        <Text style={[styles.checkboxLabel, disabled && { color: theme.colors.placeholder }]}>{label}</Text>
    </TouchableOpacity>
);

export function HomeScreen() {
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [subscriptions, setSubscriptions] = useState({ 'Asa Sul': false, 'Asa Norte': false });
    const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
    const [matches, setMatches] = useState<api.MatchResponse[]>([]);
    const [fields, setFields] = useState<api.FieldResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [notificationCity, setNotificationCity] = useState('');

    // --- CORREÇÃO AQUI ---
    // A função de fetch agora não depende mais de 'loading', quebrando o loop.
    const fetchData = useCallback(async (isInitialLoad = false) => {
        // Mostra o indicador de loading apenas na carga inicial da tela
        if (isInitialLoad) {
            setLoading(true);
        }
        try {
            console.log("Buscando dados de partidas e quadras...");
            const [matchesResponse, fieldsResponse, mySubs] = await Promise.all([
                api.getMatchesFeed(),
                api.getFieldsFeed(),
                api.getMySubscriptions(), // Carrega as inscrições do usuário
            ]);
            setMatches(matchesResponse);
            setFields(fieldsResponse);
            const initialSubs = { 'Asa Sul': mySubs.includes('Asa Sul'), 'Asa Norte': mySubs.includes('Asa Norte') };
            setSubscriptions(initialSubs);
        } catch (error) {
            console.error("Erro ao buscar dados para a Home Screen:", error);
            Toast.show({ type: 'error', text1: 'Erro de Rede', text2: 'Não foi possível carregar os dados.' });
        } finally {
            // Sempre desliga o loading ao final
            setLoading(false);
        }
    }, []); // A array de dependências DEVE estar vazia.

    // Hook para buscar dados quando a tela é focada
    useFocusEffect(
        useCallback(() => {
            fetchData(true); // Passa 'true' para indicar que é uma carga inicial/foco
        }, [fetchData])
    );

    // Hook para ouvir o evento de nova partida criada
    useEffect(() => {
        console.log('HomeScreen: Configurando listener para newMatchCreated');
        const subscription = DeviceEventEmitter.addListener('newMatchCreated', () => {
            console.log('Evento newMatchCreated recebido! Recarregando partidas...');
            Toast.show({
                type: 'info',
                text1: 'Nova Partida na Área!',
                text2: 'Atualizando a lista de jogos.'
            });
            // Não precisa mais do 'isInitialLoad', a função já lida com isso
            fetchData();
        });

        return () => {
            console.log('HomeScreen: Removendo listener de newMatchCreated');
            subscription.remove();
        };
    }, [fetchData]); // A dependência aqui está correta, pois `fetchData` agora é estável
    
    const handleSubscriptionToggle = async (region: 'Asa Sul' | 'Asa Norte') => {
        const isCurrentlySubscribed = subscriptions[region];
        const newSubscriptionsState = { ...subscriptions, [region]: !isCurrentlySubscribed };

        // Atualiza a UI imediatamente para uma resposta rápida (atualização otimista)
        setSubscriptions(newSubscriptionsState);
        setLoadingSubscriptions(true);

        try {
            if (!isCurrentlySubscribed) {
                // Se não estava inscrito, inscreve agora
                await api.subscribeToRegion(region);
                Toast.show({ type: 'success', text1: `Inscrito em ${region}!` });
            } else {
                // Se estava inscrito, cancela a inscrição
                await api.unsubscribeFromRegion(region);
                Toast.show({ type: 'info', text1: `Inscrição para ${region} removida.` });
            }
        } catch (error) {
            console.error(`Erro ao atualizar inscrição para ${region}:`, error);
            Toast.show({ type: 'error', text1: 'Erro', text2: `Não foi possível atualizar a inscrição.` });
            // Em caso de erro, reverte a UI para o estado anterior
            setSubscriptions(prev => ({ ...prev, [region]: isCurrentlySubscribed }));
        } finally {
            setLoadingSubscriptions(false);
        }
    };
    const handleJoinMatch = async (matchId: number) => {
        try {
            await api.joinMatch(matchId);
            Alert.alert("Sucesso", "Você entrou na partida!");
            navigation.navigate('PartidasStack', { screen: 'Lobby', params: { matchId } });
        } catch (error) {
            Alert.alert("Erro", error.response?.data?.detail || "Não foi possível entrar na partida.");
        }
    };

    const handleSubscribe = async () => {
        if (!notificationCity) return;
        try {
            await api.subscribeToRegion(notificationCity);
            Alert.alert("Sucesso", `Você agora receberá notificações para partidas em ${notificationCity}.`);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível realizar a subscrição.");
        }
    };

    // O restante do seu componente JSX continua exatamente o mesmo
    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <ScrollView>
                <View style={styles.mainContent}>
                    <View style={styles.header}>
                        <Image source={require('../assets/logo2.png')} style={styles.logo} resizeMode="contain" />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.welcomeText}>Bem-vindo, <Text style={styles.welcomeName}>{user?.name || 'Jogador'}.</Text></Text>
                        <Text style={styles.sectionTitle}>PARTIDAS EM DESTAQUE</Text>
                        
                        {loading ? <ActivityIndicator color={theme.colors.primary} style={{ height: 150 }}/> : (
                            matches.length > 0 ? matches.map(match => (
                                <ImageBackground key={match.id} source={require('../assets/card.png')} style={styles.matchCardBackground} imageStyle={{ borderRadius: theme.radius.medium }}>
                                    <View style={styles.cardContent}>
                                        <View style={styles.matchHeader}>
                                            <Text style={styles.matchCardTitle} numberOfLines={1}>{match.title}</Text>
                                            <Text style={styles.matchCardSubtitle}>{match.field.name} - {match.field.city}</Text>
                                            <Text style={styles.matchCardDate}>{new Date(match.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} às {match.start_time.slice(0, 5)}</Text>
                                            <View style={styles.playersInfo}>
                                                <Icon name="users" size={16} color={theme.colors.white} />
                                                <Text style={styles.playersText}>{match.player_count} / {match.max_players} VAGAS</Text>
                                            </View>
                                        </View>
                                        <View style={styles.matchCardButtons}>
                                            <TouchableOpacity style={styles.detailsButton} onPress={() => navigation.navigate('PartidasStack', { screen: 'MatchDetail', params: { matchId: match.id } })}>
                                                <Text style={styles.detailsButtonText}>DETALHES</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.joinButton} onPress={() => handleJoinMatch(match.id)}>
                                                <Text style={styles.joinButtonText}>ENTRAR</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ImageBackground>
                            )) : <Text style={styles.noDataText}>Nenhuma partida agendada.</Text>
                        )}
                    </View>
                    
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>GERIR NOTIFICAÇÕES</Text>
                    <View style={styles.subscriptionBox}>
                        <Text style={styles.subscriptionText}>Selecione as regiões para receber alertas de novas partidas:</Text>
                        <RegionCheckbox
                            label="Asa Sul"
                            isSelected={subscriptions['Asa Sul']}
                            onToggle={() => handleSubscriptionToggle('Asa Sul')}
                            disabled={loadingSubscriptions}
                        />
                        <RegionCheckbox
                            label="Asa Norte"
                            isSelected={subscriptions['Asa Norte']}
                            onToggle={() => handleSubscriptionToggle('Asa Norte')}
                            disabled={loadingSubscriptions}
                        />
                        {loadingSubscriptions && <ActivityIndicator style={{ marginTop: 10 }} color={theme.colors.primary} />}
                    </View>
                </View>
                </View>
            </ScrollView>
        </View>
    );
}

// Seus estilos (styles) permanecem os mesmos
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    mainContent: { paddingBottom: 90 },
    header: { alignItems: 'center', paddingHorizontal: theme.spacing.large, paddingTop: theme.spacing.large },
    logo: { height: 120, width: 200 },
    welcomeText: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text, marginBottom: 16, paddingHorizontal: theme.spacing.large },
    welcomeName: { color: theme.colors.primary },
    section: { marginBottom: 24 }, 
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.medium, paddingHorizontal: theme.spacing.large },
    matchCardBackground: { borderRadius: theme.radius.medium, backgroundColor: theme.colors.primary, elevation: 3, marginHorizontal: theme.spacing.large, marginBottom: theme.spacing.medium, overflow: 'hidden' },
    cardContent: { padding: theme.spacing.medium, justifyContent: 'space-between', flex: 1 },
    matchHeader: { alignItems: 'center', marginBottom: 20, flex: 1, justifyContent: 'center' },
    matchCardTitle: { fontSize: 24, fontWeight: 'bold', color: theme.colors.white, textAlign: 'center' },
    matchCardDate: { color: theme.colors.white, fontSize: 14, opacity: 0.9, marginTop: 4 },
    cardButton: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: theme.radius.medium, paddingVertical: 12, alignItems: 'center' },
    cardButtonText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 14 },
    noDataText: { color: theme.colors.text, textAlign: 'center', fontStyle: 'italic', paddingVertical: 50 },
    noDataTextFeeds: { textAlign: 'center', fontStyle: 'italic', paddingVertical: 40, color: theme.colors.placeholder },
    fieldCardBackground: {
        width: 280,
        height: 150,
        marginRight: theme.spacing.medium,
        borderRadius: theme.radius.medium,
        justifyContent: 'flex-end',
        backgroundColor: theme.colors.surface,
        elevation: 2,
    },
    tag: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 15, paddingVertical: 5, paddingHorizontal: 10, alignSelf: 'flex-start', alignItems: 'center', marginBottom: theme.spacing.small },
    tagText: { color: theme.colors.text, marginLeft: theme.spacing.small, fontWeight: 'bold' },
    locationTitle: { color: theme.colors.white, fontSize: 22, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
    locationAddress: { color: theme.colors.white, opacity: 0.9, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
    playersInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
    playersText: { color: theme.colors.white, marginLeft: 8, fontWeight: 'bold' },
    subscriptionBox: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.medium, padding: theme.spacing.medium, marginHorizontal: theme.spacing.large },
    input: { borderWidth: 1, borderColor: theme.colors.placeholder, borderRadius: theme.radius.small, padding: 10, marginBottom: 10, color: theme.colors.text },
    subscribeButton: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: theme.radius.small, alignItems: 'center' },
    subscribeButtonText: { color: theme.colors.white, fontWeight: 'bold' },
    matchCardButtons: { flexDirection: 'row', marginTop: 15, gap: 10 },
    detailsButton: { flex: 1, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: theme.radius.medium, paddingVertical: 12, alignItems: 'center' },
    detailsButtonText: { color: theme.colors.white, fontWeight: 'bold' },
    joinButton: { flex: 1, backgroundColor: theme.colors.white, borderRadius: theme.radius.medium, paddingVertical: 12, alignItems: 'center' },
    joinButtonText: { color: theme.colors.primary, fontWeight: 'bold' },
    matchCardSubtitle: { color: theme.colors.white, opacity: 0.8 },
    subscriptionText: {
        color: theme.colors.text,
        marginBottom: theme.spacing.medium,
        fontSize: 14,
        lineHeight: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.small,
    },
    checkboxLabel: {
        marginLeft: theme.spacing.medium,
        fontSize: 16,
        color: theme.colors.text,
    },
});