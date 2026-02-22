import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/theme';
import {
  SEED_ANALYTICS_SUMMARY, SEED_ANALYTICS_VOLUNTEERS,
  SEED_ZONE_TIME_DISTRIBUTION, SEED_ROLE_FILL, SEED_DRIVE,
} from '@/data/seed';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const STAT_WIDTH = (width - 52) / 2;

export default function AnalyticsScreen() {
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;
  const summary = SEED_ANALYTICS_SUMMARY;
  const volunteers = SEED_ANALYTICS_VOLUNTEERS;
  const maxMinutes = Math.max(...volunteers.map((v) => v.activeMinutes));

  const statCards = [
    { label: 'Total Volunteers', value: summary.totalVolunteers.toString(), emoji: '👥', gradient: ['#3B82F6', '#60A5FA'] },
    { label: 'Avg Active Time', value: summary.avgActiveTime, emoji: '⏱️', gradient: ['#059669', '#34D399'] },
    { label: 'Collective Hours', value: `${summary.totalCollectiveHours}h`, emoji: '🔥', gradient: ['#F59E0B', '#FBBF24'] },
    { label: 'Attendance Rate', value: `${summary.attendanceRate}%`, emoji: '📍', gradient: ['#059669', '#10B981'], trend: '↑ 12%' },
  ];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View style={{
        paddingHorizontal: 20, paddingVertical: 16,
        backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: colors.ink }}>Drive Analytics</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <Text style={{ fontSize: 14, color: colors.inkMuted }}>{SEED_DRIVE.name}</Text>
              <View style={{
                backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 9999,
              }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#059669' }}>GPS Tracked</Text>
              </View>
            </View>
          </View>
          <Pressable style={({ pressed }) => ({
            width: 40, height: 40, borderRadius: 14,
            backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center',
            transform: [{ scale: pressed ? 0.9 : 1 }],
          })}>
            <Text style={{ fontSize: 18 }}>📤</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {/* Summary Stats — 2x2 Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
          {statCards.map((card, i) => (
            <View key={i} style={{
              width: STAT_WIDTH, backgroundColor: colors.card, borderRadius: 20,
              padding: 16, overflow: 'hidden',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
              borderWidth: 1, borderColor: colors.glassBorder,
            }}>
              <View style={{
                width: 38, height: 38, borderRadius: 12,
                backgroundColor: `${card.gradient[0]}15`,
                alignItems: 'center', justifyContent: 'center', marginBottom: 8,
              }}>
                <Text style={{ fontSize: 18 }}>{card.emoji}</Text>
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: card.gradient[0] }}>{card.value}</Text>
              <Text style={{ fontSize: 12, color: colors.inkMuted, marginTop: 3, fontWeight: '500' }}>{card.label}</Text>
              {card.trend && (
                <Text style={{ fontSize: 11, color: '#059669', fontWeight: '700', marginTop: 3 }}>{card.trend}</Text>
              )}
            </View>
          ))}
        </View>

        {/* GPS Banner */}
        <View style={{
          marginTop: 20, backgroundColor: colors.tealLight, borderRadius: 16,
          borderLeftWidth: 4, borderLeftColor: colors.teal, padding: 14,
        }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: darkMode ? colors.teal : colors.ink, lineHeight: 20 }}>
            ✓ All data automatically tracked by GPS geofence. Zero manual input.
          </Text>
        </View>

        {/* Per-Volunteer Active Time */}
        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink, marginTop: 28, marginBottom: 14 }}>
          Active Time Per Volunteer
        </Text>
        {volunteers.map((vol, i) => (
          <View key={vol.id} style={{
            flexDirection: 'row', alignItems: 'center', marginBottom: 10,
            backgroundColor: i === 0 ? colors.brandLight : 'transparent',
            borderRadius: 14, padding: 10,
          }}>
            <View style={{
              width: 32, height: 32, borderRadius: 16, borderWidth: 2,
              borderColor: i === 0 ? colors.brand : colors.border,
              overflow: 'hidden', backgroundColor: colors.card,
            }}>
              <Image source={{ uri: vol.avatar }} style={{ width: 28, height: 28, borderRadius: 14 }} />
            </View>
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.ink, width: 70, marginLeft: 10 }} numberOfLines={1}>
              {vol.name.split(' ')[0]}
            </Text>
            <View style={{ flex: 1, height: 22, backgroundColor: colors.gray100, borderRadius: 6, marginHorizontal: 8 }}>
              <LinearGradient
                colors={['#059669', '#10B981'] as any}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{
                  width: `${(vol.activeMinutes / maxMinutes) * 100}%` as any,
                  height: '100%', borderRadius: 6,
                }}
              />
            </View>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#059669', width: 50, textAlign: 'right' }}>
              {vol.activeTime.slice(0, 4)}
            </Text>
          </View>
        ))}

        {/* Attendance Funnel */}
        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink, marginTop: 28, marginBottom: 14 }}>
          Attendance Funnel
        </Text>
        <View style={{ alignItems: 'center', gap: 6 }}>
          {[
            { label: 'Registered', count: summary.registeredCount, gradient: ['#3B82F6', '#60A5FA'], widthPct: '100%' },
            { label: 'Checked In', count: summary.checkedInCount, gradient: ['#059669', '#10B981'], widthPct: '82%' },
            { label: 'Completed', count: summary.completedCount, gradient: ['#059669', '#34D399'], widthPct: '68%' },
          ].map((step, i) => (
            <View key={i} style={{ width: '100%', alignItems: 'center' }}>
              <View style={{
                width: step.widthPct as any, height: 48, borderRadius: 14,
                overflow: 'hidden',
              }}>
                <LinearGradient
                  colors={step.gradient as any}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={{
                    flex: 1, alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFF' }}>{step.count}</Text>
                  <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginLeft: 8, fontWeight: '600' }}>{step.label}</Text>
                </LinearGradient>
              </View>
              {i < 2 && <Text style={{ fontSize: 16, color: colors.inkMuted, marginVertical: 2 }}>↓</Text>}
            </View>
          ))}
        </View>

        {/* Role Fill Rate */}
        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink, marginTop: 28, marginBottom: 14 }}>
          Role Breakdown
        </Text>
        {SEED_ROLE_FILL.map((role, i) => (
          <View key={i} style={{
            backgroundColor: colors.card, borderRadius: 16, padding: 14, marginBottom: 10,
            borderWidth: 1, borderColor: colors.glassBorder,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.ink }}>{role.role}</Text>
                <Text style={{ fontSize: 11, color: colors.inkMuted, marginTop: 2 }}>
                  {role.filled} of {role.total} slots • {role.avgHours}h avg
                </Text>
              </View>
              <View style={{
                paddingHorizontal: 10, paddingVertical: 3, borderRadius: 9999,
                backgroundColor: role.filled >= role.total ? '#D1FAE5' : '#FEF3C7',
              }}>
                <Text style={{
                  fontSize: 11, fontWeight: '700',
                  color: role.filled >= role.total ? '#059669' : '#D97706',
                }}>
                  {Math.round((role.filled / role.total) * 100)}%
                </Text>
              </View>
            </View>
            <View style={{
              height: 8, backgroundColor: colors.gray100, borderRadius: 4, marginTop: 10,
            }}>
              <View style={{
                width: `${(role.filled / role.total) * 100}%`, height: '100%',
                backgroundColor: role.filled < role.total ? '#D97706' : '#059669',
                borderRadius: 4,
              }} />
            </View>
          </View>
        ))}

        {/* Zone Time Distribution */}
        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink, marginTop: 28, marginBottom: 14 }}>
          Activity by Time of Day
        </Text>
        <View style={{
          backgroundColor: colors.card, borderRadius: 18, padding: 16,
          borderWidth: 1, borderColor: colors.glassBorder,
        }}>
          <View style={{
            flexDirection: 'row', alignItems: 'flex-end', height: 120,
            gap: 4, paddingHorizontal: 2,
          }}>
            {SEED_ZONE_TIME_DISTRIBUTION.map((slot, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                <View style={{
                  width: '100%', height: Math.max(6, (slot.count / 23) * 100),
                  borderTopLeftRadius: 4, borderTopRightRadius: 4,
                  overflow: 'hidden',
                }}>
                  <LinearGradient
                    colors={['#059669', '#10B981'] as any}
                    style={{ flex: 1 }}
                  />
                </View>
                <Text style={{ fontSize: 8, color: colors.inkMuted, marginTop: 6, fontWeight: '500' }}>{slot.hour}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Export */}
        <Pressable style={({ pressed }) => ({
          marginTop: 24, height: 52, borderRadius: 18, borderWidth: 2, borderColor: colors.brand,
          alignItems: 'center', justifyContent: 'center',
          flexDirection: 'row',
          backgroundColor: 'rgba(5, 150, 105, 0.06)',
          transform: [{ scale: pressed ? 0.96 : 1 }],
        })}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>📊</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.brand }}>Export as CSV</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
