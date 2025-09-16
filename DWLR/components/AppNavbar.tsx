import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "./ThemedText";

type Props = {
  onSearch?: (query: string) => void;
};

export default function AppNavbar({ onSearch }: Props) {
  useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<TextInput | null>(null);
  const triggerSearch = () => {
    const q = query.trim();
    if (q.length > 0) onSearch?.(q);
  };
  const clearSearch = () => {
    setQuery("");
    // Keep focus on Android for quick retype
    if (Platform.OS === 'android') inputRef.current?.focus();
  };
  const focusSearch = () => inputRef.current?.focus();
  
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
        <Pressable style={styles.profileCircle}>
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
});

