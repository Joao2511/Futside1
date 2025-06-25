// src/screens/MapaScreen.tsx
import React from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// 1. Importar o hook de navegação
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

// Coordenadas iniciais para centralizar o mapa em Brasília, Asa Norte.
const initialRegion = {
    latitude: -15.7801,
    longitude: -47.9292,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

// 2. Adicionar uma imagem a cada quadra para passar como parâmetro
const mockCourts = [
    { id: '1', title: 'Quadra Poliesportiva 416', coordinate: { latitude: -15.7655, longitude: -47.8825 }, image: 'https://images.unsplash.com/photo-1599422484263-549b73a21534?w=800' },
    { id: '2', title: 'Quadra da 209 Norte', coordinate: { latitude: -15.773, longitude: -47.881 }, image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800' },
    { id: '3', title: 'Quadra de Futebol', coordinate: { latitude: -15.785, longitude: -47.889 }, image: 'https://images.unsplash.com/photo-1511886424795-b2b7244a496b?w=800' },
    { id: '4', title: 'Quadra de esportes SQN 206', coordinate: { latitude: -15.782, longitude: -47.876 }, image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=687&auto=format&fit=crop' },
    { id: '5', title: 'Quadra de futsal 104/105 norte', coordinate: { latitude: -15.789, longitude: -47.879 }, image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=686&auto=format&fit=crop' },
];

export function MapaScreen() {
    const insets = useSafeAreaInsets();
    // 3. Inicializar o hook de navegação
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
            >
                {mockCourts.map(court => (
                    <Marker
                        key={court.id}
                        coordinate={court.coordinate}
                        title={court.title}
                        pinColor={theme.colors.primary}
                        // 4. Adicionar o onPress para navegar para a tela de detalhes
                        onPress={() => navigation.navigate('CourtDetail', { 
                            courtName: court.title, 
                            image: court.image 
                        })}
                    />
                ))}
            </MapView>

            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                 <Text style={styles.headerTitle}>QUADRAS ESPORTIVAS</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.yellow || '#FDB813',
        paddingVertical: 12,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
});
