// src/screens/MapaScreen.tsx
import React, { useRef, useCallback } from 'react'; // 1. Importar os hooks necessários
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // 2. Importar o useFocusEffect
import { theme } from '../theme';

// Coordenadas iniciais para centralizar o mapa em Brasília, Asa Norte.
const initialRegion = {
    latitude: -15.7801,
    longitude: -47.9292,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

// Dados de exemplo para os marcadores no mapa, incluindo imagens
const mockCourts = [
    { id: '1', title: 'Quadra 209 Norte', coordinate: { latitude: -15.773, longitude: -47.881 }, image: 'https://images.unsplash.com/photo-1599422484263-549b73a21534?w=800' },
    { id: '2', title: 'Quadra da 405 Norte', coordinate: { latitude: -15.786, longitude: -47.882 }, image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800' },
    { id: '3', title: 'Campo Society - Lago Norte', coordinate: { latitude: -15.75, longitude: -47.86 }, image: 'https://images.unsplash.com/photo-1511886424795-b2b7244a496b?w=800' },
    { id: '4', title: 'Quadra de esportes SQN 206', coordinate: { latitude: -15.782, longitude: -47.876 }, image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=687&auto=format&fit=crop' },
    { id: '5', title: 'Quadra de futsal 104/105 norte', coordinate: { latitude: -15.789, longitude: -47.879 }, image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=686&auto=format&fit=crop' },
];

export function MapaScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    // 3. Criar uma referência para podermos "conversar" com o componente do mapa
    const mapRef = useRef<MapView>(null);

    // 4. Este hook é executado TODA VEZ que a tela do mapa entra em foco
    useFocusEffect(
        useCallback(() => {
            // Um pequeno atraso garante que o mapa foi completamente renderizado antes de tentarmos animá-lo
            const timeout = setTimeout(() => {
                mapRef.current?.animateToRegion(initialRegion, 1000); // 1000ms para uma animação suave
            }, 100);

            // Esta função de limpeza é importante para evitar erros se o utilizador navegar muito rápido
            return () => clearTimeout(timeout);
        }, [])
    );

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <MapView
                ref={mapRef} // 5. Ligar a nossa referência ao componente MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
            >
                {/* Os marcadores são renderizados normalmente, pois fazem parte do componente */}
                {mockCourts.map(court => (
                    <Marker
                        key={court.id}
                        coordinate={court.coordinate}
                        title={court.title}
                        pinColor={theme.colors.primary}
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
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
});
