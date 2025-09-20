import { DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as NativeSplash from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/AppBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Custom themes to align with splash background for a seamless transition
  const lightTheme = {
    ...NavDefaultTheme,
    colors: {
      ...NavDefaultTheme.colors,
      background: '#e0f2fe', // matches splash
      card: '#e0f2fe',
    },
  };
  const darkTheme = {
    ...NavDarkTheme,
    colors: {
      ...NavDarkTheme.colors,
      background: '#0f172a',
      card: '#0f172a',
    },
  };
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    NativeSplash.preventAutoHideAsync().catch(() => {});
  }, []);

  // Hide native splash once fonts are ready
  useEffect(() => {
    if (fontsLoaded) {
      // Slight delay to reduce flash / layout shift
      const t = setTimeout(() => {
        NativeSplash.hideAsync().catch(() => {});
      }, 80);
      return () => clearTimeout(t);
    }
  }, [fontsLoaded]);

  // While fonts not loaded, keep native splash (return null to avoid premature mount)
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? darkTheme : lightTheme}>
        <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#0f172a' : '#e0f2fe' }}>
        {/* Animated background matching splash */}
        {colorScheme !== 'dark' ? (
          <AppBackground particles variant="brand" waveHeight={150} />
        ) : (
          <AppBackground particles={false} variant="dark" waveHeight={110} />
        )}
        <Stack screenOptions={{ animation: 'fade', contentStyle: { backgroundColor: 'transparent' } }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={Platform.OS === 'android' ? (colorScheme === 'dark' ? 'light' : 'dark') : 'auto'} backgroundColor={colorScheme === 'dark' ? '#0f172a' : '#e0f2fe'} />
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
