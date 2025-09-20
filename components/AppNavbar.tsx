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
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{stats.filtered}</ThemedText>
            <ThemedText style={styles.statLabel}>VISIBLE</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statValue, { color: '#ff4444' }]}>{stats.lowCount}</ThemedText>
            <ThemedText style={styles.statLabel}>LOW</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statValue, { color: '#ff8800' }]}>{stats.moderateCount}</ThemedText>
            <ThemedText style={styles.statLabel}>MODERATE</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statValue, { color: '#44aa44' }]}>{stats.highCount}</ThemedText>
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
        {/* Alerts Icon */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Alerts"
          style={styles.alertIcon}
          onPress={() => router.push('/(tabs)/alerts')}
          hitSlop={10}
        >
          <FontAwesome5 name="bell" size={20} color="#64b5f6" />
        </Pressable>

        {/* Profile Icon */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Profile"
          style={styles.profileCircle}
          hitSlop={10}
          onPress={() => router.push('/(tabs)/Profile')}
        >
          <FontAwesome5 name="user-circle" size={28} color="#64b5f6" />
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
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
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

