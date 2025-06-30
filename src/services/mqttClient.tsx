import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView, Button, StyleSheet, TextInput } from 'react-native';
import mqtt from 'mqtt';

// --- CONFIGURAÇÃO CORRETA PARA O DEPLOY ---
const BACKEND_URL = 'https://futside-back.onrender.com'; // Se estiver no emulador/simulador, use o IP da sua máquina ou '10.0.2.2' para Android, 'loc  alhost' para iOS.

// 1. URL do Broker para WebSockets Seguros (WSS). Note o protocolo "wss://" e a porta 8884
export const MQTT_BROKER_URL = 'wss://13ae203d2c244fa4904ec48e2468fdde.s1.eu.hivemq.cloud:8884/mqtt';

// 2. Opções de conexão com usuário e senha
export const MQTT_OPTIONS = {
  username: 'futside', // O mesmo usuário que você colocou no .env
  password: 'Futside1', // A mesma senha que você colocou no .env
};

const MqttClient = () => {
    const [mqttClient, setMqttClient] = useState<mqtt.MqttClient | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [regionToSubscribe, setRegionToSubscribe] = useState('asa-sul');

    useEffect(() => {
        // 3. Conecta usando a URL e as OPÇÕES
        console.log(`Tentando conectar ao broker MQTT em ${MQTT_BROKER_URL}`);
        const client = mqtt.connect(MQTT_BROKER_URL, MQTT_OPTIONS);

        client.on('connect', () => {
            console.log('✅ Conectado ao Broker MQTT na nuvem (React Native)');
            setIsConnected(true);
        });


    client.on('message', (topic, message) => {
      console.log(`Mensagem recebida no tópico ${topic}: ${message.toString()}`);
      try {
        const parsedMessage = JSON.parse(message.toString());
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
        Alert.alert(
          'Novo Jogo na sua Região!',
          `Um novo jogo foi criado em ${parsedMessage.region}: ${parsedMessage.title}. Quer participar?`,
          [{ text: 'OK' }]
        );
      } catch (e) {
        console.error('Erro ao parsear mensagem MQTT:', e);
      }
    });

    client.on('error', (error) => {
      console.error('Erro na conexão MQTT (React Native):', error);
      setIsConnected(false);
    });

    client.on('close', () => {
      console.log('Conexão MQTT fechada.');
      setIsConnected(false);
    });

    client.on('offline', () => {
      console.log('Cliente MQTT offline.');
      setIsConnected(false);
    });

    setMqttClient(client);

    // Limpar a conexão MQTT ao desmontar o componente
    return () => {
      if (client.connected) {
        client.end();
        console.log('Cliente MQTT desconectado ao desmontar.');
      }
    };
  }, []);

  const handleSubscribe = () => {
    if (mqttClient && isConnected && regionToSubscribe) {
      const topic = `football/games/${regionToSubscribe.toLowerCase().replace(/\s/g, '-')}`;
      mqttClient.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error(`Erro ao assinar tópico ${topic}:`, err);
          Alert.alert('Erro', `Não foi possível assinar o tópico: ${err.message}`);
        } else {
          console.log(`Assinado com sucesso o tópico: ${topic}`);
          Alert.alert('Sucesso', `Assinado o tópico: ${topic}`);
        }
      });
    } else {
      Alert.alert('Erro', 'Cliente MQTT não conectado ou região vazia.');
    }
  };

  const handleCreateGame = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/games/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Jogo Teste React Native',
          region: regionToSubscribe, // Usa a região que o usuário está inscrito para testar
          date: '2025-07-05',
          time: '18:00',
          players_needed: 10,
          roles_needed: ['goleiro', 'atacante'],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', 'Jogo criado e notificação enviada via backend!');
        console.log('Resposta do backend:', data);
      } else {
        Alert.alert('Erro', `Falha ao criar jogo: ${data.detail || JSON.stringify(data)}`);
        console.error('Erro do backend:', data);
      }
    } catch (error) {
      console.error('Erro ao chamar o backend:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao backend. Verifique se ele está rodando.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>App de Futebol - Teste MQTT</Text>
      <Text style={styles.status}>Status MQTT: {isConnected ? 'Conectado' : 'Desconectado'}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Região para assinar (ex: Asa Sul)"
          value={regionToSubscribe}
          onChangeText={setRegionToSubscribe}
          autoCapitalize="none"
          placeholderTextColor={'#8F8F8F'} 
        />
        <Button title="Assinar Região" onPress={handleSubscribe} disabled={!isConnected} />
      </View>

      <Button title="Criar Jogo (via Backend)" onPress={handleCreateGame} />

      <Text style={styles.messagesHeader}>Notificações de Jogos:</Text>
      <ScrollView style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <Text>Nenhuma notificação ainda.</Text>
        ) : (
          messages.map((msg, index) => (
            <View key={index} style={styles.messageItem}>
              <Text style={styles.messageTitle}>{msg.title}</Text>
              <Text>Região: {msg.region}</Text>
              <Text>Data: {msg.date} às {msg.time}</Text>
              <Text>Jogadores Necessários: {msg.players_needed}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  messagesHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  messagesContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  messageItem: {
    backgroundColor: '#e0f7fa',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#00bcd4',
  },
  messageTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default MqttClient;