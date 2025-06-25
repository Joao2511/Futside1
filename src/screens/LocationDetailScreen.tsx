// src/screens/LocationDetailScreen.tsx
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
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const mockCourtDetails = {
    name: 'Real Society',
    rating: 4.5,
    reviews: 1097,
    title: 'Campo de futebol em Brasília, Distrito Federal',
    description: '5 quadras de Futebol Society Sintético (descoberta), Estacionamento com segurança, Bar, Escolinha RONALDO ACADEMY, escola de futebol parceira da Real Park Society, aulas no complexo em todos os campos. Churrasqueira, O uso da churrasqueira está disponível aos nossos clientes. É necessário agendar com antecedência.\nSalão de Festas disponibilizamos nosso espaço para festas, Vestiário disponível.',
    address: 's/n Trecho 3 21, Setor Hípico Sul, DF, 70610-000',
    price: '150,00 R$ / Hora (agendar antecipadamente)',
    hours: [
        { day: 'Segunda-Quinta', time: '9h-1h' },
        { day: 'Sexta', time: '9h-23h' },
        { day: 'Sábado', time: '8h-21h' },
        { day: 'Domingo', time: '17h-21h' },
    ],
    phone: '(61) 99849-9094',
    email: 'financeirorealfutebol@gmail.com',
    images: [
        'https://stampagramas.com.br/wp-content/uploads/2020/10/2020-10-21-quadra-sintetica-1.jpg',
        'https://www.terravivapousada.com.br/wp-content/uploads/2021/10/TERRAVIVA-35.jpg',
        'https://www.folhadevalinhos.com.br/wp-content/uploads/2023/11/quadra_futebol_society.jpg',
    ]
};

const StarRating = ({ rating }: { rating: number }) => (
    <View style={styles.starContainer}>
        {[...Array(5)].map((_, index) => (
            <Icon
                key={index}
                name="star"
                size={18}
                fill={index < Math.floor(rating) ? theme.colors.yellow : 'none'}
                color={theme.colors.yellow}
            />
        ))}
    </View>
);

const InfoRow = ({ icon, text }: { icon: string, text: string }) => (
    <View style={styles.infoRow}>
        <Icon name={icon} size={24} color={theme.colors.primary} />
        <Text style={styles.infoText}>{text}</Text>
    </View>
);

export function LocationDetailScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
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
                    data={mockCourtDetails.images}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Image source={{ uri: item }} style={styles.carouselImage} />
                    )}
                />

                <View style={styles.contentContainer}>
                    <Text style={styles.courtName}>{mockCourtDetails.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingLabel}>Avaliações:</Text>
                        <StarRating rating={mockCourtDetails.rating} />
                        <Text style={styles.reviewCount}>{mockCourtDetails.reviews}</Text>
                    </View>

                    <Text style={styles.title}>{mockCourtDetails.title}</Text>
                    <Text style={styles.description}>{mockCourtDetails.description}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.infoSectionTitle}>Endereço:</Text>
                    <InfoRow icon="map-pin" text={mockCourtDetails.address} />

                    <Text style={styles.infoSectionTitle}>Valores:</Text>
                    <InfoRow icon="dollar-sign" text={mockCourtDetails.price} />

                    <Text style={styles.infoSectionTitle}>Horário de Funcionamento:</Text>
                    <View style={styles.hoursContainer}>
                        <Icon name="clock" size={24} color={theme.colors.primary} />
                        <View style={{ marginLeft: theme.spacing.medium }}>
                            {mockCourtDetails.hours.map(item => (
                                <Text key={item.day} style={styles.infoText}><Text style={{fontWeight: 'bold'}}>{item.day}:</Text> {item.time}</Text>
                            ))}
                        </View>
                    </View>
                    
                    <View style={styles.divider} />

                    <Text style={styles.infoSectionTitle}>Telefone:</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${mockCourtDetails.phone}`)}>
                        <InfoRow icon="phone" text={mockCourtDetails.phone} />
                    </TouchableOpacity>

                    <Text style={styles.infoSectionTitle}>Email:</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(`mailto:${mockCourtDetails.email}`)}>
                        <InfoRow icon="mail" text={mockCourtDetails.email} />
                    </TouchableOpacity>

                </View>
            </ScrollView>
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
    },
    carouselImage: {
        width: width,
        height: 250,
    },
    contentContainer: {
        padding: theme.spacing.large,
    },
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
    ratingLabel: {
        marginRight: theme.spacing.small,
        color: theme.colors.text,
    },
    starContainer: {
        flexDirection: 'row',
    },
    reviewCount: {
        marginLeft: theme.spacing.small,
        color: theme.colors.placeholder,
    },
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
    hoursContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    }
});
