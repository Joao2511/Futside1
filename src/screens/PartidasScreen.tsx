import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

// Importar logos locais para ambos os times
const teamALogo = require('../assets/teamA.png');
const teamBLogo = require('../assets/teamB.png');

const MatchCard = ({ teamA, teamB, score, location }: { teamA: any; teamB: any; score: string; location: string }) => {
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={require('../assets/card.png')}
      style={styles.matchCardBackground}
      imageStyle={{ borderRadius: theme.radius.medium }}
    >
      <View style={styles.cardContent}>
        <View style={styles.matchInfo}>
          {/* Time A: logo local */}
          <View style={styles.team}>
            <Image source={teamALogo} style={styles.teamLogo} />
            <Text style={styles.teamName}>{teamA.name}</Text>
          </View>

          {/* Placar e localização */}
          <View style={styles.scoreContainer}>
            <Text style={styles.matchLocation}>{location}</Text>
            <Text style={styles.scoreText}>{score}</Text>
            <View style={styles.liveStatus}>
              <View style={styles.liveDot} />
              <Text style={styles.matchStatus}>AO VIVO</Text>
            </View>
          </View>

          {/* Time B: logo local */}
          <View style={styles.team}>
            <Image source={teamBLogo} style={styles.teamLogo} />
            <Text style={styles.teamName}>{teamB.name}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate('MatchDetail')}
        >
          <Text style={styles.cardButtonText}>SOBRE A PARTIDA</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export function PartidasScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const mockMatches = [
    {
      location: 'Quadra 405 Norte',
      score: '1 : 2',
      teamA: { name: 'TIME A' },
      teamB: { name: 'TIME B' },
    },
    {
      location: 'Quadra 108/109 Norte',
      score: '3 : 1',
      teamA: { name: 'TIME C' },
      teamB: { name: 'TIME D' },
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PARTIDAS</Text>
        </View>

        {/* Logo da aplicação */}
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo2.png')} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Seção Criar Partida */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CRIAR PARTIDA</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Mapa')}>
            <ImageBackground
              source={require('../assets/card.png')}
              style={styles.createMatchCard}
              imageStyle={{ borderRadius: theme.radius.medium }}
            >
              <View style={styles.cardContent}>
                <View style={styles.solidCardSubtitleContainer}>
                  <Icon name="arrow-right-circle" size={16} color={theme.colors.white} />
                  <Text style={styles.solidCardSubtitle}>CRIAÇÃO DE PARTIDAS</Text>
                </View>
                <Text style={styles.createMatchTitle}>CRIE SUA PARTIDA</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        {/* Seção Partidas ao Vivo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PARTIDAS AO VIVO</Text>
          {mockMatches.map((match, index) => (
            <MatchCard key={index} {...match} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 90 },
  header: { flexDirection: 'row', justifyContent: 'center', paddingVertical: theme.spacing.medium },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text },
  logoContainer: { alignItems: 'center', marginBottom: theme.spacing.large },
  logo: { height: 80 },
  section: { paddingHorizontal: theme.spacing.large, marginBottom: theme.spacing.large },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.medium },
  createMatchCard: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.medium, height: 140, justifyContent: 'center', elevation: 3, overflow: 'hidden' },
  solidCardSubtitleContainer: { flexDirection: 'row', alignItems: 'center' },
  solidCardSubtitle: { color: theme.colors.white, marginLeft: theme.spacing.small, opacity: 0.8, fontSize: 12 },
  createMatchTitle: { color: theme.colors.white, fontSize: 24, fontWeight: 'bold', marginTop: theme.spacing.small },
  matchCardBackground: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.medium, elevation: 3, marginBottom: theme.spacing.medium, justifyContent: 'space-between', overflow: 'hidden' },
  cardContent: { padding: theme.spacing.medium },
  matchInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  team: { alignItems: 'center', flex: 1 },
  teamLogo: { width: 50, height: 50, borderRadius: 25, marginBottom: theme.spacing.small },
  teamName: { color: theme.colors.white, fontWeight: 'bold', fontSize: 12 },
  scoreContainer: { alignItems: 'center', marginHorizontal: theme.spacing.small },
  matchLocation: { color: theme.colors.white, fontSize: 12, opacity: 0.8, marginBottom: 4 },
  scoreText: { fontSize: 28, fontWeight: 'bold', color: theme.colors.white },
  liveStatus: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6347', marginRight: 5 },
  matchStatus: { color: theme.colors.white, fontSize: 10, fontWeight: 'bold', opacity: 0.8 },
  cardButton: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: theme.radius.medium, paddingVertical: 12, alignItems: 'center', marginTop: theme.spacing.medium },
  cardButtonText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 14 },
});
