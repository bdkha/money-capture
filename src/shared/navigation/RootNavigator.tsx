import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GlassBottomNav from './GlassBottomNav';

// Screen imports — implemented by parallel agents
import CameraScreen from '../../modules/camera/screens/CameraScreen';
import FeedScreen from '../../modules/expenses/screens/FeedScreen';
import StatsScreen from '../../modules/summary/screens/StatsScreen';
import BudgetScreen from '../../modules/budget/screens/BudgetScreen';
import ProfileScreen from '../../modules/profile/screens/ProfileScreen';
import PreviewScreen from '../../modules/expenses/screens/PreviewScreen';
import SettingsScreen from '../../modules/profile/screens/SettingsScreen';

// ─── Param Lists ──────────────────────────────────────────────────────────────

export type TabParamList = {
  Feed: undefined;
  Stats: undefined;
  Camera: undefined;
  Budget: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  Preview: { tempUri: string };
  Settings: undefined;
};

// ─── Navigators ──────────────────────────────────────────────────────────────

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassBottomNav {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          headerShown: false,
          // Hide the glass nav while the camera is open
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="Preview"
        component={PreviewScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
