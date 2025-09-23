import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/contexts/ThemeContext';

const TABS = ['Overview', 'Saved Data', 'Settings'] as const;

type TabKey = typeof TABS[number];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>('Overview');
  const { colorScheme, userPreference, setUserPreference } = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 100 + insets.bottom : 100 }}
      >

        {/* Hero Section */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.editBtn} accessibilityRole="button" accessibilityLabel="Edit Profile">
            <Ionicons name="create-outline" size={18} color="#64b5f6" />
          </TouchableOpacity>

          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: '' }}
              style={styles.avatar}
            />
          </View>
          <ThemedText style={styles.heroValue}>Himanshu Chavan</ThemedText>
          <ThemedText style={styles.heroLabel}>Researcher • Water Resources</ThemedText>
          <View style={styles.heroPill}>
            <ThemedText style={styles.heroPillText}>Active • Online</ThemedText>
          </View>
        </View>

        {/* Main Content Cards */}
        <View style={styles.cardContainer}>
          {/* User Info Card */}
          <View style={styles.cardShadow}>
            <ThemedView style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconBadge, { backgroundColor: '#2563eb20' }]}>
              <Ionicons name="person-circle-outline" size={20} color="#93c5fd" />
            </View>
            <ThemedText style={styles.cardTitle}>Contact</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Email</ThemedText>
            <ThemedText style={styles.infoValue}>himanshu@example.com</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Phone</ThemedText>
            <ThemedText style={styles.infoValue}>+91 98765 43210</ThemedText>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }] }>
            <ThemedText style={styles.infoLabel}>Location</ThemedText>
            <TouchableOpacity style={styles.linkRow}>
              <Ionicons name="location-outline" color="#22d3ee" size={16} />
              <ThemedText style={[styles.infoValue, { color: '#22d3ee' }]}>Pune, Maharashtra</ThemedText>
            </TouchableOpacity>
          </View>
          </ThemedView>
        </View>

        </View>

        {/* Tabs */}
        <View style={styles.tabsWrap}>
          {TABS.map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              >
                <ThemedText style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab Contents */}
        {activeTab === 'Overview' && (
          <View style={styles.cardContainer}>
            {/* Quick Stats */}
            <View style={styles.cardShadow}>
              <ThemedView style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, {backgroundColor: '#2563eb15'}]}>
                    <Ionicons name="stats-chart-outline" size={24} color="#2563eb" />
                  </View>
                  <ThemedText style={styles.cardTitle}>Quick Stats</ThemedText>
                </View>
                <ThemedText style={styles.cardSubtitle}>Your activity overview</ThemedText>
                
                <View style={styles.dataRow}>
                  <ThemedText style={styles.dataLabel}>Groundwater Alerts</ThemedText>
                  <ThemedText style={[styles.dataValue, {color: '#f59e42'}]}>3 Active</ThemedText>
                </View>
                <View style={styles.dataRow}>
                  <ThemedText style={styles.dataLabel}>Last Login</ThemedText>
                  <ThemedText style={styles.dataValue}>2h ago</ThemedText>
                </View>
                <View style={[styles.dataRow, {borderBottomWidth: 0}]}>
                  <ThemedText style={styles.dataLabel}>Recent Activity</ThemedText>
                  <ThemedText style={[styles.dataValue, {color: '#10b981'}]}>7 actions</ThemedText>
                </View>
              </ThemedView>
            </View>

            {/* Notifications */}
            <View style={styles.cardShadow}>
              <ThemedView style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={[styles.iconBadge, { backgroundColor: '#f59e4220' }]}>
                  <MaterialCommunityIcons name="bell-alert-outline" size={20} color="#f59e42" />
                </View>
                <ThemedText style={styles.cardTitle}>Notifications</ThemedText>
              </View>
              <View style={styles.noteItem}>
                <ThemedText style={styles.noteTitle}>AI Prediction</ThemedText>
                <ThemedText style={styles.noteText}>Recharge expected to increase by 8% next week.</ThemedText>
              </View>
              <View style={styles.noteItem}>
                <ThemedText style={styles.noteTitle}>Recharge Alert</ThemedText>
                <ThemedText style={styles.noteText}>Monsoon recharge levels above seasonal average.</ThemedText>
              </View>
              <View style={[styles.noteItem, { borderBottomWidth: 0 }]}>
                <ThemedText style={styles.noteTitle}>Drought Warning</ThemedText>
                <ThemedText style={styles.noteText}>Northern block showing early signs of stress.</ThemedText>
              </View>
              </ThemedView>
            </View>

            {/* Downloads */}
            <View style={styles.cardShadow}>
              <ThemedView style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={[styles.iconBadge, { backgroundColor: '#22d3ee20' }]}>
                  <Ionicons name="download-outline" size={20} color="#22d3ee" />
                </View>
                <ThemedText style={styles.cardTitle}>Downloads</ThemedText>
              </View>
              <View style={styles.downloadRow}>
                <MaterialCommunityIcons name="file-chart-outline" size={18} color="#93c5fd" />
                <ThemedText style={styles.downloadText}>Groundwater Monthly Report.pdf</ThemedText>
                <TouchableOpacity style={styles.downloadBtn}>
                  <Ionicons name="download-outline" size={16} color="#1f2937" />
                </TouchableOpacity>
              </View>
              <View style={styles.downloadRow}>
                <MaterialCommunityIcons name="map-outline" size={18} color="#93c5fd" />
                <ThemedText style={styles.downloadText}>Aquifer Map - North Block.svg</ThemedText>
                <TouchableOpacity style={styles.downloadBtn}>
                  <Ionicons name="download-outline" size={16} color="#1f2937" />
                </TouchableOpacity>
              </View>
              </ThemedView>
            </View>
          </View>
        )}

        {activeTab === 'Saved Data' && (
          <View style={styles.cardContainer}>
            <View style={styles.cardShadow}>
              <ThemedView style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, {backgroundColor: '#10b98115'}]}>
                    <Ionicons name="bookmarks-outline" size={24} color="#10b981" />
                  </View>
                  <ThemedText style={styles.cardTitle}>Saved Reports</ThemedText>
                </View>
                <ThemedText style={styles.cardSubtitle}>Your saved data and bookmarks</ThemedText>
                <ThemedText style={styles.noteText}>You have 4 saved reports and 2 bookmarked stations.</ThemedText>
              </ThemedView>
            </View>
          </View>
        )}

        {activeTab === 'Settings' && (
          <View style={styles.cardContainer}>
            <View style={styles.cardShadow}>
              <ThemedView style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, {backgroundColor: '#8b5cf615'}]}>
                    <Ionicons name="settings-outline" size={24} color="#8b5cf6" />
                  </View>
                  <ThemedText style={styles.cardTitle}>Preferences</ThemedText>
                </View>
                <ThemedText style={styles.cardSubtitle}>Manage your app settings</ThemedText>
                
                <View style={styles.dataRow}>
                  <ThemedText style={styles.dataLabel}>Notifications</ThemedText>
                  <TouchableOpacity style={styles.switchPill}>
                    <View style={[styles.switchDot, { left: 18 }]} />
                    <ThemedText style={styles.switchText}>On</ThemedText>
                  </TouchableOpacity>
                </View>
                <View style={[styles.dataRow, {borderBottomWidth: 0}]}>
                  <View>
                    <ThemedText style={styles.dataLabel}>Theme</ThemedText>
                    <ThemedText style={[styles.dataLabel, { fontSize: 12, opacity: 0.7, marginTop: 2 }]}>
                      Current: {userPreference === 'system' ? `System (${colorScheme})` : userPreference}
                    </ThemedText>
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.switchPill, 
                      { backgroundColor: colorScheme === 'dark' ? '#64b5f6' : 'rgba(255,255,255,0.12)' }
                    ]}
                    onPress={() => {
                      const newPreference = colorScheme === 'dark' ? 'light' : 'dark';
                      setUserPreference(newPreference);
                    }}
                  >
                    <View style={[
                      styles.switchDot, 
                      { 
                        left: colorScheme === 'dark' ? 18 : 2, 
                        backgroundColor: colorScheme === 'dark' ? '#ffffff' : '#9ca3af' 
                      }
                    ]} />
                    <ThemedText style={styles.switchText}>
                      {colorScheme === 'dark' ? 'Dark' : 'Light'}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </ThemedView>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.cardContainer}>
          <View style={styles.cardShadow}>
            <ThemedView style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, {backgroundColor: '#22d3ee15'}]}>
                  <Ionicons name="options-outline" size={24} color="#22d3ee" />
                </View>
                <ThemedText style={styles.cardTitle}>Actions</ThemedText>
              </View>
              <ThemedText style={styles.cardSubtitle}>Manage your profile and settings</ThemedText>
              
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2563eb' }]}> 
                <ThemedText style={styles.actionText}>Edit Profile</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10b981', marginTop: 10 }]}> 
                <ThemedText style={styles.actionText}>Manage Preferences</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ef4444', marginTop: 10 }]}> 
                <ThemedText style={styles.actionText}>Logout</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#16213e',
    marginBottom: 20,
    minHeight: 180,
    position: 'relative',
  },
  heroValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 40,
  },
  heroLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  heroPill: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  heroPillText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  editBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cardShadow: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  dataLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  avatarWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 3,
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  name: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  role: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  card: {
    // Dynamic styling applied inline based on theme
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)'
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.8)'
  },
  infoValue: {
    color: '#ffffff',
    fontWeight: '600'
  },
  tabsWrap: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.15)'
  },
  tabText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    fontSize: 15,
  },
  tabTextActive: {
    color: '#ffffff',
  },


  noteItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)'
  },
  noteTitle: {
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 4,
  },
  noteText: {
    color: 'rgba(255,255,255,0.85)'
  },
  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)'
  },
  downloadText: {
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  downloadBtn: {
    backgroundColor: '#e5e7eb',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  switchPill: {
    width: 56,
    height: 28,
    borderRadius: 16,
    backgroundColor: 'rgba(34, 211, 238, 0.25)',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchDot: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22d3ee',
  },
  switchText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700'
  },
  actionBtn: {
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});
