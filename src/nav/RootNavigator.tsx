import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer, type RouteProp } from '@react-navigation/native';
import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import {
  House as IconHome,
  BookOpen as IconLibrary,
  ScrollText as IconReader,
  CalendarDays as IconCalendar,
  Activity as IconProgress,
  Settings as IconSettings,
} from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useReaderStore } from '@/store/reader';
import { HomeScreen } from '@/screens/HomeScreen';
import { LibraryScreen } from '@/screens/LibraryScreen';
import { ReaderScreen } from '@/screens/ReaderScreen';
import { CalendarScreen } from '@/screens/CalendarScreen';
import { ProgressScreen } from '@/screens/ProgressScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

export type RootTabParamList = {
  Home: undefined;
  Library: undefined;
  Reader: undefined;
  Calendar: undefined;
  Progress: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  const theme = useTheme();
  const activeBookId = useReaderStore((s) => s.activeBookId);

  const screenOptions = ({
    route,
  }: {
    route: RouteProp<RootTabParamList, keyof RootTabParamList>;
  }): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarActiveTintColor: theme.colors.accent,
    tabBarInactiveTintColor: theme.colors.textSecondary,
    tabBarStyle: {
      backgroundColor: theme.colors.bgPrimary,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      height: 60,
      paddingBottom: 8,
      ...(Platform.OS === 'web' ? { boxShadow: 'none' as any } : null),
    },
    tabBarLabelStyle: {
      fontSize: 10,
      marginTop: 2,
    },
    tabBarIcon: ({ color, size, focused }) => {
      const px = size ?? 22;
      // Active tab gets a slightly heavier stroke alongside the accent tint.
      const sw = focused ? 2.1 : 1.5;
      switch (route.name) {
        case 'Home':
          return <IconHome color={color} size={px} strokeWidth={sw} />;
        case 'Library':
          return <IconLibrary color={color} size={px} strokeWidth={sw} />;
        case 'Reader':
          return <IconReader color={color} size={px} strokeWidth={sw} />;
        case 'Calendar':
          return <IconCalendar color={color} size={px} strokeWidth={sw} />;
        case 'Progress':
          return <IconProgress color={color} size={px} strokeWidth={sw} />;
        case 'Settings':
          return <IconSettings color={color} size={px} strokeWidth={sw} />;
      }
    },
  });

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: theme.colors.accent,
          background: theme.colors.bgPrimary,
          card: theme.colors.bgPrimary,
          text: theme.colors.textPrimary,
          border: theme.colors.border,
          notification: theme.colors.accent,
        },
        fonts: {
          regular: { fontFamily: theme.fonts.body, fontWeight: '400' },
          medium: { fontFamily: theme.fonts.ui, fontWeight: '500' },
          bold: { fontFamily: theme.fonts.uiBold, fontWeight: '700' },
          heavy: { fontFamily: theme.fonts.uiBold, fontWeight: '700' },
        },
      }}
    >
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Library" component={LibraryScreen} />
        {/* Always registered so Calendar/Progress/Settings keep stable indices.
            The button is hidden until a book is open. */}
        <Tab.Screen
          name="Reader"
          component={ReaderScreen}
          options={activeBookId ? {} : { tabBarButton: () => null }}
        />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
