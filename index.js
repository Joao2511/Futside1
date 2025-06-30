/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  // Esta função é chamada quando uma notificação é recebida e o app está
  // em segundo plano ou fechado. Não é necessário exibir nada aqui,
  // pois o sistema operativo já faz isso.
});
AppRegistry.registerComponent(appName, () => App);
