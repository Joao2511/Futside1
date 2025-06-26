import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region, Camera } from 'react-native-maps'; // Importado Camera e Region
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
    const mapRef = useRef<MapView>(null);

    // Usar um estado para armazenar a última câmera/região conhecida.
    // Inicializamos com a região de Brasília.
    const [lastKnownRegion, setLastKnownRegion] = useState<Region>(initialRegion);

    // `useFocusEffect` para animar a câmera para a última posição conhecida
    // quando a tela do mapa volta a ficar em foco.
    useFocusEffect(
        useCallback(() => {
            console.log('MapaScreen em foco. Última região salva:', lastKnownRegion);
            if (mapRef.current) {
                // Anima a câmera do mapa para a última região salva.
                // Isso é crucial para que o mapa volte ao estado que o usuário deixou.
                mapRef.current.animateToRegion(lastKnownRegion, 500);
            }
            return () => {
                // Opcional: registrar que a tela está perdendo o foco
                console.log('MapaScreen perdendo foco.');
            };
        }, [lastKnownRegion]) // Dependência: A função se re-executa se 'lastKnownRegion' mudar.
    );

    // Callback para quando o mapa é carregado pela primeira vez.
    // Usado para definir a câmera inicial se ela ainda não foi definida por uma interação.
    const handleMapReady = useCallback(() => {
        if (mapRef.current && mapRef.current.getCamera()) {
            mapRef.current.animateToRegion(initialRegion, 500);
            // Captura a região inicial para o estado
            mapRef.current.getMapBoundaries().then(boundaries => {
                // getMapBoundaries retorna northEast e southWest. Precisamos converter para Region.
                // Isso é uma estimativa, o ideal seria ter acesso direto à região inicial do mapa.
                // Para simplificar, usamos a initialRegion como fallback
                setLastKnownRegion(initialRegion);
            }).catch(error => {
                console.warn('Erro ao obter limites do mapa ao iniciar:', error);
                setLastKnownRegion(initialRegion);
            });
        }
    }, []);

    // Callback que é chamado continuamente enquanto o usuário interage com o mapa,
    // e também quando a interação termina. Usaremos onRegionChangeComplete.
    const handleRegionChangeComplete = useCallback((region: Region) => {
        // Atualiza o estado com a nova região do mapa após a interação do usuário.
        setLastKnownRegion(region);
        console.log('Região do mapa atualizada pelo usuário para:', region);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <MapView
                ref={mapRef} // Referência para manipular o mapa imperativamente
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                // REMOVIDO: A prop 'region' e 'initialRegion'.
                // O controle da câmera agora é feito via `mapRef.current.animateToRegion` ou `animateCamera`.
                onMapReady={handleMapReady} // Define a câmera inicial quando o mapa estiver pronto
                onRegionChangeComplete={handleRegionChangeComplete} // Salva a região atual após a interação do usuário
            >
                {mockCourts.map(court => (
                    <Marker
                        key={court.id}
                        coordinate={court.coordinate}
                        title={court.title}
                        pinColor={theme.colors.primary}
                        onPress={() => navigation.navigate('PartidasStack', {
                            screen: 'CourtDetail',
                            params: {
                                courtName: court.title,
                                image: court.image
                            }
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
