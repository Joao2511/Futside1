/**
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
// 1. Importe o componente Toast
import Toast from 'react-native-toast-message';
import { DeviceEventEmitter } from 'react-native'; // Importe o DeviceEventEmitter

import { AuthProvider } from './src/contexts/AuthContext';
import { Routes } from './src/routes';

async function setupNotifications() {
  try {
    // 1. Criar um canal para Android (obrigatório)
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH, // Para fazer a notificação aparecer na tela
    });

    // 2. Pedir permissão para o usuário
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    } else {
      await messaging().requestPermission();
    }
  } catch (error) {
    console.error("Erro ao configurar notificações:", error);
  }
}

function App(): React.JSX.Element {
  useEffect(() => {
    setupNotifications();

    // Listener para quando uma notificação é recebida COM O APP ABERTO (foreground)
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('FCM Message Received in Foreground:', remoteMessage);
      if (remoteMessage.data?.type === 'new_match') {
        console.log('Emitindo evento: newMatchCreated');
        DeviceEventEmitter.emit('newMatchCreated');
      }

      // 2. Exibe a notificação visual para o usuário
      try {
        await notifee.displayNotification({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          android: {
            channelId: 'default',
            pressAction: { id: 'default' },
          },
        });
      } catch (error) {
        console.error("Erro ao exibir notificação com Notifee:", error);
      }
      // CORREÇÃO: Usar o Notifee para exibir a notificação manualmente
      try {
        await notifee.displayNotification({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          android: {
            channelId: 'default', // O mesmo ID do canal que criamos
            pressAction: {
              id: 'default',
            },
          },
        });
      } catch (error) {
        console.error("Erro ao exibir notificação com Notifee:", error);
      }
    });

    // Este listener é chamado quando o usuário toca na notificação
    // e o app estava em segundo plano ou fechado.
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      if (remoteMessage.data?.matchId) {
        Alert.alert('Abrir partida', `Usuário tocou na notificação da partida ID: ${remoteMessage.data.matchId}`);
        // Aqui você navegaria para a tela da partida:
        // navigation.navigate('MatchDetails', { matchId: remoteMessage.data.matchId });
      }
    });

    // Verifica se o app foi aberto por uma notificação quando estava fechado (quit state)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
           if (remoteMessage.data?.matchId) {
            Alert.alert('Abrir partida (App fechado)', `Usuário tocou na notificação da partida ID: ${remoteMessage.data.matchId}`);
          }
        }
      });

    return unsubscribeOnMessage;
  }, []);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <Routes />
          {/* 2. Adicione o componente Toast aqui. Ele ficará "invisível" até ser chamado. */}
          <Toast />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;

