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
  
  // Dynamic colors based on theme
  const iconColor = colorScheme === 'light' ? Colors.light.primary : '#64b5f6';
  const headerBg = colorScheme === 'light' ? Colors.light.background : '#1a237e';
  const textColor = colorScheme === 'light' ? Colors.light.text : '#ffffff';
  
  return (
    <View style={[
      styles.headerContainer,
      { 
        backgroundColor: headerBg,
        borderBottomColor: colorScheme === 'light' ? Colors.light.cardBorder : 'rgba(255,255,255,0.1)'
      }
    ]}>
      <View style={styles.headerRow}>
        {/* Logo / Title */}
        <ThemedText style={[styles.headerTitle, { color: textColor }]}>
          WaterRadar
        </ThemedText>

        {/* Right section with controls */}
        <View style={styles.headerRight}>
          {/* Theme Toggle Icon */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={colorScheme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            style={styles.headerIcon}
            onPress={toggleTheme}
            hitSlop={10}
          >
            <FontAwesome5 
              name={colorScheme === 'dark' ? "sun" : "moon"} 
              size={20} 
              color={iconColor} 
            />
          </Pressable>

          {/* Alerts Icon */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Alerts"
            style={styles.headerIcon}
            onPress={() => router.push('/(tabs)/alerts')}
            hitSlop={10}
          >
            <FontAwesome5 name="bell" size={20} color={iconColor} />
          </Pressable>

          {/* Profile Icon */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Profile"
            style={styles.profileIcon}
            hitSlop={10}
            onPress={() => router.push('/(tabs)/Profile')}
          >
            <FontAwesome5 name="user-circle" size={28} color={iconColor} />
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
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  headerIcon: {
    marginRight: 16,
    padding: 4,
  },
  profileIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
});