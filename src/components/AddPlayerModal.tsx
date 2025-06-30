// src/components/AddPlayerModal.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme';

interface AddPlayerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddPlayer: (name: string, role: string, teamId: 'A' | 'B') => void;
  teamId: 'A' | 'B';
}

export function AddPlayerModal({ isVisible, onClose, onAddPlayer, teamId }: AddPlayerModalProps) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');

    const handleAdd = () => {
        if (!name.trim() || !role.trim()) {
            Alert.alert("Campos Vazios", "Por favor, preencha o nome e a função do jogador.");
            return;
        }
        onAddPlayer(name, role, teamId);
        setName('');
        setRole('');
        onClose();
    };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Adicionar Jogador</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="x" size={24} color={theme.colors.placeholder} />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Nome do Jogador"
            placeholderTextColor={'#8F8F8F'} 
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Função (ex: Goleiro, Atacante)"
            placeholderTextColor={'#8F8F8F'} 
            value={role}
            onChangeText={setRole}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>ADICIONAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.medium,
        padding: theme.spacing.large,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.large,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    closeButton: {
        padding: 5,
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.medium,
        padding: theme.spacing.medium,
        fontSize: 16,
        color: theme.colors.text,
        marginBottom: theme.spacing.medium,
    },
    addButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.medium,
        borderRadius: theme.radius.medium,
        alignItems: 'center',
        marginTop: theme.spacing.small,
    },
    addButtonText: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
