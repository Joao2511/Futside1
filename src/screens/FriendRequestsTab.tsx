// src/screens/FriendRequestsTab.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';

const mockRequests = [
    { id: '1', name: 'Pedro Henrique', avatar: 'https://i.imgur.com/SampleAvatar3.png' },
];

const RequestItem = ({ item }: { item: typeof mockRequests[0] }) => (
    <View style={styles.itemContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.acceptButton]}>
                <Icon name="check" size={20} color={theme.colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.declineButton]}>
                <Icon name="x" size={20} color={theme.colors.white} />
            </TouchableOpacity>
        </View>
    </View>
);

export function FriendRequestsTab() {
    return (
        <FlatList
            data={mockRequests}
            renderItem={({ item }) => <RequestItem item={item} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.container}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma solicitação de amizade.</Text>}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.medium,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.medium,
        borderRadius: theme.radius.medium,
        marginBottom: theme.spacing.medium,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: theme.spacing.medium,
    },
    name: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: theme.spacing.small,
        borderRadius: 20,
        marginLeft: theme.spacing.small,
    },
    acceptButton: {
        backgroundColor: theme.colors.primary,
    },
    declineButton: {
        backgroundColor: theme.colors.danger,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: theme.colors.placeholder,
    }
});
