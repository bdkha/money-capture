import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';
import CameraScreen from '../screens/CameraScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SummaryScreen from '../screens/SummaryScreen';
import PreviewScreen from '../screens/PreviewScreen';

export type RootStackParamList = {
  Tabs: undefined;
  Preview: { tempUri: string };
};

export type TabParamList = {
  Camera: undefined;
  History: undefined;
  Summary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Summary"
        component={SummaryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
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
    </Stack.Navigator>
  );
}
