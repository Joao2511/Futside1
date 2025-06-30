import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    TextInput,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api'; // Importando nosso serviço de API
// Componente para as estrelas de avaliação

const StarRating = ({ rating }: { rating: number }) => {
    const totalStars = 5;
    return (
        <View style={styles.starContainer}>
            {[...Array(totalStars)].map((_, index) => (
                <Icon
                    key={index}
                    name="star"
                    size={30}
                    fill={index < rating ? theme.colors.yellow || '#FDB813' : 'none'}
                    color={index < rating ? theme.colors.yellow || '#FDB813' : theme.colors.white}
                />
            ))}
        </View>
    );
};

export function CourtDetailScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = useAuth(); // Pegar o utilizador autenticado

    // Recebe o fieldId da navegação
    const { fieldId } = route.params as { fieldId: number };

    // Estados para os dados da quadra e do formulário
    const [field, setField] = useState<api.FieldResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [matchTime, setMatchTime] = useState('');
    const [selectedPlayers, setSelectedPlayers] = useState(10); // Valor numérico para max_players

    // Busca os detalhes da quadra quando a tela é carregada
    useEffect(() => {
        const fetchDetails = async () => {
            if (!fieldId) return;
            try {
                setLoading(true);
                const data = await api.getFieldDetails(fieldId);
                setField(data);
            } catch (error) {
                Alert.alert("Erro", "Não foi possível carregar os detalhes da quadra.");
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [fieldId]);

// CourtDetailScreen.tsx

const handleCreateMatch = async () => {
    if (!field || !matchTime || !user) return;

    if (!/^\d{2}:\d{2}$/.test(matchTime)) {
        Alert.alert("Erro de Formato", "Por favor, insira um horário válido no formato hh:mm.");
        return;
    }

    setLoading(true); // Mova o setLoading para o início

    try {
        // --- INÍCIO DA CORREÇÃO ---
        
        // Pega a data de hoje no formato YYYY-MM-DD
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses são de 0-11
        const day = String(today.getDate()).padStart(2, '0');
        const matchDateStr = `${year}-${month}-${day}`;

        // Cria objetos Date para manipular o tempo de forma segura
        const [startHour, startMinute] = matchTime.split(':').map(Number);
        
        const startTimeObj = new Date(today);
        startTimeObj.setHours(startHour, startMinute, 0, 0);

        // Adiciona 1 hora para o end_time
        const endTimeObj = new Date(startTimeObj.getTime() + 60 * 60 * 1000);

        // Formata as horas para o formato "HH:mm:ss" que a API espera
        const formatTime = (dateObj: Date) => {
            const h = String(dateObj.getHours()).padStart(2, '0');
            const m = String(dateObj.getMinutes()).padStart(2, '0');
            const s = String(dateObj.getSeconds()).padStart(2, '0');
            return `${h}:${m}:${s}`;
        };

        const matchData: api.MatchCreatePayload = {
            field_id: field.id,
            title: `Partida em ${field.name}`,
            date: matchDateStr,
            start_time: formatTime(startTimeObj),
            end_time: formatTime(endTimeObj),
            max_players: selectedPlayers
        };

        // --- FIM DA CORREÇÃO ---

        const newMatch = await api.createMatch(matchData);
        
        Alert.alert("Sucesso!", "A sua partida foi criada.");
        navigation.navigate('PartidasStack', { 
            screen: 'Lobby', 
            params: { matchId: newMatch.id } 
        });

    } catch (error) {
        console.error("Erro ao criar partida:", error.response?.data || error.message);
        // Fornece um erro mais detalhado se disponível
        const detail = error.response?.data?.detail;
        let errorMessage = "Não foi possível criar a partida.";
        if (detail) {
            // Pega a primeira mensagem de erro do Pydantic, que é mais útil
            errorMessage += `\n\nDetalhe: ${JSON.stringify(detail[0] || detail)}`;
        }
        Alert.alert("Erro", errorMessage);
    } finally {
        setLoading(false);
    }
};

    const handleTimeChange = (text: string) => {
        // (Lógica de formatação de tempo inalterada)
        const numericText = text.replace(/[^0-9]/g, '');
        const limitedText = numericText.slice(0, 4);
        if (limitedText.length > 2) {
            setMatchTime(`${limitedText.slice(0, 2)}:${limitedText.slice(2)}`);
        } else {
            setMatchTime(limitedText);
        }
    };
    
    // Ecrã de carregamento
    if (loading || !field) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.screenContainer}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="chevron-left" size={30} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Image source={require('../assets/logo2.png')} style={styles.logo} resizeMode="contain" />
                    <View style={{ width: 30 }} />
                </View>

                <View style={styles.mainCard}>
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=687&auto=format&fit=crop' }}
                        style={styles.cardImageSection}
                        resizeMode="cover"
                    >
                        <View style={styles.cardOverlay} />
                        <Text style={styles.courtName}>{field.name}</Text>
                    </ImageBackground>

                    <ImageBackground
                        source={require('../assets/card.png')}
                        style={styles.formSection}
                        imageStyle={{ tintColor: 'rgba(0,0,0,0.05)' }}
                    >
                        <Text style={styles.sectionTitle}>CRIAR PARTIDA</Text>
                        
                        <View style={styles.formRow}>
                            <Text style={styles.label}>ORGANIZADOR:</Text>
                            <TextInput placeholderTextColor={'#8F8F8F'}  style={[styles.input, styles.readOnlyInput]} value={user?.name} editable={false} />
                        </View>

                        <View style={styles.formRow}>
                            <Text style={styles.label}>JOGADORES:</Text>
                            <View style={styles.optionsContainer}>
                                {[8, 10, 12].map(option => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[styles.optionButton, selectedPlayers === option && styles.optionSelected]}
                                        onPress={() => setSelectedPlayers(option)}
                                    >
                                        <Text style={[styles.optionText, selectedPlayers === option && styles.optionTextSelected]}>{option / 2}V{option / 2}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.formRow}>
                            <Text style={styles.label}>HORÁRIO:</Text>
                            <TextInput
                                style={[styles.input, styles.timeInput]}
                                placeholder="hh:mm"
                                placeholderTextColor={'#8F8F8F'} 
                                keyboardType="numeric"
                                value={matchTime}
                                onChangeText={handleTimeChange}
                                maxLength={5}
                            />
                        </View>
                        
                        <TouchableOpacity style={styles.createButton} onPress={handleCreateMatch}>
                            <Text style={styles.createButtonText}>CRIAR PARTIDA</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
    screenContainer: { flex: 1, backgroundColor: theme.colors.background },
    scrollContainer: { paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.small, paddingHorizontal: theme.spacing.medium },
    backButton: { padding: 5 },
    logo: { height: 50, width: 150 },
    mainCard: { marginHorizontal: theme.spacing.large, marginTop: theme.spacing.medium, borderRadius: theme.radius.medium, backgroundColor: theme.colors.primary, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, overflow: 'hidden' },
    cardImageSection: { height: 150, justifyContent: 'flex-end', padding: theme.spacing.medium },
    cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
    courtName: { fontSize: 28, fontWeight: 'bold', color: theme.colors.white, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 },
    formSection: { padding: theme.spacing.large },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.white, textAlign: 'center', marginBottom: theme.spacing.large },
    formRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.large },
    label: { fontSize: 16, fontWeight: 'bold', color: theme.colors.white, width: 120 },
    input: { flex: 1, backgroundColor: theme.colors.white, borderRadius: theme.radius.medium, paddingHorizontal: theme.spacing.medium, height: 50, fontSize: 16, color: theme.colors.text },
    readOnlyInput: { backgroundColor: '#f0f0f0' },
    optionsContainer: { flex: 1, flexDirection: 'row', gap: theme.spacing.medium },
    optionButton: { flex: 1, backgroundColor: theme.colors.white, paddingVertical: 14, borderRadius: theme.radius.medium, alignItems: 'center', justifyContent: 'center' },
    optionSelected: { backgroundColor: theme.colors.yellow },
    optionText: { fontWeight: 'bold', fontSize: 16, color: theme.colors.text },
    optionTextSelected: { color: theme.colors.text },
    timeInput: { flex: 0.7 },
    starContainer: { flexDirection: 'row', gap: 4 },
    createButton: { backgroundColor: theme.colors.yellow, padding: theme.spacing.medium, borderRadius: theme.radius.medium, alignItems: 'center', marginTop: theme.spacing.medium, height: 52, justifyContent: 'center' },
    createButtonText: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
});
