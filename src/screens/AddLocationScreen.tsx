import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { createField } from '../services/api';
import Icon from 'react-native-vector-icons/Feather';

export function AddLocationScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // Estados para cada campo do formulário
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Brasília'); // Exemplo
  const [state, setState] = useState('DF'); // Exemplo
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // Para imagens e horários, usamos um formato simples de texto por enquanto
  const [images, setImages] = useState(''); // URLs separadas por vírgula
  const [hours, setHours] = useState('Segunda-Sexta: 9h-22h\nSábado: 8h-20h');
  const handlePhoneChange = (text: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = text.replace(/\D/g, '');
    
    // Limita o tamanho para 11 dígitos (DDD + 9 dígitos)
    const truncated = cleaned.slice(0, 11);

    let formatted = truncated;
    if (truncated.length > 2) {
      // Formato (XX) X...
      formatted = `(${truncated.slice(0, 2)}) ${truncated.slice(2)}`;
    }
    if (truncated.length > 7) {
      // Checa se é celular (9 dígitos) ou fixo (8 dígitos)
      const isMobile = truncated.length > 10;
      const splitPoint = isMobile ? 7 : 6;
      // Formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
      formatted = `(${truncated.slice(0, 2)}) ${truncated.slice(2, splitPoint)}-${truncated.slice(splitPoint)}`;
    }
    
    setPhone(formatted);
  };
  const handleSave = async () => {
    if (!name || !address || !city || !state) {
      Alert.alert('Erro', 'Nome, endereço, cidade e estado são obrigatórios.');
      return;
    }
    setLoading(true);

    try {
      const imagesArray = images.split(',').map(url => url.trim()).filter(url => url);
      const hoursArray = hours.split('\n').map(line => {
          const parts = line.split(':');
          return { day: parts[0]?.trim() || '', time: parts[1]?.trim() || '' };
      }).filter(h => h.day && h.time);

      await createField({
        name,
        title,
        address,
        city,
        state,
        description,
        price,
        phone,
        email,
        images: imagesArray,
        hours: hoursArray,
      });

      Alert.alert('Sucesso!', 'Sua locação foi criada.');
      navigation.goBack();

    } catch (error) {
      console.error('Erro ao criar locação:', error);
      Alert.alert('Erro', 'Não foi possível criar a locação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-left" size={30} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Locação</Text>
        <View style={{ width: 30 }} />
      </View>

      <Text style={styles.label}>Nome da Locação *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Real Society" placeholderTextColor={'#8F8F8F'} />

      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ex: Campo Society Sintético" placeholderTextColor={'#8F8F8F'} />
      
      <Text style={styles.label}>Endereço Completo *</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Ex: S/n Trecho 3 21, Setor Hípico Sul" placeholderTextColor={'#8F8F8F'}  />

      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.inputMulti} value={description} onChangeText={setDescription} multiline placeholder="Descreva o espaço, comodidades, etc." placeholderTextColor={'#8F8F8F'} />

      <Text style={styles.label}>Preço</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="Ex: R$ 150 / Hora" />

      <Text style={styles.label}>Telefone para Contato</Text>
      <TextInput 
        style={styles.input} 
        value={phone} 
        onChangeText={handlePhoneChange} // Usa a nova função
        keyboardType="phone-pad" 
        placeholder="(61) 99999-9999"
        placeholderTextColor={'#8F8F8F'} 
        maxLength={15} // Limita o tamanho do texto para (XX) XXXXX-XXXX
      />
      
      <Text style={styles.label}>Email para Contato</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="contato@email.com" placeholderTextColor={'#8F8F8F'} />

      <Text style={styles.label}>Horários (um por linha)</Text>
      <TextInput style={styles.inputMulti} value={hours} onChangeText={setHours} multiline placeholder="Ex: Segunda-Sexta: 9h-22h" placeholderTextColor={'#8F8F8F'} />

      <Text style={styles.label}>URLs das Imagens (separadas por vírgula)</Text>
      <TextInput style={styles.inputMulti} value={images} onChangeText={setImages} multiline autoCapitalize="none" placeholder="https://url1.com/img.jpg, https://url2.com/img.jpg" placeholderTextColor={'#8F8F8F'} />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color={theme.colors.white} /> : <Text style={styles.saveButtonText}>Salvar Locação</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.large,
  },
  backButton: { padding: 5 },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  input: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: 12,
    borderRadius: theme.radius.medium,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.placeholder,
  },
  inputMulti: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: 12,
    borderRadius: theme.radius.medium,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.placeholder,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    alignItems: 'center',
    marginTop: theme.spacing.large,
    marginBottom: 40,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});