import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';

interface AddPlayerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onAddPlayer: (name: string, role: string, teamId: 'A' | 'B') => void;
    teamId: 'A' | 'B'; // Para saber em qual time adicionar o jogador
    totalPlayersPerTeam: number; // Para limitar o número de jogadores por time
    currentPlayersCount: number; // Para exibir o contador de jogadores
}

const { width } = Dimensions.get('window');

export function AddPlayerModal({ isVisible, onClose, onAddPlayer, teamId, totalPlayersPerTeam, currentPlayersCount }: AddPlayerModalProps) {
    const [playerName, setPlayerName] = useState('');
    const [playerRole, setPlayerRole] = useState('');

    const handleAddPlayer = () => {
        if (playerName.trim() && playerRole.trim()) {
            onAddPlayer(playerName.trim(), playerRole.trim(), teamId);
            setPlayerName(''); // Limpa o input
            setPlayerRole(''); // Limpa o input
            onClose();
        } else {
            // Poderia adicionar uma validação visual aqui
            alert('Por favor, preencha nome e função do jogador.'); // Usando alert provisoriamente, ideal seria um modal customizado
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Adicionar Jogador ({teamId})</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nome do Jogador"
                        placeholderTextColor={theme.colors.placeholder}
                        value={playerName}
                        onChangeText={setPlayerName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Função (Ex: Atacante, Goleiro)"
                        placeholderTextColor={theme.colors.placeholder}
                        value={playerRole}
                        onChangeText={setPlayerRole}
                    />

                    <View style={styles.playerCountContainer}>
                        <Text style={styles.playerCountText}>
                            Jogadores: {currentPlayersCount}/{totalPlayersPerTeam}
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonCancel]}
                            onPress={onClose}
                        >
                            <Text style={styles.textStyle}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonAdd]}
                            onPress={handleAddPlayer}
                        >
                            <Text style={styles.textStyle}>Adicionar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)', // Fundo escuro transparente
    },
    modalView: {
        width: width * 0.85, // 85% da largura da tela
        backgroundColor: theme.colors.background, // Fundo branco do modal
        borderRadius: theme.radius.medium,
        padding: theme.spacing.large,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: theme.spacing.large,
        color: theme.colors.text,
    },
    input: {
        width: '100%',
        backgroundColor: theme.colors.surface, // Cor de fundo do input
        borderRadius: theme.radius.small,
        padding: theme.spacing.medium,
        marginBottom: theme.spacing.medium,
        fontSize: 16,
        color: theme.colors.text,
    },
    playerCountContainer: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: theme.spacing.medium,
    },
    playerCountText: {
        fontSize: 14,
        color: theme.colors.placeholder,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: theme.spacing.medium,
    },
    button: {
        borderRadius: theme.radius.medium,
        padding: theme.spacing.small + 2,
        elevation: 2,
        flex: 1, // Faz os botões ocuparem o mesmo espaço
        marginHorizontal: theme.spacing.small,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonCancel: {
        backgroundColor: theme.colors.gray, // Cor cinza para cancelar
    },
    buttonAdd: {
        backgroundColor: theme.colors.yellow, // Cor amarela para adicionar
    },
    textStyle: {
        color: theme.colors.primary, // Cor do texto dos botões
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
});
