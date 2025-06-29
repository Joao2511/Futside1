import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LocadorPerfilScreen } from '../screens/LocadorPerfilScreen';
import { LocadorSettingScreen } from '../screens/LocadorSettingScreen';
import { LocadorNotificationsScreen } from '../screens/LocadorNotificationScreen';
import { LocadorChangePasswordScreen } from '../screens/LocadorChangePasswordScreen';
import { LocadorHelpAndSupportScreen } from '../screens/LocadorHelpAndSupportScreen';
import { LocadorTermsAndPrivacyScreen } from '../screens/LocadorTermsAndPrivacyScreen';
import { LocadorReportProblemScreen } from '../screens/LocadorReportProblemScreen';

const { Navigator, Screen } = createNativeStackNavigator();

export function LocadorPerfilStackRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="LocadorPerfilMain" component={LocadorPerfilScreen} />
      <Screen name="LocadorSetting" component={LocadorSettingScreen} />
      <Screen name="LocadorNotifications" component={LocadorNotificationsScreen} />
      <Screen name="LocadorChangePassword" component={LocadorChangePasswordScreen} />
      <Screen name="LocadorHelpAndSupport" component={LocadorHelpAndSupportScreen} />
      <Screen name="LocadorTermsAndPrivacy" component={LocadorTermsAndPrivacyScreen} />
      <Screen name="LocadorReportProblem" component={LocadorReportProblemScreen} />
    </Navigator>
  );
}
