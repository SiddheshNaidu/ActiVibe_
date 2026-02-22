import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable, Image, Dimensions } from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/theme';
import { SEED_VOLUNTEER, SEED_ENDORSEMENTS } from '@/data/seed';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const ENDORSE_CARD_WIDTH = (width - 52) / 2;

export default function ProfileScreen() {
  const router = useRouter();
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;
  const vol = SEED_VOLUNTEER;
  const logout = useAuthStore((s) => s.logout);

  const driveHistory = [
    { name: 'Versova Beach Cleanup', ngo: 'Greenpeace Mumbai', role: 'Logistics Coordinator', hours: '2:47', date: 'Jun 2025' },
    { name: 'Literacy Sessions', ngo: 'Teach For India', role: 'Tutor', hours: '4:12', date: 'May 2025' },
    { name: 'City Cleanup Drive', ngo: 'iVolunteer', role: 'Team Lead', hours: '3:15', date: 'Apr 2025' },
    { name: 'Orientation Drive', ngo: 'NSS Mumbai', role: 'Volunteer', hours: '1:30', date: 'Mar 2024' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <LinearGradient
          colors={darkMode ? ['#064E3B', '#0F0E17'] : ['#059669', '#10B981']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ height: 180, position: 'relative' }}
        >
          <Pressable
            onPress={() => {
              logout();
              router.replace('/');
            }}
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

        {/* Identity Row */}
        <View style={{ paddingHorizontal: 20, marginTop: -44 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <View style={{
              width: 96, height: 96, borderRadius: 48, borderWidth: 4, borderColor: colors.surface,
              overflow: 'hidden', backgroundColor: colors.card,
              shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15, shadowRadius: 8,
            }}>
              <Image source={{ uri: vol.avatarUrl }} style={{ width: 88, height: 88, borderRadius: 44 }} />
            </View>
            <View style={{ flex: 1, marginLeft: 14, marginBottom: 8 }}>
              <Text style={{ fontSize: 24, fontWeight: '800', color: colors.ink }}>{vol.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <View style={{
                  backgroundColor: colors.brandLight, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 9999,
                }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.brand }}>Volunteer</Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.inkMuted }}>Since {vol.joinedDate}</Text>
              </View>
            </View>
          </View>

          <Text style={{ fontSize: 14, color: colors.inkLight, marginTop: 12, lineHeight: 21 }}>
            {vol.bio}
          </Text>
        </View>

        {/* Primary Stat */}
        <View style={{
          marginHorizontal: 20, marginTop: 20, backgroundColor: colors.card,
          borderRadius: 20, padding: 20, borderLeftWidth: 4, borderLeftColor: '#059669',
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
          borderWidth: 1, borderColor: colors.border,
        }}>
          <Text style={{ fontSize: 36, fontWeight: '800', color: '#059669' }}>
            {vol.totalActiveHours} hrs
          </Text>
          <Text style={{ fontSize: 15, color: colors.inkMuted, marginTop: 2, fontWeight: '500' }}>
            Total Active Drive Time
          </Text>
          <Text style={{ fontSize: 11, color: colors.inkMuted, fontStyle: 'italic', marginTop: 2 }}>
            (GPS-verified — time inside drive zones only)
          </Text>

          <View style={{
            flexDirection: 'row', marginTop: 18, gap: 20,
            paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border,
          }}>
            {[
              { value: vol.drivesCompleted, label: 'Drives', emoji: '🎯' },
              { value: vol.endorsementCount, label: 'Endorsed', emoji: '⭐' },
              { value: 'Mumbai', label: 'Location', emoji: '📍' },
            ].map((stat, i) => (
              <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 12, marginBottom: 4 }}>{stat.emoji}</Text>
                <Text style={{ fontSize: 20, fontWeight: '800', color: colors.ink }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 11, color: colors.inkMuted, fontWeight: '500' }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Skills */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 12 }}>Skills</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {vol.skills?.map((skill, i) => (
              <View key={i} style={{
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9999,
                backgroundColor: skill.tier === 'endorsed' ? colors.brand : skill.tier === 'inferred' ? colors.brandLight : 'transparent',
                borderWidth: skill.tier === 'self' ? 1.5 : 0,
                borderColor: colors.brand,
              }}>
                <Text style={{
                  fontSize: 13, fontWeight: '700',
                  color: skill.tier === 'endorsed' ? '#FFF' : colors.brand,
                }}>
                  {skill.category}
                </Text>
                {skill.tier === 'endorsed' && (
                  <Text style={{ fontSize: 11, color: '#FFF', marginLeft: 4 }}>✓</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Endorsements */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink }}>Endorsements</Text>
          <Text style={{ fontSize: 12, color: colors.inkMuted, fontStyle: 'italic', marginTop: 3, marginBottom: 14 }}>
            Manually awarded by NGO coordinators.
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {SEED_ENDORSEMENTS.map((end) => (
              <View key={end.id} style={{
                width: ENDORSE_CARD_WIDTH, backgroundColor: colors.card, borderRadius: 18,
                padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
                borderWidth: 1, borderColor: colors.border,
              }}>
                <View style={{
                  width: 44, height: 44, borderRadius: 14,
                  backgroundColor: colors.brandLight,
                  alignItems: 'center', justifyContent: 'center', marginBottom: 10,
                }}>
                  <Text style={{ fontSize: 24 }}>{end.emoji}</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>
                  {end.badgeName}
                </Text>
                <Text style={{ fontSize: 12, color: colors.inkMuted, marginTop: 3 }}>
                  {end.ngoName}
                </Text>
                <Text style={{ fontSize: 10, color: colors.inkMuted, marginTop: 2 }}>{end.driveName} • {end.date}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Drive History */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 12 }}>
            Drive History
          </Text>
          {driveHistory.map((drive, i) => (
            <View key={i} style={{
              flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
              borderBottomWidth: i < driveHistory.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}>
              <View style={{
                width: 38, height: 38, borderRadius: 12,
                backgroundColor: colors.brandLight,
                alignItems: 'center', justifyContent: 'center', marginRight: 12,
              }}>
                <Text style={{ fontSize: 16 }}>✅</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>{drive.name}</Text>
                <Text style={{ fontSize: 12, color: colors.inkMuted }}>{drive.ngo} • {drive.role}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#059669' }}>{drive.hours}</Text>
                <Text style={{ fontSize: 10, color: colors.inkMuted }}>{drive.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Verified Seal */}
        <View style={{
          marginHorizontal: 20, marginTop: 24, marginBottom: 16,
          backgroundColor: colors.card, borderRadius: 18, padding: 18,
          borderLeftWidth: 4, borderLeftColor: colors.brand,
          borderWidth: 1, borderColor: colors.border,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 20, marginRight: 8 }}>🛡️</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink }}>ActiVibe Verified</Text>
          </View>
          <Text style={{ fontSize: 13, color: colors.inkLight, lineHeight: 19 }}>
            Every hour confirmed by GPS geofence. Every endorsement is a deliberate award from an NGO coordinator.
          </Text>
        </View>

        {/* Share footer */}
        <Pressable
          style={({ pressed }) => ({
            marginHorizontal: 20, marginBottom: 40, height: 52, borderRadius: 18,
            borderWidth: 2, borderColor: colors.brand,
            alignItems: 'center', justifyContent: 'center',
            flexDirection: 'row',
            backgroundColor: 'rgba(5, 150, 105, 0.06)',
            transform: [{ scale: pressed ? 0.96 : 1 }],
          })}
        >
          <Text style={{ fontSize: 16, marginRight: 8 }}>📸</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.brand }}>Save as Image</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
