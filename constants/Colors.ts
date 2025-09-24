/**
 * DWLR Color System - Optimized for water monitoring interface
 * Light mode focuses on clean, professional water-themed design
 * Dark mode maintains the existing sophisticated look
 */

const tintColorLight = '#3B82F6'; // Primary blue for water theme
const tintColorDark = '#fff';

export const Colors = {
  light: {
    // Core colors
    text: '#1F2937',           // Dark gray for main text
    textSecondary: '#6B7280',  // Lighter gray for secondary text
    background: '#FFFFFF',     // Pure white
    backgroundSoft: '#F9FAFB', // Off-white for subtle backgrounds
    
    // Theme colors
    tint: tintColorLight,
    icon: '#6B7280',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorLight,
    
    // Water monitoring specific colors
    primary: '#3B82F6',        // Primary water blue
    primaryDark: '#2563EB',    // Darker blue variant
    secondary: '#14B8A6',      // Aqua/Teal for recharge/health
    
    // Alert/Status colors
    statusLow: '#EF4444',      // Red for low water levels
    statusMedium: '#FACC15',   // Yellow for medium levels  
    statusHigh: '#22C55E',     // Green for high levels
    
    // UI element colors
    cardBackground: '#FFFFFF',
    cardBorder: '#E5E7EB',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
    buttonPrimary: '#3B82F6',
    buttonSecondary: '#FFFFFF',
    buttonSecondaryBorder: '#3B82F6',
    
    // Accent colors for charts and gradients
    chartGradientStart: '#3B82F6',
    chartGradientEnd: '#93C5FD',
    rechargeOverlay: 'rgba(34, 197, 94, 0.1)',
  },
  dark: {
    // Core colors
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#151718',
    backgroundSoft: '#1F2937',
    
    // Theme colors
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    
    // Water monitoring specific colors
    primary: '#64b5f6',
    primaryDark: '#42a5f5',
    secondary: '#22d3ee',
    
    // Alert/Status colors
    statusLow: '#ff4444',
    statusMedium: '#ff8800', 
    statusHigh: '#44aa44',
    
    // UI element colors
    cardBackground: '#1F2937',
    cardBorder: '#374151',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    buttonPrimary: '#64b5f6',
    buttonSecondary: '#374151',
    buttonSecondaryBorder: '#64b5f6',
    
    // Accent colors for charts and gradients
    chartGradientStart: '#64b5f6',
    chartGradientEnd: '#42a5f5',
    rechargeOverlay: 'rgba(68, 170, 68, 0.2)',
  },
};
