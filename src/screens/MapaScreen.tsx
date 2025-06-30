import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet, View, Text, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview'; // Importando o WebView
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme';
import * as api from '../services/api'; 

// Coordenadas iniciais para centralizar o mapa na Asa Sul, Brasília.
const initialRegion = {
    lat: -15.825,
    lng: -47.915,
    zoom: 13, // Zoom um pouco mais próximo
};

export function MapaScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    
    const [courts, setCourts] = useState<api.FieldResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchCourts = async () => {
                try {
                    setLoading(true);
                    const fetchedCourts = await api.getFieldsFeed();
                    const validCourts = fetchedCourts.filter(court => 
                        court.latitude != null && court.longitude != null
                    );
                    console.log(`Foram encontradas ${validCourts.length} quadras com coordenadas válidas.`);
                    setCourts(validCourts);
                } catch (error) {
                    console.error("Erro ao buscar quadras para o mapa:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCourts();
        }, [])
    );

    // Função que lida com as mensagens vindas da WebView (cliques nos marcadores)
    const handleWebViewMessage = (event: any) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'MARKER_PRESS' && data.fieldId) {
            console.log(`Marcador pressionado: Quadra ID ${data.fieldId}`);
            
            // CORREÇÃO: Navegar para o NOME DA ABA (ex: 'Locacao') que contém a LocacaoStack.
            // O React Navigation encarregar-se-á de encontrar a tela 'CourtDetail' dentro dela.
            navigation.navigate('PartidasStack', { 
                screen: 'CourtDetail', 
                params: { fieldId: data.fieldId } 
            });
        }
    };

    const generateMapHtml = (courtData: api.FieldResponse[]) => {
        const markersData = JSON.stringify(courtData.map(court => ({
            id: court.id,
            lat: parseFloat(court.latitude as any),
            lng: parseFloat(court.longitude as any),
            name: court.name,
            address: court.address,
        })));

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                <style>
                    body { padding: 0; margin: 0; }
                    html, body, #map { height: 100%; width: 100%; }
                    .leaflet-popup-content-wrapper { background-color: #fff; color: #333; border-radius: 8px; box-shadow: 0 3px 14px rgba(0,0,0,0.4); }
                    .leaflet-popup-tip { background: #fff; }
                </style>
            </head>
            <body>
                <div id="map"></div>
                <script>
                    const map = L.map('map').setView([${initialRegion.lat}, ${initialRegion.lng}], ${initialRegion.zoom});
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
                    const markers = ${markersData};
                    markers.forEach(marker => {
                        const leafletMarker = L.marker([marker.lat, marker.lng]).addTo(map);
                        leafletMarker.bindPopup("<b>" + marker.name + "</b><br>" + marker.address);
                        leafletMarker.on('click', () => {
                            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MARKER_PRESS', fieldId: marker.id }));
                        });
                    });
                </script>
            </body>
            </html>
        `;
    };

    // Componente de renderização de conteúdo principal
    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.overlayText}>A carregar quadras...</Text>
                </View>
            );
        }

        // Se não está a carregar, sempre mostra o mapa,
        // e mostra uma mensagem por cima se não houver quadras.
        return (
            <>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: generateMapHtml(courts) }}
                    style={styles.webview}
                    onMessage={handleWebViewMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                />
                {courts.length === 0 && (
                     <View style={styles.overlayMessage}>
                         <Text style={styles.noCourtsText}>Nenhuma quadra encontrada.</Text>
                    </View>
                )}
            </>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            
            {renderContent()}

            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <Text style={styles.headerTitle}>QUADRAS PRÓXIMAS</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
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
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayText: {
        marginTop: 10,
        fontSize: 16,
        color: theme.colors.text
    },
    // Estilo para a mensagem que aparece por cima do mapa
    overlayMessage: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    noCourtsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.white,
    }
});
