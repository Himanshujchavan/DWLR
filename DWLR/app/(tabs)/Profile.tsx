import React, { useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import AppNavbar from '@/components/AppNavbar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const TABS = ['Overview', 'Saved Data', 'Settings'] as const;

type TabKey = typeof TABS[number];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>('Overview');

  const stats = useMemo(() => ([
    { label: 'Groundwater Alerts', value: '3', icon: 'alert-circle-outline', color: '#f59e42' },
    { label: 'Last Login', value: '2h ago', icon: 'time-outline', color: '#22d3ee' },
    { label: 'Recent Activity', value: '7 actions', icon: 'flash-outline', color: '#10b981' },
  ]), []);

  return (
    <LinearGradient
      colors={['#1a237e', '#283593', '#3949ab']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 100 + insets.bottom : 100 }}
        showsVerticalScrollIndicator={false}
        bounces={Platform.OS === 'ios'}
      >
        <AppNavbar />

        {/* Header with Avatar and Edit Button */}
        <LinearGradient
          colors={["#0ea5e9", "#10b981"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity style={styles.editBtn} accessibilityRole="button" accessibilityLabel="Edit Profile">
            <Ionicons name="create-outline" size={18} color="#0ea5e9" />
          </TouchableOpacity>

          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/200?img=32' }}
              style={styles.avatar}
            />
          </View>
          <ThemedText style={styles.name}>Himanshu Chavan</ThemedText>
          <ThemedText style={styles.role}>Researcher • Water Resources</ThemedText>
        </LinearGradient>

        {/* User Info Card */}
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
          <View style={styles.sectionWrap}>
            {/* Quick Stats */}
            <ThemedText style={styles.sectionTitle}>Quick Stats</ThemedText>
            <View style={styles.statsRow}>
              {stats.map(s => (
                <View key={s.label} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${s.color}26` }] }>
                    <Ionicons name={s.icon as any} size={18} color={s.color} />
                  </View>
                  <ThemedText style={styles.statValue}>{s.value}</ThemedText>
                  <ThemedText style={styles.statLabel}>{s.label}</ThemedText>
                </View>
              ))}
            </View>

            {/* Notifications */}
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

            {/* Downloads */}
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
        )}

        {activeTab === 'Saved Data' && (
          <View style={styles.sectionWrap}>
            <ThemedText style={styles.sectionTitle}>Saved Reports</ThemedText>
            <ThemedView style={styles.card}>
              <ThemedText style={styles.noteText}>You have 4 saved reports and 2 bookmarked stations.</ThemedText>
            </ThemedView>
          </View>
        )}

        {activeTab === 'Settings' && (
          <View style={styles.sectionWrap}>
            <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
            <ThemedView style={styles.card}>
              <View style={styles.prefRow}>
                <ThemedText style={styles.infoLabel}>Notifications</ThemedText>
                <TouchableOpacity style={styles.switchPill}>
                  <View style={[styles.switchDot, { left: 18 }]} />
                  <ThemedText style={styles.switchText}>On</ThemedText>
                </TouchableOpacity>
              </View>
              <View style={styles.prefRow}>
                <ThemedText style={styles.infoLabel}>Dark Mode</ThemedText>
                <TouchableOpacity style={[styles.switchPill, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
                  <View style={[styles.switchDot, { left: 2, backgroundColor: '#9ca3af' }]} />
                  <ThemedText style={styles.switchText}>Off</ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsWrap}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#22d3ee' }]}> 
            <ThemedText style={styles.actionText}>Edit Profile</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#93c5fd' }]}> 
            <ThemedText style={styles.actionText}>Manage Preferences</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ef4444' }]}> 
            <ThemedText style={styles.actionText}>Logout</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    margin: 16,
    borderRadius: 20,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  editBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)'
  },
  avatarWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 5,
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
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
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
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 6,
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.18)'
  },
  tabText: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  sectionWrap: {
    marginTop: 16,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 8,
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 18,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    fontSize: 12,
    textAlign: 'center'
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
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)'
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
  actionsWrap: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
    marginBottom: 24,
  },
  actionBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionText: {
    color: '#0b1220',
    fontWeight: '800',
  },
});
