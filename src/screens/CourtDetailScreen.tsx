// src/screens/CourtDetailScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    TextInput,
    Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation, useRoute } from '@react-navigation/native';

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
    const { courtName } = route.params as { courtName: string };

    const [selectedPlayers, setSelectedPlayers] = useState('4V4');
    const [matchTime, setMatchTime] = useState('');
    const [organizer, setOrganizer] = useState('');

    // Função para formatar o input de tempo
    const handleTimeChange = (text: string) => {
        // Remove qualquer caracter que não seja um número
        const numericText = text.replace(/[^0-9]/g, '');
        // Limita o input a 4 dígitos
        const limitedText = numericText.slice(0, 4);
    
        // Adiciona os ":" automaticamente
        if (limitedText.length > 2) {
            const formattedText = `${limitedText.slice(0, 2)}:${limitedText.slice(2)}`;
            setMatchTime(formattedText);
        } else {
            setMatchTime(limitedText);
        }
    };


    return (
        <View style={styles.screenContainer}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="chevron-left" size={30} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Image
                        source={require('../assets/logo2.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <View style={{ width: 30 }} />
                </View>

                <View style={styles.mainCard}>
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=687&auto=format&fit=crop' }}
                        style={styles.cardImageSection}
                        resizeMode="cover"
                    >
                        <View style={styles.cardOverlay} />
                        <Text style={styles.courtName}>{courtName}</Text>
                    </ImageBackground>

                    <ImageBackground
                        source={require('../assets/card.png')}
                        style={styles.formSection}
                        imageStyle={{ tintColor: 'rgba(0,0,0,0.05)' }}
                    >
                        <Text style={styles.sectionTitle}>PARTIDA</Text>
                        
                        <View style={styles.formRow}>
                            <Text style={styles.label}>ORGANIZADOR:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Seu nome"
                                value={organizer}
                                onChangeText={setOrganizer}
                                placeholderTextColor={theme.colors.placeholder}
                            />
                        </View>

                        <View style={styles.formRow}>
                            <Text style={styles.label}>JOGADORES:</Text>
                            <View style={styles.optionsContainer}>
                                {['4V4', '5V5', '6V6'].map(option => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[styles.optionButton, selectedPlayers === option && styles.optionSelected]}
                                        onPress={() => setSelectedPlayers(option)}
                                    >
                                        <Text style={[styles.optionText, selectedPlayers === option && styles.optionTextSelected]}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.formRow}>
                            <Text style={styles.label}>TEMPO:</Text>
                            <TextInput
                                style={[styles.input, styles.timeInput]}
                                placeholder="hh:mm"
                                placeholderTextColor={theme.colors.placeholder}
                                keyboardType="numeric"
                                value={matchTime}
                                onChangeText={handleTimeChange} // Usando a nova função de formatação
                                maxLength={5} // Limita o input a 5 caracteres (00:00)
                            />
                        </View>
                        
                        <View style={styles.formRow}>
                            <Text style={styles.label}>AVALIAÇÃO:</Text>
                            <StarRating rating={4} />
                        </View>
                        
                        <TouchableOpacity style={styles.createButton}>
                            <Text style={styles.createButtonText}>CRIAR PARTIDA</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.small,
        paddingHorizontal: theme.spacing.medium,
    },
    backButton: {
        padding: 5,
    },
    logo: {
        height: 50,
        width: 150,
    },
    mainCard: {
        marginHorizontal: theme.spacing.large,
        marginTop: theme.spacing.medium,
        borderRadius: theme.radius.medium,
        backgroundColor: theme.colors.primary,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    cardImageSection: {
        height: 150,
        justifyContent: 'flex-end',
        padding: theme.spacing.medium,
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    courtName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.white,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    formSection: {
        padding: theme.spacing.large,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.white,
        textAlign: 'center',
        marginBottom: theme.spacing.large,
    },
    formRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.large,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.white,
        width: 120,
    },
    input: {
        flex: 1,
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.medium,
        paddingHorizontal: theme.spacing.medium,
        height: 50, 
        fontSize: 16,
    },
    optionsContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: theme.spacing.medium,
    },
    optionButton: {
        flex: 1,
        backgroundColor: theme.colors.white,
        paddingVertical: 14,
        borderRadius: theme.radius.medium,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionSelected: {
        backgroundColor: theme.colors.yellow,
    },
    optionText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: theme.colors.text,
    },
    optionTextSelected: {
        color: theme.colors.text,
    },
    timeInput: {
        flex: 0.7,
    },
    starContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    createButton: {
        backgroundColor: theme.colors.yellow,
        padding: theme.spacing.medium,
        borderRadius: theme.radius.medium,
        alignItems: 'center',
        marginTop: theme.spacing.medium,
        height: 52,
        justifyContent: 'center',
    },
    createButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
});
