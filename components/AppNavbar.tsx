import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "./ThemedText";

type Props = {
  onSearch?: (query: string) => void;
  stats?: {
    filtered: number;
    lowCount: number;
    moderateCount: number;
    highCount: number;
  };
};

export default function AppNavbar({ onSearch, stats }: Props) {
  useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme, toggleTheme } = useTheme();
  
  // Dynamic colors based on theme
  const iconColor = colorScheme === 'light' ? Colors.light.primary : '#64b5f6';
  const cardBg = colorScheme === 'light' ? Colors.light.backgroundSoft : 'rgba(255,255,255,0.15)';
  const borderColor = colorScheme === 'light' ? Colors.light.cardBorder : 'rgba(255,255,255,0.3)';
  const statusColors = {
    low: colorScheme === 'light' ? Colors.light.statusLow : '#ff4444',
    medium: colorScheme === 'light' ? Colors.light.statusMedium : '#ff8800', 
    high: colorScheme === 'light' ? Colors.light.statusHigh : '#44aa44'
  };
  
  return (
    <View style={[
      styles.headerRow,
      { 
        paddingTop: 8,
        marginTop: 0 
      }
    ]}>
      {/* Logo / Title */}
      <ThemedText type="title" style={styles.header}>
        
      </ThemedText>

      {/* Statistics Panel */}
      {stats && (
        <View style={[styles.statsContainer, { 
          backgroundColor: cardBg,
          borderColor: borderColor 
        }]}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{stats.filtered}</ThemedText>
            <ThemedText style={styles.statLabel}>VISIBLE</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statValue, { color: statusColors.low }]}>{stats.lowCount}</ThemedText>
            <ThemedText style={styles.statLabel}>LOW</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statValue, { color: statusColors.medium }]}>{stats.moderateCount}</ThemedText>
            <ThemedText style={styles.statLabel}>MODERATE</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statValue, { color: statusColors.high }]}>{stats.highCount}</ThemedText>
            <ThemedText style={styles.statLabel}>HIGH</ThemedText>
          </View>
        </View>
      )}

      {/* Right section */}
      <View style={styles.headerRight}>
        {/* Search Bar */}
       {/* <TouchableOpacity activeOpacity={0.9} onPress={focusSearch} style={styles.searchBar}>
          <Pressable onPress={triggerSearch} hitSlop={10} style={{paddingRight: 6}}>
            <FontAwesome5 name="search" size={18} color="rgba(255, 255, 255, 0.7)" style={styles.searchIcon} />
          </Pressable>
          <TextInput
            ref={inputRef}
            placeholder="Search"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={triggerSearch}
            blurOnSubmit={true}
            accessibilityLabel="Search"
            accessible
          />
          {query.length > 0 && (
            <Pressable onPress={clearSearch} hitSlop={10} style={styles.clearBtn} accessibilityLabel="Clear search">
              <FontAwesome5 name="times" size={16} color="rgba(255, 255, 255, 0.6)" />
            </Pressable>
          )}
        </TouchableOpacity>

          */} 
        {/* Theme Toggle Icon */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={colorScheme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
          style={styles.themeIcon}
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
          style={styles.alertIcon}
          onPress={() => router.push('/(tabs)/alerts')}
          hitSlop={10}
        >
          <FontAwesome5 name="bell" size={20} color={iconColor} />
        </Pressable>

        {/* Profile Icon */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Profile"
          style={styles.profileCircle}
          hitSlop={10}
          onPress={() => router.push('/(tabs)/Profile')}
        >
          <FontAwesome5 name="user-circle" size={28} color={iconColor} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 18,
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    // Add subtle shadow for light mode
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'flex-end',
    flex: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 16,
    height: Platform.OS === 'android' ? 42 : 40,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    minWidth: 70,
    flexGrow: 1,
    maxWidth: 150,
  },
  clearBtn: {
    marginLeft: 6,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  themeIcon: {
    marginRight: 12,
  },
  alertIcon: {
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Platform.OS === 'android' ? 6 : 0,
    color: "#ffffff",
  },
  profileCircle: {
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    borderRadius: 16, // More rounded for modern look
    padding: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    // Add subtle shadow for light mode
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 1,
  },
  statLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
});

