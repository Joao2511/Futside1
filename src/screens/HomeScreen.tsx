// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
// 1. Importar o hook da biblioteca
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useAuth } from '../hooks/useAuth';

export function HomeScreen() {
  const { user } = useAuth();
  // 2. Obter o valor do espaçamento do topo (a área da status bar)
  const insets = useSafeAreaInsets();

  return (
    // O container principal não precisa mais de padding manual
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      {/* 3. Esta View amarela serve como fundo para a StatusBar e usa a altura exata do inset */}
      <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

      <ScrollView>
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Image
              source={require('../assets/logo2.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Seção Partidas */}
          <Text style={styles.welcomeText}>
            Bem-vindo, <Text style={styles.welcomeName}>{(user as any)?.name || 'Jogador'}.</Text>
          </Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PARTIDAS</Text>
            <View style={styles.matchCard}>
              <View style={styles.matchInfo}>
                <View style={styles.team}>
                  <Image source={{ uri: 'https://placehold.co/50x50/003366/FFFFFF?text=CFC' }} style={styles.teamLogo} />
                  <Text style={styles.teamName}>TIME A</Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreText}>1 : 2</Text>
                  <Text style={styles.matchStatus}>AO VIVO</Text>
                </View>
                <View style={styles.team}>
                  <Image source={{ uri: 'https://placehold.co/50x50/0053A0/FFFFFF?text=LC' }} style={styles.teamLogo} />
                  <Text style={styles.teamName}>TIME B</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.cardButton}>
                <Text style={styles.cardButtonText}>VER PARTIDAS</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Seção Quadras */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>QUADRAS</Text>
            <TouchableOpacity style={styles.solidCard}>
              <View>
                <Text style={styles.solidCardTitle}>QUADRAS DISPONÍVEIS</Text>
                <View style={styles.solidCardSubtitleContainer}>
                  <Icon name="arrow-right-circle" size={18} color={theme.colors.primary} />
                  <Text style={styles.solidCardSubtitle}>VER QUADRAS POR PERTO</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Seção Locação */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LOCAÇÃO</Text>
            <TouchableOpacity style={styles.solidCard}>
              <View>
                <View style={styles.tag}>
                  <Icon name="dribbble" size={14} color={theme.colors.text} />
                  <Text style={styles.tagText}>Football</Text>
                </View>
                <Text style={styles.locationTitleSolid}>Real Society</Text>
                <Text style={styles.locationAddressSolid}>S/n Trecho 3 21, Setor Hípico Sul, DF</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mainContent: {
    paddingBottom: 90,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.large,
  },
  logo: {
    height: 80,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
    paddingHorizontal: theme.spacing.large,
  },
  welcomeName: {
    color: theme.colors.primary,
  },
  section: {
    paddingHorizontal: theme.spacing.large,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  matchCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.medium,
    padding: theme.spacing.medium,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  matchInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  team: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: theme.spacing.small,
  },
  teamName: {
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  matchStatus: {
    color: theme.colors.white,
    fontSize: 12,
    opacity: 0.8,
  },
  cardButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.radius.medium,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: theme.spacing.medium,
  },
  cardButtonText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  solidCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: theme.radius.medium,
    padding: theme.spacing.medium,
    height: 140,
    justifyContent: 'center',
  },
  solidCardTitle: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  solidCardSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.small,
  },
  solidCardSubtitle: {
    color: theme.colors.primary,
    marginLeft: theme.spacing.small,
  },
  tag: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
    borderWidth: 1,
    borderColor: '#DDD'
  },
  tagText: {
    color: theme.colors.text,
    marginLeft: theme.spacing.small,
    fontWeight: 'bold',
  },
  locationTitleSolid: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  locationAddressSolid: {
    color: theme.colors.placeholder,
  }
});
