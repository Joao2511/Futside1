import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LocacaoScreen } from '../screens/LocacaoScreen';
import { LocationDetailScreen } from '../screens/LocationDetailScreen';
import { AddLocationScreen } from '../screens/AddLocationScreen';

const { Navigator, Screen } = createNativeStackNavigator();

export function LocacaoStackRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="LocacaoMain" component={LocacaoScreen} />
      <Screen name="LocationDetail" component={LocationDetailScreen} />
      <Screen name="AddLocation" component={AddLocationScreen} />
    </Navigator>
  );
}
