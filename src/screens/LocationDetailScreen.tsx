import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
    FlatList,
    Dimensions,
    Linking
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Detalhes mock por id de quadra
const mockCourtDetails: Record<string, any> = {
    '1': {
        name: 'Real Society',
        rating: 4.5,
        reviews: 1097,
        title: 'Campo Society Sintético',
        description: 'Complexo com 5 quadras sintéticas, estacionamento, bar, escolinha de futebol e churrasqueira. Agende com antecedência.',
        address: 'S/n Trecho 3 21, Setor Hípico Sul, DF, 70610-000',
        price: 'R$ 150 / Hora',
        hours: [
            { day: 'Segunda-Quinta', time: '9h–1h' },
            { day: 'Sexta', time: '9h–23h' },
            { day: 'Sábado', time: '8h–21h' },
            { day: 'Domingo', time: '17h–21h' },
        ],
        phone: '(61) 99849-9094',
        email: 'financeirorealfutebol@gmail.com',
        images: [
            'https://stampagramas.com.br/wp-content/uploads/2020/10/2020-10-21-quadra-sintetica-1.jpg',
            'https://www.terravivapousada.com.br/wp-content/uploads/2021/10/TERRAVIVA-35.jpg',
            'https://www.folhadevalinhos.com.br/wp-content/uploads/2023/11/quadra_futebol_society.jpg',
        ]
    },
    '2': {
        name: 'Amarelinho Society',
        rating: 4.2,
        reviews: 834,
        title: 'Quadra de Futebol 7 Coberta',
        description: 'Quadra coberta com grama sintética, iluminação noturna, vestiários e café no local.',
        address: 'Colônia Agrícola Águas Claras, Chácara 36 nº 17',
        price: 'R$ 120 / Hora',
        hours: [
            { day: 'Segunda-Sexta', time: '7h–22h' },
            { day: 'Sábado', time: '8h–20h' },
            { day: 'Domingo', time: '8h–18h' },
        ],
        phone: '(61) 99600-1234',
        email: 'contato@amarelinhosociety.com.br',
        images: [
            'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
            'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=800',
            'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800',
        ]
    },
    '3': {
        name: 'Society do Toni',
        rating: 4.8,
        reviews: 1560,
        title: 'Society ao Ar Livre',
        description: 'Local tranquilo, 3 quadras sintéticas com rede de proteção, lanchonete e espaço para festas.',
        address: 'St. de Indústrias Q 5 - Sobradinho, Brasília - DF, 70297-400',
        price: 'R$ 130 / Hora',
        hours: [
            { day: 'Segunda-Sexta', time: '8h–21h' },
            { day: 'Sábado', time: '8h–22h' },
            { day: 'Domingo', time: '9h–20h' },
        ],
        phone: '(61) 99777-4321',
        email: 'tonisociety@gmail.com',
        images: [
            'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
            'https://images.unsplash.com/photo-1511886424795-b2b7244a496b?w=800',
            'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
        ]
    }
};

// Componente de avaliação por estrelas
const StarRating = ({ rating }: { rating: number }) => (
    <View style={styles.starContainer}>
        {[...Array(5)].map((_, index) => (
            <Icon
                key={index}
                name="star"
                size={18}
                color={index < Math.floor(rating) ? theme.colors.yellow : theme.colors.surface}
            />
        ))}
    </View>
);

// Linha de informação com ícone
const InfoRow = ({ icon, text }: { icon: string; text: string }) => (
    <View style={styles.infoRow}>
        <Icon name={icon} size={24} color={theme.colors.primary} />
        <Text style={styles.infoText}>{text}</Text>
    </View>
);

export function LocationDetailScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { courtId } = route.params as { courtId: string };
    const detail = mockCourtDetails[courtId];

    if (!detail) {
        return (
            <View style={styles.container}>
                <Text>Quadra não encontrada</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <View style={{ height: insets.top, backgroundColor: theme.colors.background }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>INFORMAÇÕES</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView>
                <FlatList
                    data={detail.images}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Image source={{ uri: item }} style={styles.carouselImage} />
                    )}
                />

                <View style={styles.contentContainer}>
                    <Text style={styles.courtName}>{detail.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingLabel}>Avaliações:</Text>
                        <StarRating rating={detail.rating} />
                        <Text style={styles.reviewCount}>{detail.reviews}</Text>
                    </View>

                    <Text style={styles.title}>{detail.title}</Text>
                    <Text style={styles.description}>{detail.description}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.infoSectionTitle}>Endereço:</Text>
                    <InfoRow icon="map-pin" text={detail.address} />

                    <Text style={styles.infoSectionTitle}>Valores:</Text>
                    <InfoRow icon="dollar-sign" text={detail.price} />

                    <Text style={styles.infoSectionTitle}>Horário de Funcionamento:</Text>
                    <View style={styles.hoursContainer}>
                        <Icon name="clock" size={24} color={theme.colors.primary} />
                        <View style={{ marginLeft: theme.spacing.medium }}>
                            {detail.hours.map((item: any) => (
                                <Text key={item.day} style={styles.infoText}>
                                    <Text style={{ fontWeight: 'bold' }}>{item.day}:</Text> {item.time}
                                </Text>
                            ))}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.infoSectionTitle}>Telefone:</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${detail.phone.replace(/[^0-9]/g, '')}`)}>
                        <InfoRow icon="phone" text={detail.phone} />
                    </TouchableOpacity>

                    <Text style={styles.infoSectionTitle}>Email:</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(`mailto:${detail.email}`)}>
                        <InfoRow icon="mail" text={detail.email} />
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.medium,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surface,
    },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
    carouselImage: { width: width, height: 250 },
    contentContainer: { padding: theme.spacing.large },
    courtName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.small,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.medium,
    },
    ratingLabel: { marginRight: theme.spacing.small, color: theme.colors.text },
    starContainer: { flexDirection: 'row', marginRight: theme.spacing.small },
    reviewCount: { color: theme.colors.placeholder },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.small,
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        color: theme.colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.surface,
        marginVertical: theme.spacing.large,
    },
    infoSectionTitle: {
        fontWeight: 'bold',
        color: theme.colors.placeholder,
        marginBottom: theme.spacing.small,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.medium,
    },
    infoText: {
        marginLeft: theme.spacing.medium,
        fontSize: 16,
        color: theme.colors.text,
        flex: 1,
    },
    hoursContainer: { flexDirection: 'row', alignItems: 'flex-start' },
});
