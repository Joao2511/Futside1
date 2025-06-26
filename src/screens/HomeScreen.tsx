import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

// Import dos logos dos times (adicione suas imagens em src/assets/teamA.png e teamB.png)
const teamALogo = require('../assets/teamA.png');
const teamBLogo = require('../assets/teamB.png');

export function HomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [scoreA, setScoreA] = useState(1);
  const [scoreB, setScoreB] = useState(2);
  const [matchMinute, setMatchMinute] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatchMinute(prev => (prev >= 90 ? 90 : prev + 1));
      if (Math.random() < 0.03) {
        Math.random() > 0.5 ? setScoreA(prev => prev + 1) : setScoreB(prev => prev + 1);
      }
    }, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

      <ScrollView>
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Image source={require('../assets/logo2.png')} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Seção Partidas */}
          <View style={styles.section}>
            <Text style={styles.welcomeText}>
              Bem-vindo, <Text style={styles.welcomeName}>{user?.name || 'Jogador'}.</Text>
            </Text>
            <Text style={styles.sectionTitle}>PARTIDAS</Text>

            <ImageBackground
              source={require('../assets/card.png')}
              style={styles.matchCardBackground}
              imageStyle={{ borderRadius: theme.radius.medium }}
            >
              <View style={styles.cardContent}>
                <View style={styles.matchInfo}>
                  {/* Time A */}
                  <View style={styles.team}>
                    <Image source={teamALogo} style={styles.teamLogo} resizeMode="contain" />
                    <Text style={styles.teamName}>TIME A</Text>
                  </View>

                  {/* Placar e status */}
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{scoreA} : {scoreB}</Text>
                    <Text style={styles.matchStatus}>{matchMinute}' AO VIVO</Text>
                  </View>

                  {/* Time B */}
                  <View style={styles.team}>
                    <Image source={teamBLogo} style={styles.teamLogo} resizeMode="contain" />
                    <Text style={styles.teamName}>TIME B</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => navigation.navigate('PartidasStack', { screen: 'PartidasList' })}
                >
                  <Text style={styles.cardButtonText}>VER PARTIDAS</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>

          {/* Seção Quadras */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>QUADRAS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Mapa')}>
              <ImageBackground
                source={require('../assets/card.png')}
                style={styles.imageCard}
                imageStyle={{ borderRadius: theme.radius.medium }}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.imageCardTitle}>QUADRAS DISPONÍVEIS</Text>
                  <View style={styles.imageCardSubtitleContainer}>
                    <Icon name="arrow-right-circle" size={18} color={theme.colors.white} />
                    <Text style={styles.imageCardSubtitle}>VER QUADRAS POR PERTO</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          {/* Seção Locação */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LOCAÇÃO</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Locação')}>
              <ImageBackground
                source={require('../assets/card.png')}
                style={styles.imageCard}
                imageStyle={{ borderRadius: theme.radius.medium }}
              >
                <View style={styles.cardContent}>
                  <View style={styles.tag}>
                    <Icon name="dribbble" size={14} color={theme.colors.text} />
                    <Text style={styles.tagText}>Football</Text>
                  </View>
                  <Text style={styles.locationTitle}>Real Society</Text>
                  <Text style={styles.locationAddress}>S/n Trecho 3 21, Setor Hípico Sul, DF</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  mainContent: { paddingBottom: 90 },
  header: { alignItems: 'center', paddingHorizontal: theme.spacing.large, paddingTop: theme.spacing.large },
  logo: { height: 120 },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text, marginBottom: 16, paddingHorizontal: theme.spacing.large },
  welcomeName: { color: theme.colors.primary },
  section: { paddingHorizontal: theme.spacing.large, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.medium },
  matchCardBackground: { borderRadius: theme.radius.medium, backgroundColor: theme.colors.primary, elevation: 3, overflow: 'hidden' },
  cardContent: { padding: theme.spacing.medium },
  matchInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  team: { alignItems: 'center', flex: 1 },
  teamLogo: { width: 50, height: 50, marginBottom: theme.spacing.small },
  teamName: { color: theme.colors.white, fontWeight: 'bold' },
  scoreContainer: { alignItems: 'center' },
  scoreText: { fontSize: 28, fontWeight: 'bold', color: theme.colors.white },
  matchStatus: { color: theme.colors.white, fontSize: 12, opacity: 0.8 },
  cardButton: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: theme.radius.medium, paddingVertical: 12, alignItems: 'center', marginTop: theme.spacing.medium },
  cardButtonText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 14 },
  imageCard: { height: 150, borderRadius: theme.radius.medium, justifyContent: 'center', backgroundColor: theme.colors.primary },
  imageCardTitle: { color: theme.colors.white, fontSize: 20, fontWeight: 'bold' },
  imageCardSubtitleContainer: { flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.small },
  imageCardSubtitle: { color: theme.colors.white, marginLeft: theme.spacing.small, opacity: 0.9 },
  tag: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 15, paddingVertical: 5, paddingHorizontal: 10, alignSelf: 'flex-start', alignItems: 'center', marginBottom: theme.spacing.medium },
  tagText: { color: theme.colors.text, marginLeft: theme.spacing.small, fontWeight: 'bold' },
  locationTitle: { color: theme.colors.white, fontSize: 22, fontWeight: 'bold' },
  locationAddress: { color: theme.colors.white, opacity: 0.9 }
});
