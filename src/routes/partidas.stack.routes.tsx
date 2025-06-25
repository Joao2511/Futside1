import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PartidasScreen } from '../screens/PartidasScreen';
import { MatchDetailScreen } from '../screens/MatchDetailScreen';
import { LobbyScreen } from '../screens/LobbyScreen';
import { CourtDetailScreen } from '../screens/CourtDetailScreen'; // Mantenha a importação

const { Navigator, Screen } = createNativeStackNavigator();

export function PartidasStackRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="PartidasList" component={PartidasScreen} />
      <Screen name="MatchDetail" component={MatchDetailScreen} />
      {/* CourtDetailScreen agora está aqui dentro da pilha de Partidas */}
      <Screen name="CourtDetail" component={CourtDetailScreen} />
      <Screen name="Lobby" component={LobbyScreen} />
    </Navigator>
  );
}