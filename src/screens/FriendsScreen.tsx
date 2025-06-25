// src/screens/FriendsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';

// Importaremos as telas das abas que vamos criar a seguir
import { MyFriendsTab } from './MyFriendsTab';
import { FriendRequestsTab } from './FriendRequestsTab';

const TopTab = createMaterialTopTabNavigator();

export function FriendsScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <View style={{ height: insets.top, backgroundColor: theme.colors.background }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AMIGOS</Text>
            </View>

            <TopTab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.placeholder,
                    tabBarIndicatorStyle: {
                        backgroundColor: theme.colors.primary,
                        height: 3,
                    },
                    tabBarLabelStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <TopTab.Screen name="Meus Amigos" component={MyFriendsTab} />
                <TopTab.Screen name="Solicitações" component={FriendRequestsTab} />
            </TopTab.Navigator>
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
});
