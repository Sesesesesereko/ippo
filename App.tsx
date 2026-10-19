import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppStateProvider, useAppState } from './src/state/AppState';
import { NavProvider, useNav } from './src/navigation/Nav';
import { HomeScreen } from './src/screens/HomeScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { TaskEditScreen } from './src/screens/TaskEditScreen';
import { FocusScreen } from './src/screens/FocusScreen';
import { RoutinesScreen } from './src/screens/RoutinesScreen';
import { DataScreen } from './src/screens/DataScreen';
import { colors } from './src/ui/theme';

function Router() {
  const { ready } = useAppState();
  const { route } = useNav();
  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.link} />
      </View>
    );
  }
  switch (route.name) {
    case 'home':
      return <HomeScreen />;
    case 'tasks':
      return <TasksScreen />;
    case 'taskEdit':
      return <TaskEditScreen taskId={route.taskId} />;
    case 'focus':
      return <FocusScreen />;
    case 'routines':
      return <RoutinesScreen />;
    case 'data':
      return <DataScreen />;
  }
}

export default function App() {
  return (
    <AppStateProvider>
      <NavProvider>
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
          <Router />
          <StatusBar style="dark" />
        </View>
      </NavProvider>
    </AppStateProvider>
  );
}
