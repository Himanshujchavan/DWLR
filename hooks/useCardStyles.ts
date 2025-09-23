import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Universal card styling function for consistent theming
export const useCardStyles = () => {
  const colorScheme = useColorScheme();
  
  return {
    // Card container with shadow
    cardShadow: {
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: colorScheme === 'light' ? 2 : 4,
      },
      shadowOpacity: colorScheme === 'light' ? 0.1 : 0.3,
      shadowRadius: 8,
      elevation: colorScheme === 'light' ? 3 : 8,
    },
    
    // Main card styling
    card: {
      backgroundColor: colorScheme === 'light' ? Colors.light.cardBackground : '#16213e',
      borderRadius: 20,
      padding: 24,
      borderWidth: 1,
      borderColor: colorScheme === 'light' ? Colors.light.cardBorder : 'rgba(255,255,255,0.1)',
    },
    
    // Icon container styling
    iconContainer: (customBg?: string) => ({
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      backgroundColor: customBg || (colorScheme === 'light' ? Colors.light.primary + '15' : 'rgba(100, 181, 246, 0.15)'),
    }),
    
    // Text colors
    colors: {
      primary: colorScheme === 'light' ? Colors.light.primary : '#64b5f6',
      text: colorScheme === 'light' ? Colors.light.text : '#ffffff',
      textSecondary: colorScheme === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)',
      background: colorScheme === 'light' ? Colors.light.background : '#0f172a',
      backgroundSoft: colorScheme === 'light' ? Colors.light.backgroundSoft : '#1a1a2e',
      cardBg: colorScheme === 'light' ? Colors.light.cardBackground : '#16213e',
      border: colorScheme === 'light' ? Colors.light.cardBorder : 'rgba(255,255,255,0.1)',
      statusLow: colorScheme === 'light' ? Colors.light.statusLow : '#ff4444',
      statusMedium: colorScheme === 'light' ? Colors.light.statusMedium : '#ff8800',
      statusHigh: colorScheme === 'light' ? Colors.light.statusHigh : '#44aa44',
    }
  };
};

// Helper function for creating consistent parameter icons
export const getParameterIconColors = (colorScheme: 'light' | 'dark', type: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary') => {
  const colors = {
    primary: colorScheme === 'light' ? Colors.light.primary : '#64b5f6',
    secondary: colorScheme === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)', 
    success: colorScheme === 'light' ? Colors.light.statusHigh : '#44aa44',
    warning: colorScheme === 'light' ? Colors.light.statusMedium : '#ff8800',
    danger: colorScheme === 'light' ? Colors.light.statusLow : '#ff4444',
  };
  
  return {
    color: colors[type],
    bg: colors[type] + '15',
  };
};