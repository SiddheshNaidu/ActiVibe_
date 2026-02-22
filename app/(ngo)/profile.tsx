import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/theme';
import { SEED_NGO, SEED_NGO_KPIS } from '@/data/seed';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const KPI_WIDTH = (width - 52) / 2;

export default function NGOProfileScreen() {
  const router = useRouter();
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;
  const ngo = SEED_NGO;
  const kpis = SEED_NGO_KPIS;
  const logout = useAuthStore((s) => s.logout);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: darkMode ? '#064E3B' : '#059669' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={darkMode ? ['#064E3B', '#0F0E17'] : ['#059669', '#047857']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ height: 180, position: 'relative' }}
        >
          <Pressable
            onPress={() => { logout(); router.replace('/'); }}
            style={({ pressed }) => ({
              position: 'absolute', top: 12, right: 16, zIndex: 10,
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center', justifyContent: 'center',
              transform: [{ scale: pressed ? 0.9 : 1 }],
            })}
          >
            <Text style={{ fontSize: 20 }}>⚙️</Text>
          </Pressable>
        </LinearGradient>

        <View style={{ paddingHorizontal: 20, marginTop: -40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <View style={{
              width: 88, height: 88, borderRadius: 20, borderWidth: 4, borderColor: colors.surface,
              overflow: 'hidden', backgroundColor: colors.card,
              shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15, shadowRadius: 8,
            }}>
              <Image source={{ uri: ngo.avatarUrl }} style={{ width: 80, height: 80, borderRadius: 16 }} />
            </View>
            <View style={{ flex: 1, marginLeft: 14, marginBottom: 6 }}>
              <Text style={{ fontSize: 24, fontWeight: '800', color: colors.ink }}>{ngo.name}</Text>
              <View style={{
                backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 3,
                borderRadius: 9999, alignSelf: 'flex-start', marginTop: 4,
              }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#059669' }}>✓ Verified</Text>
              </View>
            </View>
          </View>

          <Text style={{ fontSize: 14, color: colors.inkLight, marginTop: 14 }}>
            📍 {ngo.location} • Since {ngo.joinedDate}
          </Text>

          {/* KPI Grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
            {[
              { label: 'Active Drives', value: kpis.activeDrives, icon: '🚀', color: '#059669' },
              { label: 'Total Volunteers', value: kpis.totalVolunteers, icon: '👥', color: '#3B82F6' },
              { label: 'Check-In Rate', value: `${kpis.avgCheckinRate}%`, icon: '📍', color: '#059669' },
              { label: 'Endorsements', value: kpis.endorsementsAwarded, icon: '🏅', color: '#F59E0B' },
            ].map((stat, i) => (
              <View key={i} style={{
                width: KPI_WIDTH, backgroundColor: colors.card, borderRadius: 20,
                padding: 18, alignItems: 'center',
                borderWidth: 1, borderColor: colors.glassBorder,
                shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
              }}>
                <View style={{
                  width: 44, height: 44, borderRadius: 14,
                  backgroundColor: `${stat.color}15`,
                  alignItems: 'center', justifyContent: 'center', marginBottom: 8,
                }}>
                  <Text style={{ fontSize: 22 }}>{stat.icon}</Text>
                </View>
                <Text style={{ fontSize: 24, fontWeight: '800', color: stat.color }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 12, color: colors.inkMuted, marginTop: 4, fontWeight: '500' }}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Action buttons */}
          <Pressable
            onPress={() => router.push('/(ngo)/create-drive')}
            style={({ pressed }) => ({
              marginTop: 24, borderRadius: 22, overflow: 'hidden',
              transform: [{ scale: pressed ? 0.96 : 1 }],
              shadowColor: '#059669', shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
            })}
          >
            <LinearGradient
              colors={['#059669', '#10B981']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{
                height: 56, alignItems: 'center', justifyContent: 'center',
                flexDirection: 'row',
              }}
            >
              <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700' }}>+ Create New Drive</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(ngo)/analytics')}
            style={({ pressed }) => ({
              marginTop: 12, marginBottom: 40, height: 52, borderRadius: 18,
              borderWidth: 2, borderColor: colors.brand,
              alignItems: 'center', justifyContent: 'center',
              flexDirection: 'row',
              backgroundColor: 'rgba(5, 150, 105, 0.06)',
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            <Text style={{ fontSize: 16, marginRight: 8 }}>📊</Text>
            <Text style={{ color: colors.brand, fontSize: 15, fontWeight: '700' }}>View Analytics</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
