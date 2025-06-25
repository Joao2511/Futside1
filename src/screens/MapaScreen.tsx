// src/screens/MapaScreen.tsx
import React from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
// 1. Importar o MapView e dependências
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';

// Coordenadas iniciais para centralizar o mapa em Brasília, Asa Norte.
const initialRegion = {
    latitude: -15.7801,
    longitude: -47.9292,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

// Dados de exemplo para os marcadores no mapa
const mockCourts = [
    { id: '1', title: 'Quadra Poliesportiva', coordinate: { latitude: -15.7655, longitude: -47.8825 } },
    { id: '2', title: 'Quadra da 209 Norte', coordinate: { latitude: -15.773, longitude: -47.881 } },
    { id: '3', title: 'Quadra de Futebol', coordinate: { latitude: -15.785, longitude: -47.889 } },
    { id: '4', title: 'Quadra de esportes SQN 206', coordinate: { latitude: -15.782, longitude: -47.876 } },
    { id: '5', title: 'Quadra de futsal 104/105 norte', coordinate: { latitude: -15.789, longitude: -47.879 } },
];

export function MapaScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            {/* 2. Substituir o WebView pelo MapView */}
            <MapView
                provider={PROVIDER_GOOGLE} // Essencial para usar o Google Maps no Android
                style={styles.map}
                initialRegion={initialRegion}
            >
                {mockCourts.map(court => (
                    <Marker
                        key={court.id}
                        coordinate={court.coordinate}
                        title={court.title}
                        pinColor={theme.colors.primary} // Deixa o marcador verde
                    />
                ))}
            </MapView>

            {/* O header agora é uma View separada sobreposta ao mapa */}
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
