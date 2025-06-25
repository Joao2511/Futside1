// src/screens/MyFriendsTab.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';

const mockFriends = [
    { id: '1', name: 'Carlos Dias', avatar: 'https://i.imgur.com/SampleAvatar1.png' },
    { id: '2', name: 'Juliana Silva', avatar: 'https://i.imgur.com/SampleAvatar2.png' },
];

const FriendItem = ({ item }: { item: typeof mockFriends[0] }) => (
    <View style={styles.itemContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity style={styles.chatButton}>
            <Icon name="message-circle" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
    </View>
);

export function MyFriendsTab() {
    return (
        <FlatList
            data={mockFriends}
            renderItem={({ item }) => <FriendItem item={item} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.container}
            ListEmptyComponent={<Text style={styles.emptyText}>Você ainda não tem amigos.</Text>}
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
    chatButton: {
        padding: theme.spacing.small,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: theme.colors.placeholder,
    }
});
