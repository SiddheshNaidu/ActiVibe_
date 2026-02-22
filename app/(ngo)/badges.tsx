import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authStore';
import { Colors, BadgeTypes } from '@/constants/theme';
import { SEED_ANALYTICS_VOLUNTEERS, SEED_DRIVE } from '@/data/seed';

const { width } = Dimensions.get('window');

export default function BadgesScreen() {
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;
  const [awardedBadges, setAwardedBadges] = useState<Record<string, string[]>>({});

  const volunteers = SEED_ANALYTICS_VOLUNTEERS;

  const awardBadge = (volId: string, badgeName: string) => {
    setAwardedBadges((prev) => ({
      ...prev,
      [volId]: [...(prev[volId] || []), badgeName],
    }));
    Alert.alert('✅ Badge Awarded!', `${badgeName} has been awarded.`);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View style={{
        paddingHorizontal: 20, paddingVertical: 16,
        backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border,
      }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.ink }}>Award Badges</Text>
        <Text style={{ fontSize: 14, color: colors.inkMuted, marginTop: 3 }}>
          {SEED_DRIVE.name} — Recognize your volunteers
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* How it works */}
        <View style={{
          backgroundColor: colors.tealLight, borderRadius: 16, padding: 16,
          borderLeftWidth: 4, borderLeftColor: colors.teal, marginBottom: 24,
        }}>
          <Text style={{ fontSize: 14, color: darkMode ? colors.teal : colors.ink, lineHeight: 20, fontWeight: '500' }}>
            🏅 NGO coordinators manually award badges. These appear on volunteer profiles and cannot be self-earned.
          </Text>
        </View>

        {/* Available Badges */}
        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 12 }}>
          Available Badges
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {BadgeTypes.map((badge) => (
            <Pressable key={badge.id} style={({ pressed }) => ({
              width: 100, backgroundColor: colors.card, borderRadius: 18,
              padding: 14, marginRight: 12, alignItems: 'center',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
              borderWidth: 1, borderColor: colors.glassBorder,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}>
              <View style={{
                width: 48, height: 48, borderRadius: 16,
                backgroundColor: colors.brandLight,
                alignItems: 'center', justifyContent: 'center', marginBottom: 8,
              }}>
                <Text style={{ fontSize: 28 }}>{badge.emoji}</Text>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.ink, textAlign: 'center' }}>
                {badge.name}
              </Text>
              <Text style={{ fontSize: 10, color: colors.inkMuted, marginTop: 3 }}>
                Max: {badge.maxPerDrive}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Volunteers */}
        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 14 }}>
          Volunteers ({volunteers.length})
        </Text>
        {volunteers.map((vol) => (
          <View key={vol.id} style={{
            backgroundColor: colors.card, borderRadius: 20, padding: 16, marginBottom: 12,
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
            borderWidth: 1, borderColor: colors.glassBorder,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{
                width: 44, height: 44, borderRadius: 22, borderWidth: 2,
                borderColor: colors.brand, padding: 2, backgroundColor: colors.card,
              }}>
                <Image source={{ uri: vol.avatar }} style={{ width: 36, height: 36, borderRadius: 18 }} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.ink }}>{vol.name}</Text>
                <Text style={{ fontSize: 12, color: colors.inkMuted, marginTop: 2 }}>
                  {vol.role} • {vol.activeTime.slice(0, 5)} active
                </Text>
              </View>
              <View style={{
                backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
              }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#059669' }}>{vol.tasksDone} tasks</Text>
              </View>
            </View>

            {/* Awarded badges */}
            {awardedBadges[vol.id] && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                {awardedBadges[vol.id].map((badge, i) => {
                  const b = BadgeTypes.find((bt) => bt.name === badge);
                  return (
                    <View key={i} style={{
                      flexDirection: 'row', alignItems: 'center',
                      backgroundColor: colors.brandLight, paddingHorizontal: 10,
                      paddingVertical: 5, borderRadius: 9999,
                    }}>
                      <Text style={{ fontSize: 14 }}>{b?.emoji}</Text>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: colors.brand, marginLeft: 4 }}>
                        {badge}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Badge buttons */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {BadgeTypes.slice(0, 4).map((badge) => {
                  const alreadyAwarded = awardedBadges[vol.id]?.includes(badge.name);
                  return (
                    <Pressable
                      key={badge.id}
                      onPress={() => !alreadyAwarded && awardBadge(vol.id, badge.name)}
                      disabled={alreadyAwarded}
                      style={({ pressed }) => ({
                        paddingHorizontal: 14, height: 38, borderRadius: 12,
                        backgroundColor: alreadyAwarded ? colors.gray100 : colors.card,
                        borderWidth: 1.5, borderColor: alreadyAwarded ? colors.gray200 : colors.brand,
                        alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'row', opacity: alreadyAwarded ? 0.5 : 1,
                        transform: [{ scale: pressed && !alreadyAwarded ? 0.93 : 1 }],
                      })}
                    >
                      <Text style={{ fontSize: 16, marginRight: 5 }}>{badge.emoji}</Text>
                      <Text style={{
                        fontSize: 12, fontWeight: '700',
                        color: alreadyAwarded ? colors.inkMuted : colors.brand,
                      }}>
                        {alreadyAwarded ? '✓' : 'Award'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
