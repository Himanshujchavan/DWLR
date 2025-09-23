import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { ChartBar as BarChart3, Bell, Droplets, Map, User } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Custom Header Component
function CustomHeader() {
  const router = useRouter();
  const { colorScheme, toggleTheme } = useTheme();
  
  // Clean, minimal colors inspired by Expo Go header
  const iconColor = colorScheme === 'light' ? Colors.light.textSecondary : '#9BA1A6';
  const headerBg = colorScheme === 'light' ? Colors.light.background : '#151718';
  const textColor = colorScheme === 'light' ? Colors.light.text : '#ECEDEE';
  const activeIconColor = colorScheme === 'light' ? Colors.light.primary : '#64b5f6';
  
  return (
    <View style={[
      styles.headerContainer,
      { 
        backgroundColor: headerBg,
        borderBottomColor: colorScheme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'
      }
    ]}>
      <View style={styles.headerRow}>
        {/* Logo / Title with clean typography */}
        <View style={styles.titleContainer}>
          <ThemedText style={[styles.headerTitle, { color: textColor }]}>
            WaterRadar
          </ThemedText>
          <View style={[styles.titleUnderline, { backgroundColor: activeIconColor }]} />
        </View>

        {/* Right section with clean icon layout */}
        <View style={styles.headerRight}>
          {/* Theme Toggle with subtle background */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={colorScheme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            style={[styles.cleanIcon, { backgroundColor: colorScheme === 'light' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(100, 181, 246, 0.12)' }]}
            onPress={toggleTheme}
            hitSlop={8}
          >
            <FontAwesome5 
              name={colorScheme === 'dark' ? "sun" : "moon"} 
              size={16} 
              color={activeIconColor} 
            />
          </Pressable>

          {/* Alerts Icon with notification dot */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Alerts"
            style={styles.cleanIcon}
            onPress={() => router.push('/(tabs)/alerts')}
            hitSlop={8}
          >
            <View style={styles.iconWrapper}>
              <FontAwesome5 name="bell" size={16} color={iconColor} />
              {/* Optional notification dot */}
              <View style={[styles.notificationDot, { backgroundColor: Colors.light.statusLow }]} />
            </View>
          </Pressable>

          {/* Profile Icon - clean circular design */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Profile"
            style={[styles.profileIconClean, { borderColor: iconColor }]}
            hitSlop={8}
            onPress={() => router.push('/(tabs)/Profile')}
          >
            <FontAwesome5 name="user" size={14} color={iconColor} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useTheme();
  
  // Dynamic colors based on theme
  const safeAreaBg = colorScheme === 'light' ? Colors.light.background : '#1a237e';
  const tabBarBg = colorScheme === 'light' ? Colors.light.cardBackground : '#1e3a8a';
  const tabBarActiveTint = colorScheme === 'light' ? Colors.light.primary : '#64b5f6';
  const tabBarInactiveTint = colorScheme === 'light' ? Colors.light.textSecondary : '#90a4ae';
  const shadowColor = colorScheme === 'light' ? '#000' : '#000';
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: safeAreaBg }} edges={['top']}>
      <CustomHeader />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: tabBarActiveTint,
          tabBarInactiveTintColor: tabBarInactiveTint,
          tabBarStyle: {
            backgroundColor: tabBarBg,
            borderTopWidth: colorScheme === 'light' ? 1 : 0,
            borderTopColor: colorScheme === 'light' ? Colors.light.cardBorder : 'transparent',
            height: 65 + insets.bottom,
            paddingBottom: Math.max(10, insets.bottom),
            paddingTop: 8,
            paddingHorizontal: 4,
            marginBottom: 0,
            elevation: 20,
            shadowColor: shadowColor,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: colorScheme === 'light' ? 0.1 : 0.08,
            shadowRadius: 8,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            letterSpacing: 0.2,
            marginTop: 2,
          },
          tabBarIconStyle: {
            marginBottom: Platform.OS === 'android' ? 4 : 2,
          },
          tabBarItemStyle: {
            paddingVertical: Platform.OS === 'android' ? 6 : 4,
            borderRadius: Platform.OS === 'android' ? 8 : 0,
            marginHorizontal: Platform.OS === 'android' ? 2 : 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused }) => (
              <BarChart3 
                size={focused ? 20 : 18} 
                color={color} 
                strokeWidth={focused ? 2 : 1.8}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="monitor"
          options={{
            title: 'Monitor',
            tabBarIcon: ({ color, focused }) => (
              <Droplets 
                size={focused ? 20 : 18} 
                color={color} 
                strokeWidth={focused ? 2 : 1.8}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Maps',
            tabBarIcon: ({ color, focused }) => (
              <Map 
                size={focused ? 20 : 18} 
                color={color} 
                strokeWidth={focused ? 2 : 1.8}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="alerts"
          options={{
            title: 'Alerts',
            tabBarIcon: ({ color, focused }) => (
              <Bell 
                size={focused ? 20 : 18} 
                color={color} 
                strokeWidth={focused ? 2 : 1.8}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <User 
                size={focused ? 20 : 18} 
                color={color} 
                strokeWidth={focused ? 2 : 1.8}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 6,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    // Minimal shadow for depth without heaviness
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 6,
    minHeight: 44, // Ensure consistent height like Expo Go
  },
  titleContainer: {
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3, // Tighter letter spacing for modern look
    lineHeight: 24,
  },
  titleUnderline: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    height: 2,
    width: 32,
    borderRadius: 1,
    opacity: 0.8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12, // Clean spacing between icons
  },
  cleanIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // Subtle press feedback
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
      },
    }),
  },
  iconWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  profileIconClean: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});