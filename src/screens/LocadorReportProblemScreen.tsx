// src/screens/LocadorReportProblemScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

export function LocadorReportProblemScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmitReport = () => {
        if (!subject.trim() || !description.trim()) {
            Alert.alert("Campos Vazios", "Por favor, preencha o assunto e a descrição do problema.");
            return;
        }
        // Lógica para enviar o relatório (aqui simulamos com um log e um alerta)
        console.log({ subject, description });
        Alert.alert(
            "Relatório Enviado", 
            "Obrigado por nos ajudar a melhorar o Futside! A sua mensagem foi enviada para a nossa equipa.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
        );
    };

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
                <Text style={styles.headerTitle}>REPORTAR UM PROBLEMA</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.label}>Assunto</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Erro ao entrar no lobby"
                    value={subject}
                    onChangeText={setSubject}
                    placeholderTextColor={'#8F8F8F'} 
                />

                <Text style={styles.label}>Descrição do Problema</Text>
                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Descreva o problema com o máximo de detalhes possível..."
                    value={description}
                    onChangeText={setDescription}
                    placeholderTextColor={'#8F8F8F'} 
                    multiline
                    numberOfLines={6}
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReport}>
                    <Text style={styles.submitButtonText}>ENVIAR RELATÓRIO</Text>
                </TouchableOpacity>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.medium,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surface,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    scrollContainer: {
        padding: theme.spacing.large,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.small,
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.medium,
        paddingHorizontal: theme.spacing.medium,
        paddingVertical: theme.spacing.medium,
        fontSize: 16,
        marginBottom: theme.spacing.large,
    },
    multilineInput: {
        height: 150,
        textAlignVertical: 'top', // Garante que o texto comece no topo
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.medium,
        borderRadius: theme.radius.medium,
        alignItems: 'center',
        marginTop: theme.spacing.medium,
    },
    submitButtonText: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
