import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useColorScheme } from '@/hooks/useColorScheme';

// Profile Header Component
const ProfileHeader = ({ variant }: { variant: 'light' | 'dark' }) => {
  const { userPreference, setUserPreference } = useTheme();
  
  return (
    <View style={[styles.header, { 
      backgroundColor: variant === 'light' ? Colors.light.background : 'rgba(255,255,255,0.05)' 
    }]}>
      <View style={styles.headerContent}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarPlaceholder, { 
            backgroundColor: variant === 'light' ? Colors.light.primary + '20' : 'rgba(255,255,255,0.1)' 
          }]}>
            <Ionicons 
              name="person" 
              size={48} 
              color={variant === 'light' ? Colors.light.primary : '#ffffff'} 
            />
          </View>
          <TouchableOpacity style={[styles.editButton, { 
            backgroundColor: variant === 'light' ? Colors.light.primary + '15' : 'rgba(255,255,255,0.1)',
            borderColor: variant === 'light' ? Colors.light.primary + '30' : 'rgba(255,255,255,0.2)' 
          }]}>
            <Ionicons 
              name="pencil" 
              size={16} 
              color={variant === 'light' ? Colors.light.primary : '#ffffff'} 
            />
          </TouchableOpacity>
        </View>
        
        <ThemedText style={[styles.userName, { 
          color: variant === 'light' ? Colors.light.text : '#ffffff' 
        }]}>
          Devid John
        </ThemedText>
        <ThemedText style={[styles.userRole, { 
          color: variant === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)' 
        }]}>
          Water Resource Manager
        </ThemedText>
        
        <View style={[styles.statusPill, { 
          backgroundColor: variant === 'light' ? Colors.light.statusHigh : '#10b981' 
        }]}>
          <ThemedText style={styles.statusText}>Active Since 2023</ThemedText>
        </View>

        {/* Theme Toggle */}
        <TouchableOpacity
          style={[styles.themeToggle, { 
            backgroundColor: variant === 'light' ? Colors.light.primary + '15' : 'rgba(255,255,255,0.1)' 
          }]}
          onPress={() => setUserPreference(userPreference === 'light' ? 'dark' : 'light')}
        >
          <Ionicons
            name={userPreference === 'light' ? 'moon' : 'sunny'}
            size={20}
            color={variant === 'light' ? Colors.light.primary : '#ffffff'}
          />
          <ThemedText style={[styles.themeText, { 
            color: variant === 'light' ? Colors.light.primary : '#ffffff' 
          }]}>
            {userPreference === 'light' ? 'Dark Mode' : 'Light Mode'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Profile Stats Component
const ProfileStats = ({ variant }: { variant: 'light' | 'dark' }) => {
  return (
    <View style={[styles.section, { 
      backgroundColor: variant === 'light' ? Colors.light.background : 'rgba(255,255,255,0.05)' 
    }]}>
      <ThemedText style={[styles.sectionTitle, { 
        color: variant === 'light' ? Colors.light.text : '#ffffff' 
      }]}>
        My Statistics
      </ThemedText>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { 
            backgroundColor: variant === 'light' ? Colors.light.primary + '15' : 'rgba(96, 165, 250, 0.2)' 
          }]}>
            <Ionicons 
              name="location" 
              size={24} 
              color={variant === 'light' ? Colors.light.primary : '#60a5fa'} 
            />
          </View>
          <ThemedText style={[styles.statValue, { 
            color: variant === 'light' ? Colors.light.text : '#ffffff' 
          }]}>24</ThemedText>
          <ThemedText style={[styles.statLabel, { 
            color: variant === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)' 
          }]}>Monitoring Sites</ThemedText>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { 
            backgroundColor: variant === 'light' ? Colors.light.secondary + '15' : 'rgba(52, 211, 153, 0.2)' 
          }]}>
            <Ionicons 
              name="bar-chart" 
              size={24} 
              color={variant === 'light' ? Colors.light.secondary : '#34d399'} 
            />
          </View>
          <ThemedText style={[styles.statValue, { 
            color: variant === 'light' ? Colors.light.text : '#ffffff' 
          }]}>1,247</ThemedText>
          <ThemedText style={[styles.statLabel, { 
            color: variant === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)' 
          }]}>Data Points</ThemedText>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { 
            backgroundColor: variant === 'light' ? Colors.light.statusMedium + '15' : 'rgba(251, 191, 36, 0.2)' 
          }]}>
            <Ionicons 
              name="alert-circle" 
              size={24} 
              color={variant === 'light' ? Colors.light.statusMedium : '#fbbf24'} 
            />
          </View>
          <ThemedText style={[styles.statValue, { 
            color: variant === 'light' ? Colors.light.text : '#ffffff' 
          }]}>3</ThemedText>
          <ThemedText style={[styles.statLabel, { 
            color: variant === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)' 
          }]}>Active Alerts</ThemedText>
        </View>
      </View>
    </View>
  );
};

// Profile Info Component
const ProfileInfo = ({ variant }: { variant: 'light' | 'dark' }) => {
  return (
    <View style={[styles.section, { 
      backgroundColor: variant === 'light' ? Colors.light.background : 'rgba(255,255,255,0.05)' 
    }]}>
      <ThemedText style={[styles.sectionTitle, { 
        color: variant === 'light' ? Colors.light.text : '#ffffff' 
      }]}>
        Contact Information
      </ThemedText>
      
      <View style={styles.infoList}>
        <View style={styles.infoItem}>
          <View style={[styles.infoIcon, { 
            backgroundColor: variant === 'light' ? Colors.light.primary + '15' : 'rgba(96, 165, 250, 0.2)' 
          }]}>
            <Ionicons 
              name="mail" 
              size={20} 
              color={variant === 'light' ? Colors.light.primary : '#60a5fa'} 
            />
          </View>
          <View style={styles.infoContent}>
            <ThemedText style={[styles.infoLabel, { 
              color: variant === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)' 
            }]}>Email</ThemedText>
            <ThemedText style={[styles.infoValue, { 
              color: variant === 'light' ? Colors.light.text : '#ffffff' 
            }]}>john.devid@dwlr.gov.in</ThemedText>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={[styles.infoIcon, { 
            backgroundColor: variant === 'light' ? Colors.light.secondary + '15' : 'rgba(52, 211, 153, 0.2)' 
          }]}>
            <Ionicons 
              name="call" 
              size={20} 
              color={variant === 'light' ? Colors.light.secondary : '#34d399'} 
            />
          </View>
          <View style={styles.infoContent}>
            <ThemedText style={[styles.infoLabel, { 
              color: variant === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)' 
            }]}>Phone</ThemedText>
            <ThemedText style={[styles.infoValue, { 
              color: variant === 'light' ? Colors.light.text : '#ffffff' 
            }]}>+91 98765 43210</ThemedText>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={[styles.infoIcon, { 
            backgroundColor: variant === 'light' ? Colors.light.statusMedium + '15' : 'rgba(251, 191, 36, 0.2)' 
          }]}>
            <Ionicons 
              name="location" 
              size={20} 
              color={variant === 'light' ? Colors.light.statusMedium : '#fbbf24'} 
            />
          </View>
          <View style={styles.infoContent}>
            <ThemedText style={[styles.infoLabel, { 
              color: variant === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)' 
            }]}>Location</ThemedText>
            <ThemedText style={[styles.infoValue, { 
              color: variant === 'light' ? Colors.light.text : '#ffffff' 
            }]}>Karnataka State</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
};

// Recent Activity Component
const RecentActivity = ({ variant }: { variant: 'light' | 'dark' }) => {
  return (
    <View style={[styles.section, { 
      backgroundColor: variant === 'light' ? Colors.light.background : 'rgba(255,255,255,0.05)' 
    }]}>
      <ThemedText style={[styles.sectionTitle, { 
        color: variant === 'light' ? Colors.light.text : '#ffffff' 
      }]}>
        Recent Activity
      </ThemedText>
      
      <View style={styles.activityList}>
        <View style={styles.activityItem}>
          <View style={[styles.activityIcon, { 
            backgroundColor: variant === 'light' ? Colors.light.primary + '15' : 'rgba(96, 165, 250, 0.2)' 
          }]}>
            <Ionicons 
              name="document-text" 
              size={20} 
              color={variant === 'light' ? Colors.light.primary : '#60a5fa'} 
            />
          </View>
          <View style={styles.activityContent}>
            <ThemedText style={[styles.activityTitle, { 
              color: variant === 'light' ? Colors.light.text : '#ffffff' 
            }]}>Water Level Report Generated</ThemedText>
            <ThemedText style={[styles.activityTime, { 
              color: variant === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)' 
            }]}>2 hours ago</ThemedText>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.activityIcon, { 
            backgroundColor: variant === 'light' ? Colors.light.secondary + '15' : 'rgba(52, 211, 153, 0.2)' 
          }]}>
            <Ionicons 
              name="checkmark-circle" 
              size={20} 
              color={variant === 'light' ? Colors.light.secondary : '#34d399'} 
            />
          </View>
          <View style={styles.activityContent}>
            <ThemedText style={[styles.activityTitle, { 
              color: variant === 'light' ? Colors.light.text : '#ffffff' 
            }]}>Site Inspection Completed</ThemedText>
            <ThemedText style={[styles.activityTime, { 
              color: variant === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)' 
            }]}>1 day ago</ThemedText>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.activityIcon, { 
            backgroundColor: variant === 'light' ? Colors.light.statusMedium + '15' : 'rgba(251, 191, 36, 0.2)' 
          }]}>
            <Ionicons 
              name="alert-circle" 
              size={20} 
              color={variant === 'light' ? Colors.light.statusMedium : '#fbbf24'} 
            />
          </View>
          <View style={styles.activityContent}>
            <ThemedText style={[styles.activityTitle, { 
              color: variant === 'light' ? Colors.light.text : '#ffffff' 
            }]}>Alert Threshold Updated</ThemedText>
            <ThemedText style={[styles.activityTime, { 
              color: variant === 'light' ? Colors.light.textSecondary : 'rgba(255,255,255,0.7)' 
            }]}>3 days ago</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  
  return (
    <>
      {colorScheme === 'light' ? (
        <View style={{ flex: 1, backgroundColor: Colors.light.backgroundSoft }}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{
              paddingBottom: (Platform.OS === 'android' ? 100 : 100) + insets.bottom,
            }}
            showsVerticalScrollIndicator={false}
            bounces={Platform.OS === 'ios'}
          >
            <ProfileHeader variant="light" />
            <View style={styles.content}>
              <ProfileStats variant="light" />
              <ProfileInfo variant="light" />
              <RecentActivity variant="light" />
            </View>
          </ScrollView>
        </View>
      ) : (
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f172a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{
              paddingBottom: (Platform.OS === 'android' ? 100 : 100) + insets.bottom,
            }}
            showsVerticalScrollIndicator={false}
            bounces={Platform.OS === 'ios'}
          >
            <ProfileHeader variant="dark" />
            <View style={styles.content}>
              <ProfileStats variant="dark" />
              <ProfileInfo variant="dark" />
              <RecentActivity variant="dark" />
            </View>
          </ScrollView>
        </LinearGradient>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },
  header: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  userRole: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  statusPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  infoList: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
  },
});
