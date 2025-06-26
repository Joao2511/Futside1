import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PerfilScreen } from '../screens/PerfilScreen';
import { SettingsScreen } from '../screens/SettingsScreen'; // Se você tiver uma tela de configurações
import { FriendsScreen } from '../screens/FriendsScreen'; // Se você tiver uma tela de amigos
import { MatchHistoryModal } from '../components/MatchHistoryModal'; // Importe o novo modal
import { MatchSummaryScreen } from '../screens/MatchSummaryScreen';

const { Navigator, Screen } = createNativeStackNavigator();

export function ProfileStackRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="ProfileMain" component={PerfilScreen} />
      <Screen name="Settings" component={SettingsScreen} />
      <Screen name="Friends" component={FriendsScreen} />
      {/* Adicionando o MatchHistory como uma tela na pilha sem props isVisible/onClose */}
      <Screen
        name="MatchHistory"
        component={MatchHistoryModal}
        options={{ presentation: 'modal' }} // Continua abrindo como modal
      />
    </Navigator>
  );
}