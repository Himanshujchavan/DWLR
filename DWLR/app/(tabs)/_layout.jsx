import { Tabs } from 'expo-router';
import { ChartBar as BarChart3, Bell, Droplets, Map, User } from 'lucide-react-native';
import { Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a237e' }} edges={['top']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#64b5f6',
          tabBarInactiveTintColor: '#90a4ae',
          tabBarStyle: {
            backgroundColor: '#1e3a8a',
            borderTopWidth: 0,
            height: 65 + insets.bottom,
            paddingBottom: Math.max(10, insets.bottom),
            paddingTop: 8,
            paddingHorizontal: 4,
            marginBottom: 0,
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.08,
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