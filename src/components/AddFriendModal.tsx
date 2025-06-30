// src/components/AddFriendModal.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
// 1. Importe a biblioteca de Toast
import Toast from 'react-native-toast-message';
import { theme } from '../theme';

interface AddFriendModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddFriendModal({ visible, onClose }: AddFriendModalProps) {
  const [friendId, setFriendId] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Função para lidar com o envio do pedido de amizade
  const handleSendRequest = () => {
    if (!friendId) {
        // Mostra um erro se o campo estiver vazio
        Toast.show({
            type: 'error',
            text1: 'Campo Vazio',
            text2: 'Por favor, insira o ID de um amigo.',
        });
        return;
    }

    setLoading(true);

    // Simula um pedido de API
    setTimeout(() => {
      setLoading(false);
      
      // 3. Fecha o modal
      onClose();

      // 4. Mostra a notificação de sucesso
      Toast.show({
        type: 'success',
        text1: 'Pedido Enviado',
        text2: `O seu pedido de amizade para "${friendId}" foi enviado!`,
      });

      // Limpa o campo de texto para a próxima vez
      setFriendId('');
    }, 1000); // Atraso de 1 segundo para simular o carregamento
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Adicionar Amigo</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="x" size={24} color={theme.colors.placeholder} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.description}>
            Insira o nome de utilizador ou ID do seu amigo para enviar um pedido de amizade.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nome de utilizador ou ID"
              placeholderTextColor={'#8F8F8F'} 
              value={friendId}
              onChangeText={setFriendId}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color={theme.colors.white} />
                ) : (
                    <Icon name="send" size={22} color={theme.colors.white} />
                )}
            </TouchableOpacity>
          </View>
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
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  closeButton: {
    padding: 5,
  },
  description: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.large,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.medium,
    padding: theme.spacing.medium,
    fontSize: 16,
    color: theme.colors.text,
  },
  sendButton: {
    marginLeft: theme.spacing.medium,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 55, // Garante que o botão tenha um tamanho mínimo
  },
});
