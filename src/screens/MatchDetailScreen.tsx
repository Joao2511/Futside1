// src/screens/MatchDetailScreen.tsx
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
import { useNavigation, useRoute } from '@react-navigation/native';

const mockMatchDetails = {
    location: 'QUADRA 209 NORTE',
    scoreA: 1,
    scoreB: 2,
    scorersA: [ { player: 'Jogador 1', minute: 11 } ],
    scorersB: [ { player: 'Jogador 5', minute: 15 }, { player: 'Jogador 6', minute: 35 } ],
    stats: [
        { label: 'Chutes', valueA: 4, valueB: 8 },
        { label: 'Chutes ao gol', valueA: 3, valueB: 2 },
        { label: 'Faltas', valueA: 5, valueB: 3 },
        { label: 'Cartões', valueA: 3, valueB: 2, icon: 'square', iconColor: '#FFC107' },
        { label: 'Cartões', valueA: 0, valueB: 0, icon: 'square', iconColor: '#D32F2F' },
        { label: 'Escanteios', valueA: 8, valueB: 7 },
    ]
};

const StatRow = ({ stat }: { stat: typeof mockMatchDetails.stats[0] }) => (
    <View style={styles.statRow}>
        <Text style={styles.statValue}>{stat.valueA}</Text>
        <View style={styles.statLabelContainer}>
            {stat.icon && <View style={[styles.cardIcon, { backgroundColor: stat.iconColor }]} />}
            <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
        <Text style={styles.statValue}>{stat.valueB}</Text>
    </View>
);

export function MatchDetailScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{mockMatchDetails.location}</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.matchHeader}>
                    <View style={styles.teamContainer}>
                        <Image source={{ uri: `https://avatar.iran.liara.run/public/boy?username=TeamA` }} style={styles.teamLogo} />
                        <Text style={styles.teamName}>Time A</Text>
                    </View>
                    <Text style={styles.scoreText}>{mockMatchDetails.scoreA} - {mockMatchDetails.scoreB}</Text>
                    <View style={styles.teamContainer}>
                        <Image source={{ uri: `https://avatar.iran.liara.run/public/boy?username=TeamB` }} style={styles.teamLogo} />
                        <Text style={styles.teamName}>Time B</Text>
                    </View>
                </View>

                <View style={styles.liveStatusContainer}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>Ao vivo</Text>
                </View>
                
                <View style={styles.scorersContainer}>
                    <View style={styles.scorerList}>
                        {mockMatchDetails.scorersA.map((s, i) => <Text key={i} style={styles.scorerText}>{s.player} '{s.minute}</Text>)}
                    </View>
                    <Icon name="award" size={24} color={theme.colors.placeholder} />
                    <View style={[styles.scorerList, { alignItems: 'flex-end' }]}>
                        {mockMatchDetails.scorersB.map((s, i) => <Text key={i} style={styles.scorerText}>{s.player} '{s.minute}</Text>)}
                    </View>
                </View>

                <View style={styles.statsTable}>
                    {mockMatchDetails.stats.map((stat, index) => (
                        <StatRow key={index} stat={stat} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.medium, paddingHorizontal: theme.spacing.medium, borderBottomWidth: 1, borderBottomColor: theme.colors.surface },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
    scrollContainer: { padding: theme.spacing.large },
    matchHeader: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    teamContainer: { alignItems: 'center' },
    teamLogo: { width: 80, height: 80, borderRadius: 40, marginBottom: theme.spacing.small },
    teamName: { fontSize: 16, fontWeight: 'bold' },
    scoreText: { fontSize: 48, fontWeight: 'bold' },
    liveStatusContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: theme.spacing.small },
    liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'red', marginRight: 5 },
    liveText: { color: 'red', fontWeight: 'bold' },
    scorersContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: theme.spacing.medium },
    scorerList: { flex: 1 },
    scorerText: { color: theme.colors.placeholder, fontSize: 12 },
    statsTable: { marginTop: theme.spacing.large, borderTopWidth: 1, borderTopColor: theme.colors.surface, paddingTop: theme.spacing.medium },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.medium },
    statValue: { fontSize: 16, fontWeight: 'bold', width: 40, textAlign: 'center' },
    statLabelContainer: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' },
    statLabel: { fontSize: 16, color: theme.colors.placeholder },
    cardIcon: { width: 12, height: 16, marginRight: theme.spacing.small, borderRadius: 2 },
});
