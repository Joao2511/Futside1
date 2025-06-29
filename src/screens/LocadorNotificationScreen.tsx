// src/screens/LocadorNotificationsScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Switch
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

// Componente reutilizável para cada item da lista de notificações
const NotificationItem = ({ label, value, onValueChange }: { label: string, value: boolean, onValueChange: (value: boolean) => void }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Switch
            trackColor={{ false: "#767577", true: theme.colors.primary }}
            thumbColor={theme.colors.white}
            onValueChange={onValueChange}
            value={value}
        />
    </View>
);

export function LocadorNotificationsScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    // Estados para cada tipo de notificação
    const [friendRequests, setFriendRequests] = useState(true);
    const [matchSchedules, setMatchSchedules] = useState(true);
    const [keeperRequests, setKeeperRequests] = useState(true);
    const [newsEmails, setNewsEmails] = useState(false);

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <View style={{ height: insets.top, backgroundColor: theme.colors.yellow || '#FDB813' }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>NOTIFICAÇÕES</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>Notificações Push</Text>
                <View style={styles.sectionContainer}>
                    {/* Opções baseadas nos seus requisitos */}
                    <NotificationItem label="Pedidos de amizade" value={friendRequests} onValueChange={setFriendRequests} />
                    <View style={styles.separator} />
                    <NotificationItem label="Partidas agendadas" value={matchSchedules} onValueChange={setMatchSchedules} />
                    <View style={styles.separator} />
                    <NotificationItem label="Solicitações de goleiro" value={keeperRequests} onValueChange={setKeeperRequests} />
                </View>

                <Text style={styles.sectionTitle}>E-mail</Text>
                <View style={styles.sectionContainer}>
                    <NotificationItem label="Notícias e atualizações do FutSide" value={newsEmails} onValueChange={setNewsEmails} />
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.large,
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surface,
    },
    backButton: {
        position: 'absolute',
        left: theme.spacing.large,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    scrollContainer: {
        padding: theme.spacing.large,
    },
    sectionTitle: {
        fontSize: 16,
        color: theme.colors.placeholder,
        fontWeight: 'bold',
        marginBottom: theme.spacing.small,
        textTransform: 'uppercase',
    },
    sectionContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.medium,
        marginBottom: theme.spacing.large,
        overflow: 'hidden', // Garante que o borderRadius seja aplicado aos filhos
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.medium,
    },
    itemLabel: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text,
        marginRight: theme.spacing.medium,
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginLeft: theme.spacing.medium,
    },
});
