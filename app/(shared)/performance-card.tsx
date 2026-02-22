import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Animated, Dimensions, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/theme';
import { SEED_VOLUNTEER, SEED_ENDORSEMENTS, SEED_DRIVE } from '@/data/seed';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function PerformanceCardScreen() {
  const router = useRouter();
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;
  const vol = SEED_VOLUNTEER;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideUp = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, damping: 12, stiffness: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🌟 ${vol.name} — ActiVibe Performance Card\n\n` +
          `✅ ${vol.totalActiveHours} GPS-verified hours\n` +
          `🏅 ${vol.endorsementCount} endorsements\n` +
          `📊 ${vol.drivesCompleted} drives completed\n\n` +
          `#ActiVibe #VerifiedVolunteer`,
      });
    } catch (e) {}
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#0F0E17' }}>
      {/* Close button */}
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => ({
          position: 'absolute', top: 52, right: 16, zIndex: 10,
          width: 40, height: 40, borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.15)',
          alignItems: 'center', justifyContent: 'center',
          transform: [{ scale: pressed ? 0.9 : 1 }],
        })}
      >
        <Text style={{ fontSize: 18, color: '#FFF' }}>✕</Text>
      </Pressable>

      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 60, paddingBottom: 100 }}>
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: slideUp }],
        }}>
          {/* The Card */}
          <View style={{
            width: width - 48, borderRadius: 28, overflow: 'hidden',
            shadowColor: '#059669', shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.35, shadowRadius: 32,
          }}>
            {/* Top gradient */}
            <LinearGradient
              colors={['#059669', '#047857']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ paddingTop: 32, paddingBottom: 24, alignItems: 'center' }}
            >
              {/* Verified badge */}
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.2)',
                paddingHorizontal: 14, paddingVertical: 5, borderRadius: 9999,
                marginBottom: 18,
              }}>
                <Text style={{ fontSize: 13 }}>🛡️ </Text>
                <Text style={{ fontSize: 12, color: '#FFF', fontWeight: '700' }}>ActiVibe Verified</Text>
              </View>

              {/* Avatar */}
              <View style={{
                width: 88, height: 88, borderRadius: 44,
                borderWidth: 4, borderColor: 'rgba(255,255,255,0.35)',
                backgroundColor: '#FFF', overflow: 'hidden',
                marginBottom: 14,
                shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2, shadowRadius: 8,
              }}>
                <Animated.Image
                  source={{ uri: vol.avatarUrl }}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                />
              </View>

              <Text style={{ fontSize: 26, fontWeight: '800', color: '#FFF' }}>{vol.name}</Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>
                📍 {vol.location}
              </Text>
            </LinearGradient>

            {/* Stats section */}
            <View style={{ backgroundColor: '#FFF', paddingVertical: 28 }}>
              {/* Primary stat */}
              <View style={{ alignItems: 'center', marginBottom: 28 }}>
                <Text style={{ fontSize: 52, fontWeight: '800', color: '#059669' }}>
                  {vol.totalActiveHours}
                </Text>
                <Text style={{ fontSize: 15, color: '#7B78A0', fontWeight: '600' }}>
                  GPS-Verified Active Hours
                </Text>
                <Text style={{ fontSize: 11, color: '#9CA3AF', fontStyle: 'italic', marginTop: 3 }}>
                  (In-zone presence only)
                </Text>
              </View>

              {/* Three column stats */}
              <View style={{ flexDirection: 'row', paddingHorizontal: 24, marginBottom: 24 }}>
                {[
                  { emoji: '📊', value: vol.drivesCompleted, label: 'Drives' },
                  { emoji: '🏅', value: vol.endorsementCount, label: 'Endorsed' },
                  { emoji: '⭐', value: '4.8', label: 'Rating' },
                ].map((stat, i) => (
                  <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{
                      width: 40, height: 40, borderRadius: 14,
                      backgroundColor: '#F0FDF4',
                      alignItems: 'center', justifyContent: 'center', marginBottom: 6,
                    }}>
                      <Text style={{ fontSize: 18 }}>{stat.emoji}</Text>
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: '#0F0E17' }}>
                      {stat.value}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#7B78A0', fontWeight: '500' }}>{stat.label}</Text>
                  </View>
                ))}
              </View>

              <View style={{ height: 1, backgroundColor: '#E4E4F0', marginHorizontal: 24 }} />

              {/* Badges */}
              <View style={{ paddingHorizontal: 24, marginTop: 22 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#3D3A54', marginBottom: 10 }}>
                  Earned Badges
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {SEED_ENDORSEMENTS.map((end) => (
                    <View key={end.id} style={{
                      flexDirection: 'row', alignItems: 'center',
                      backgroundColor: '#F0FDF4', paddingHorizontal: 14,
                      paddingVertical: 7, borderRadius: 9999,
                      borderWidth: 1, borderColor: '#D1FAE5',
                    }}>
                      <Text style={{ fontSize: 16, marginRight: 5 }}>{end.emoji}</Text>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#059669' }}>{end.badgeName}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Skills */}
              <View style={{ paddingHorizontal: 24, marginTop: 18 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#3D3A54', marginBottom: 10 }}>
                  Verified Skills
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {vol.skills?.map((skill, i) => (
                    <View key={i} style={{
                      paddingHorizontal: 12, paddingVertical: 5, borderRadius: 9999,
                      backgroundColor: skill.tier === 'endorsed' ? '#059669' : '#D1FAE5',
                    }}>
                      <Text style={{
                        fontSize: 11, fontWeight: '700',
                        color: skill.tier === 'endorsed' ? '#FFF' : '#059669',
                      }}>
                        {skill.category} {skill.tier === 'endorsed' ? '✓' : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Footer watermark */}
              <View style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                marginTop: 28, paddingTop: 18,
                borderTopWidth: 1, borderTopColor: '#E4E4F0',
              }}>
                <View style={{
                  width: 8, height: 8, borderRadius: 4, backgroundColor: '#059669', marginRight: 6,
                }} />
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#0F0E17', letterSpacing: -0.3 }}>
                  ActiVibe
                </Text>
                <Text style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 8, fontWeight: '500' }}>Verified Impact</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* CTA Buttons */}
        <Animated.View style={{ marginTop: 32, opacity: fadeAnim, width: width - 48 }}>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => ({
              borderRadius: 22, overflow: 'hidden',
              transform: [{ scale: pressed ? 0.96 : 1 }],
              shadowColor: '#059669', shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3, shadowRadius: 12,
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
              <Text style={{ fontSize: 18, marginRight: 8 }}>📤</Text>
              <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700' }}>Share Card</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(volunteer)/feed')}
            style={({ pressed }) => ({
              height: 52, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
              borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)', marginTop: 14,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: '600' }}>
              Back to Feed
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
