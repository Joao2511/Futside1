// src/screens/LocacaoScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

const mockCourts = [
  {
    id: '1',
    name: 'Real Society',
    address: 'S/n Trecho 3 21, Setor Hípico Sul, DF, 70610-000',
    image:
      'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=687&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Amarelinho Society',
    address: 'Colônia Agrícola Águas Claras, Chácara 36 nº 17',
    image:
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=686&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Society do Toni',
    address: 'St. de Indústrias Q 5 - Sobradinho, Brasília - DF, 70297-400',
    image:
      'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=749&auto=format&fit=crop',
  },
];

export function LocacaoScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation(); // sem tipagem extra

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View
        style={{
          height: insets.top,
          backgroundColor: theme.colors.yellow || '#FDB813',
        }}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LOCAÇÃO</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {mockCourts.map((court) => (
          <TouchableOpacity
            key={court.id}
            onPress={() =>
              navigation.navigate('LocationDetail' as never, { courtId: court.id } as never)
            }
          >
            <View style={styles.cardContainer}>
              <Image
                source={{ uri: court.image }}
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
                  <Text style={styles.tagText}>Campo Society</Text>
                </View>
                <View>
                  <Text style={styles.courtName}>{court.name}</Text>
                  <Text style={styles.courtAddress}>{court.address}</Text>
                </View>
                <View style={styles.cardButton}>
                  <Text style={styles.cardButtonText}>VER MAIS</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// (mesmos estilos de antes)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    paddingVertical: theme.spacing.medium,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  scrollContainer: {
    padding: theme.spacing.large,
    paddingBottom: 80,
  },
  cardContainer: {
    height: 180,
    borderRadius: theme.radius.medium,
    marginBottom: theme.spacing.large,
    elevation: 5,
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
