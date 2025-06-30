import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet, View, Text, StatusBar, ActivityIndicator } from 'react-native';
// PROVIDER_GOOGLE é removido, pois usaremos o padrão com uma camada customizada
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme';
import * as api from '../services/api'; // Importando nosso serviço de API

// Coordenadas iniciais para centralizar o mapa em Brasília.
const initialRegion = {
    latitude: -15.7801,
    longitude: -47.9292,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}; 

export function MapaScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const mapRef = useRef<MapView>(null);

    // Estados para os dados reais e para o loading
    const [courts, setCourts] = useState<api.FieldResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // useFocusEffect busca os dados toda vez que a tela é focada
    useFocusEffect(
        useCallback(() => {
            const fetchCourts = async () => {
                try {
                    setLoading(true);
                    // Usando a função do nosso serviço de API para buscar as quadras
                    const fetchedCourts = await api.getFieldsFeed();
                    setCourts(fetchedCourts);
                } catch (error) {
                    console.error("Erro ao buscar quadras para o mapa:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCourts();
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
                ref={mapRef}
                style={styles.map}
                initialRegion={initialRegion} // Definimos a região inicial aqui
            >
                {/* INCLUSÃO DA CAMADA DE MAPA DO OPENSTREETMAP */}
                <UrlTile
                    urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maximumZ={19}
                    flipY={false} // Padrão para a maioria dos provedores de tiles
                />

                {/* Renderiza os marcadores dinamicamente com base nos dados da API */}
                {courts.map(court => (
                    <Marker
                        key={court.id}
                        coordinate={{
                            // Converte a latitude e longitude (que podem vir como string) para número
                            latitude: parseFloat(court.latitude as any),
                            longitude: parseFloat(court.longitude as any),
                        }}
                        title={court.name}
                        description={court.address}
                        pinColor={theme.colors.primary}
                        onCalloutPress={() => navigation.navigate('LocacaoStack', { 
                            screen: 'CourtDetail', 
                            params: { fieldId: court.id } 
                        })}
                    />
                ))}
            </MapView>

            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                   <Text style={styles.headerTitle}>QUADRAS PRÓXIMAS</Text>
            </View>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            )}
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fundo semitransparente para melhor leitura
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
