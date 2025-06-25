// src/screens/LocacaoScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar
} from 'react-native';
// 1. Importar o hook da biblioteca
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';

// Dados de exemplo para as quadras
const mockCourts = [
    {
        id: '1',
        name: 'Real Society',
        address: 'S/n Trecho 3 21, Setor Hípico Sul, DF, 70610-000',
    },
    {
        id: '2',
        name: 'Amarelinho Society',
        address: 'Colônia Agrícola Águas Claras, Chácara 36 nº 17',
    },
    {
        id: '3',
        name: 'Society do Toni',
        address: 'St. de Indústrias Q 5 - Sobradinho, Brasília - DF, 70297-400',
    }
];

// Componente reutilizável para o card de locação (agora com cor sólida)
const LocationCard = ({ court }: { court: typeof mockCourts[0] }) => (
    <TouchableOpacity style={styles.cardContainer}>
        <View style={styles.tag}>
            <Icon name="dribbble" size={14} color={theme.colors.text} />
            <Text style={styles.tagText}>Campo Society</Text>
        </View>
        <View>
            <Text style={styles.courtName}>{court.name}</Text>
            <Text style={styles.courtAddress}>{court.address}</Text>
        </View>
        <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>VER MAIS</Text>
        </TouchableOpacity>
    </TouchableOpacity>
);

export function LocacaoScreen() {
    // 2. Obter o valor do espaçamento do topo
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            {/* 3. View amarela para o fundo da StatusBar */}
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>LOCAÇÃO</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {mockCourts.map(court => (
                    <LocationCard key={court.id} court={court} />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        // O paddingTop manual não é mais necessário
    },
    header: {
        paddingVertical: theme.spacing.medium,
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    scrollContainer: {
        padding: theme.spacing.large,
        paddingBottom: 80, // Espaço para não encostar na TabBar
    },
    cardContainer: {
        height: 180,
        borderRadius: theme.radius.medium,
        marginBottom: theme.spacing.large,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        backgroundColor: theme.colors.primary, // Cor verde sólida
        padding: theme.spacing.medium,
        justifyContent: 'space-between',
    },
    tag: {
        flexDirection: 'row',
        backgroundColor: theme.colors.white,
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        alignItems: 'center',
    },
    tagText: {
        color: theme.colors.text,
        marginLeft: theme.spacing.small,
        fontWeight: 'bold',
        fontSize: 12,
    },
    courtName: {
        color: theme.colors.white,
        fontSize: 22,
        fontWeight: 'bold',
    },
    courtAddress: {
        color: theme.colors.white,
        opacity: 0.9,
        fontSize: 14,
        marginTop: 4,
    },
    cardButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: theme.radius.small,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignSelf: 'flex-start',
    },
    cardButtonText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
});
