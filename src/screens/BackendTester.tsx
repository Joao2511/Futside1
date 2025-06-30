import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { 
  View, Text, Alert, ScrollView, Button, StyleSheet, 
  TextInput, Platform, KeyboardAvoidingView, SafeAreaView, ActivityIndicator
} from 'react-native';
import mqtt from 'mqtt';
import messaging from '@react-native-firebase/messaging';
import * as futsideApi from '../services/api';

const MQTT_BROKER_URL = 'ws://10.0.2.2:8080';

const BackendTester = () => {
  // Estados
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<any[] | null>(null);
  const [viewing, setViewing] = useState('');
  
  // Inputs
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [fieldCity, setFieldCity] = useState('Brasilia');
  
  // ATUALIZADO: Adicionado campo para o ID do criador da partida
  const [matchCreatorId, setMatchCreatorId] = useState('2');
  const [matchFieldId, setMatchFieldId] = useState('1');
  const [matchTitle, setMatchTitle] = useState('Jogo de Quinta');

  const [joinMatchId, setJoinMatchId] = useState('1');
  const [joinUserId, setJoinUserId] = useState('1');
  
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [registerTokenUserId, setRegisterTokenUserId] = useState('1');
  const [subscribeRegionUserId, setSubscribeRegionUserId] = useState('1');
  const [subscribeRegionCity, setSubscribeRegionCity] = useState('Brasilia');

  useEffect(() => {
    messaging().getToken().then(token => {
      console.log("FCM TOKEN:", token);
      setFcmToken(token);
    });

    const client = mqtt.connect(MQTT_BROKER_URL, { reconnectPeriod: 1000 });
    client.on('connect', () => { console.log('MQTT: CONECTADO'); setIsConnected(true); });
    client.on('error', (error) => console.error('MQTT: Erro de Conexão: ', error));
    client.on('close', () => { console.log('MQTT: CONEXÃO FECHADA'); setIsConnected(false); });
    return () => { if (client) { console.log('MQTT: Desconectando...'); client.end(); } };
  }, []);

  const executeApiCall = async (apiFunction: Function, successMessage: string, errorMessage: string) => {
    setLoading(true);
    setFetchedData(null);
    try {
      const result = await apiFunction();
      Alert.alert('Sucesso', successMessage);
      return result;
    } catch (error) {
      Alert.alert('Falha', error.response?.data?.detail || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleList = async (listFunction: Function, type: string) => {
    const data = await executeApiCall(listFunction, `${type} listados!`, `Não foi possível listar ${type}.`);
    if (data) {
        setFetchedData(data);
        setViewing(type);
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <Text style={styles.header}>Futside - Painel de Testes Completo</Text>
        <Text style={styles.status}>Status MQTT: {isConnected ? 'Conectado' : 'Desconectado'}</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>

          {/* Seção de Visualização de Dados */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Visualizador de Dados</Text>
            <View style={styles.buttonRow}>
              <Button title="Listar Usuários" onPress={() => handleList(futsideApi.getUsers, 'Usuários')} />
              <Button title="Listar Quadras" onPress={() => handleList(futsideApi.getFields, 'Quadras')} />
              <Button title="Listar Partidas" onPress={() => handleList(futsideApi.getMatches, 'Partidas')} />
            </View>
            <ScrollView style={styles.dataViewer}>
              {loading && <ActivityIndicator size="large" color="#007bff" />}
              {!loading && !fetchedData && <Text style={styles.placeholderText}>Clique em um botão "Listar" acima.</Text>}
              {!loading && fetchedData && (
                <>
                  <Text style={styles.viewingText}>Visualizando: {viewing}</Text>
                  <Text style={styles.jsonText}>{JSON.stringify(fetchedData, null, 2)}</Text>
                </>
              )}
            </ScrollView>
          </View>

          {/* Seção de Criação de Usuários */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Criar Usuários</Text>
            <TextInput style={styles.input} placeholder="Nome (Ex: 'João')" onChangeText={setUserName} />
            <TextInput style={styles.input} placeholder="Email" onChangeText={setUserEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Senha" onChangeText={setUserPassword} secureTextEntry />
            <Button title="Criar Usuário (e Locador)" onPress={() => executeApiCall(() => futsideApi.createUser({name: userName, email: userEmail, password: userPassword}), 'Usuário/Locador criado!', 'Erro ao criar usuário.')} />
          </View>

          {/* Seção de Notificações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Testar Notificações</Text>
            <Text style={styles.tokenText} selectable>Token FCM: {fcmToken || 'Carregando...'}</Text>
            <TextInput style={styles.input} placeholder="ID do Usuário para Registrar Token" value={registerTokenUserId} onChangeText={setRegisterTokenUserId} keyboardType="numeric" />
            <Button title="Registrar Token p/ Usuário" onPress={() => executeApiCall(() => futsideApi.registerFcmToken(parseInt(registerTokenUserId), fcmToken!), 'Token FCM registrado!', 'Erro ao registrar token.')} disabled={!fcmToken} />
            <View style={styles.separator} />
            <TextInput style={styles.input} placeholder="ID do Usuário para Inscrever" value={subscribeRegionUserId} onChangeText={setSubscribeRegionUserId} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Cidade" value={subscribeRegionCity} onChangeText={setSubscribeRegionCity} />
            <Button title="Inscrever Usuário na Região" onPress={() => executeApiCall(() => futsideApi.subscribeToRegion(parseInt(subscribeRegionUserId), subscribeRegionCity), 'Inscrição realizada!', 'Erro ao inscrever.')} />
          </View>

          {/* Seção de Quadras */}
           <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Criar Quadras</Text>
            <TextInput style={styles.input} value={fieldCity} onChangeText={setFieldCity} placeholder="Cidade (para notificação)" />
            <Button title="Criar Quadra" onPress={() => executeApiCall(() => futsideApi.createField({name: 'Quadra em ' + fieldCity, address: 'Endereço Fixo', city: fieldCity, state: 'DF'}), 'Quadra criada!', 'Erro ao criar quadra.')} />
          </View>
          
          {/* Seção de Partidas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Partidas</Text>
            {/* NOVO CAMPO DE INPUT */}
            <TextInput style={styles.input} placeholder="ID do Criador da Partida" value={matchCreatorId} onChangeText={setMatchCreatorId} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="ID da Quadra (Field ID)" value={matchFieldId} onChangeText={setMatchFieldId} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Título da Partida" value={matchTitle} onChangeText={setMatchTitle} />
            {/* ATUALIZADO: Passando o creator_id na chamada da API */}
            <Button title="Criar Partida" onPress={() => executeApiCall(() => futsideApi.createMatch({ creator_id: parseInt(matchCreatorId), field_id: parseInt(matchFieldId), title: matchTitle, date: '2025-07-28', start_time: '20:00:00', end_time: '21:00:00', max_players: 12 }), 'Partida criada!', 'Erro ao criar partida.')} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f4f8' },
  container: { flex: 1 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', padding: 15, backgroundColor: '#fff' },
  status: { textAlign: 'center', padding: 5, backgroundColor: '#e2e8f0', fontWeight: 'bold' },
  section: { backgroundColor: '#fff', padding: 15, margin: 10, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10, backgroundColor: '#fafafa' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' },
  separator: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  dataViewer: { maxHeight: 250, backgroundColor: '#2d3748', borderRadius: 5, padding: 10, marginTop: 10 },
  placeholderText: { color: '#a0aec0', fontStyle: 'italic', textAlign: 'center' },
  viewingText: { color: '#63b3ed', fontWeight: 'bold', marginBottom: 5 },
  jsonText: { color: '#e2e8f0', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  tokenText: { fontSize: 12, color: 'gray', marginBottom: 10, padding: 5, backgroundColor: '#eee', borderRadius: 3, fontStyle:'italic', flexShrink: 1 }
});

export default BackendTester;
