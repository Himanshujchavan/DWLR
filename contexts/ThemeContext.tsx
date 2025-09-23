import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colorScheme: 'light' | 'dark';
  userPreference: ColorScheme;
  setUserPreference: (preference: ColorScheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme_preference';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useSystemColorScheme() ?? 'light';
  const [userPreference, setUserPreferenceState] = useState<ColorScheme>('system');
  
  // Determine the effective color scheme based on user preference
  const colorScheme: 'light' | 'dark' = userPreference === 'system' 
    ? systemColorScheme 
    : userPreference;

  // Load saved preference on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedPreference && ['light', 'dark', 'system'].includes(savedPreference)) {
        setUserPreferenceState(savedPreference as ColorScheme);
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const setUserPreference = async (preference: ColorScheme) => {
    try {
      setUserPreferenceState(preference);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newPreference = colorScheme === 'light' ? 'dark' : 'light';
    setUserPreference(newPreference);
  };

  return (
    <ThemeContext.Provider value={{ 
      colorScheme, 
      userPreference, 
      setUserPreference, 
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Custom hook that replaces the original useColorScheme
export function useColorScheme() {
  const { colorScheme } = useTheme();
  return colorScheme;
}