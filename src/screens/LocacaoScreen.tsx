import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getMyFields, getFieldsFeed, FieldResponse } from '../services/api';

// MyLocationCard não muda
const MyLocationCard = ({ item, onPress }: { item: FieldResponse; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={styles.myLocationCard}>
        <Image 
            source={{ uri: item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=687&auto=format&fit=crop' }} 
            style={styles.myLocationImage} 
        />
        <View style={styles.myLocationOverlay} />
        <Text style={styles.myLocationName}>{item.name}</Text>
    </TouchableOpacity>
);

// LocationCard agora é flexível (código do Passo 1)
const LocationCard = ({ item, onPress }: { item: any; onPress: () => void }) => {
    const imageUrl = 
        (item.images && item.images[0]) || 
        item.image || 
        'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=687&auto=format&fit=crop';

    return (
        <TouchableOpacity onPress={onPress}>
          <View style={styles.cardContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.backgroundImage}
              resizeMode="cover"
            />
            <View style={styles.darkOverlay} />
            <Image
              source={require('../assets/card.png')}
              style={styles.cardWatermark}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <View style={styles.tag}>
                <Icon name="dribbble" size={14} color={theme.colors.text} />
                <Text style={styles.tagText}>{item.title || 'Campo Society'}</Text>
              </View>
              <View>
                <Text style={styles.courtName}>{item.name}</Text>
                <Text style={styles.courtAddress}>{item.address}</Text>
              </View>
              <View style={styles.cardButton}>
                <Text style={styles.cardButtonText}>VER MAIS</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
    );
};

// Seus dados mockados continuam aqui
const mockCourts = [
  {
    id: 'mock-1', // Adicionei um prefixo para evitar conflito de chaves
    name: 'Real Society',
    address: 'S/n Trecho 3 21, Setor Hípico Sul, DF, 70610-000',
    image:
      'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=687&auto=format&fit=crop',
  },
  {
    id: 'mock-2',
    name: 'Amarelinho Society',
    address: 'Colônia Agrícola Águas Claras, Chácara 36 nº 17',
    image:
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=686&auto=format&fit=crop',
  },
  {
    id: 'mock-3',
    name: 'Society do Toni',
    address: 'St. de Indústrias Q 5 - Sobradinho, Brasília - DF, 70297-400',
    image:
      'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=749&auto=format&fit=crop',
  },
];

export function LocacaoScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [myLocations, setMyLocations] = useState<FieldResponse[]>([]);
  const [allLocations, setAllLocations] = useState<any[]>([]); // Agora pode conter os dois tipos
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Busca os dados da API em paralelo
          const [myFieldsData, allFieldsData] = await Promise.all([
            getMyFields(),
            getFieldsFeed(),
          ]);

          // Combina os resultados da API com os dados mockados
          const combinedLocations = [...allFieldsData, ...mockCourts];

          setMyLocations(myFieldsData);
          setAllLocations(combinedLocations);

        } catch (error) {
          console.error('Falha ao buscar locações da API:', error);
          // Se a API falhar, mostramos pelo menos os dados mockados
          setAllLocations(mockCourts);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LOCAÇÃO</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.colors.primary} /></View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* --- SESSÃO: MINHAS LOCAÇÕES --- */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Minhas Locações</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddLocation')}>
                    <Icon name="plus" size={16} color={theme.colors.white} />
                    <Text style={styles.addButtonText}>Adicionar</Text>
                </TouchableOpacity>
            </View>

            {myLocations.length > 0 ? (
                <FlatList
                    data={myLocations}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <MyLocationCard 
                            item={item} 
                            onPress={() => navigation.navigate('LocationDetail', { courtId: item.id })}
                        />
                    )}
                    contentContainerStyle={{ paddingVertical: theme.spacing.medium }}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Você ainda não cadastrou nenhuma locação.</Text>
                </View>
            )}
            
            {/* --- SESSÃO: LOCAÇÕES DISPONÍVEIS --- */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Locações Disponíveis</Text>
            </View>
            
            {/* Renderiza a lista combinada */}
            {allLocations.map((court) => (
                <LocationCard
                    key={court.id} // A chave agora é única por causa do prefixo 'mock-'
                    item={court}
                    onPress={() => {
                        // A tela de detalhe pode não funcionar para os mocks
                        // se ela depender de dados que só existem na API
                        if (String(court.id).includes('mock-')) {
                            alert('Detalhes para quadras mockadas não implementado.');
                        } else {
                            navigation.navigate('LocationDetail', { courtId: court.id })
                        }
                    }}
                />
            ))}
        </ScrollView>
      )}
    </View>
  );
}

// Seus estilos (adicionei um loadingContainer)
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // ...resto dos estilos
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        paddingVertical: theme.spacing.medium,
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    // ...todos os seus outros estilos permanecem aqui
    headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  scrollContainer: {
    paddingHorizontal: theme.spacing.large,
    paddingBottom: 80,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.large,
    marginBottom: theme.spacing.small,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.large,
    alignItems: 'center',
  },
  addButtonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 14,
  },
  emptyContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.medium,
  },
  emptyText: {
    color: theme.colors.placeholder,
    fontSize: 14,
  },
  myLocationCard: {
    width: 200,
    height: 120,
    borderRadius: theme.radius.medium,
    marginRight: theme.spacing.medium,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  myLocationImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  myLocationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  myLocationName: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    padding: theme.spacing.medium,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  cardContainer: {
    height: 180,
    borderRadius: theme.radius.medium,
    marginBottom: theme.spacing.large,
    backgroundColor: theme.colors.primary,
    overflow: 'hidden',
  },
  backgroundImage: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
  cardWatermark: { ...StyleSheet.absoluteFillObject, zIndex: 2 },
  cardContent: {
    ...StyleSheet.absoluteFillObject,
    padding: theme.spacing.medium,
    justifyContent: 'space-between',
    zIndex: 3,
  },
  tag: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)',
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
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  courtAddress: {
    color: theme.colors.white,
    opacity: 0.9,
    fontSize: 14,
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  cardButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
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