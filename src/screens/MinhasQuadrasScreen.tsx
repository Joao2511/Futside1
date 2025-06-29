// src/screens/MinhasQuadrasScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

const mockManagerCourts = [
    {
        id: '1',
        name: 'Real Society',
        address: 'S/n Trecho 3 21, Setor Hípico Sul, DF, 70610-000',
        image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=687&auto=format&fit=crop'
    },
    {
        id: '2',
        name: 'Amarelinho Society',
        address: 'Colônia Agrícola Águas Claras, Chácara 36 nº 17',
        image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=686&auto=format&fit=crop'
    },
];

const CourtCard = ({ court }: { court: typeof mockManagerCourts[0] }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity>
            <ImageBackground
                source={{ uri: court.image }}
                style={styles.cardContainer}
                imageStyle={{ borderRadius: theme.radius.medium }}
            >
                <View style={styles.cardOverlay} />
                <View style={styles.cardContent}>
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
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};


export function MinhasQuadrasScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>MINHAS QUADRAS</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {mockManagerCourts.map(court => (
                    <CourtCard key={court.id} court={court} />
                ))}

                <TouchableOpacity style={styles.addCourtButton}>
                    <Icon name="plus" size={40} color={theme.colors.placeholder} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.medium, paddingHorizontal: theme.spacing.medium, borderBottomWidth: 1, borderBottomColor: theme.colors.surface },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
    scrollContainer: { padding: theme.spacing.large, paddingBottom: 80 },
    cardContainer: { height: 180, borderRadius: theme.radius.medium, marginBottom: theme.spacing.large, backgroundColor: theme.colors.primary, overflow: 'hidden' },
    cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
    cardContent: { padding: theme.spacing.medium, justifyContent: 'space-between', flex: 1 },
    tag: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 15, paddingVertical: 5, paddingHorizontal: 10, alignSelf: 'flex-start', alignItems: 'center' },
    tagText: { color: theme.colors.text, marginLeft: theme.spacing.small, fontWeight: 'bold', fontSize: 12 },
    courtName: { color: theme.colors.white, fontSize: 22, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 10 },
    courtAddress: { color: theme.colors.white, opacity: 0.9, fontSize: 14, marginTop: 4 },
    cardButton: { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: theme.radius.small, paddingVertical: 10, paddingHorizontal: 15, alignSelf: 'flex-start' },
    cardButtonText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 12 },
    addCourtButton: { height: 180, borderRadius: theme.radius.medium, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: theme.colors.surface, borderStyle: 'dashed' },
});
