import React from 'react';
import {
  View, Text, ScrollView, SafeAreaView, Pressable, Image, Dimensions,
} from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import { useFeedStore } from '@/stores/feedStore';
import { Colors } from '@/constants/theme';
import { SEED_NGO_KPIS } from '@/data/seed';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const KPI_WIDTH = (width - 52) / 2;

export default function NGOFeedScreen() {
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;
  const posts = useFeedStore((s) => s.posts);
  const toggleDarkMode = useAuthStore((s) => s.toggleDarkMode);

  const kpis = [
    { label: 'Active Drives', value: SEED_NGO_KPIS.activeDrives, emoji: '🎯', gradient: ['#059669', '#10B981'] as const },
    { label: 'Volunteers', value: SEED_NGO_KPIS.totalVolunteers, emoji: '👥', gradient: ['#3B82F6', '#60A5FA'] as const },
    { label: 'Check-In Rate', value: `${SEED_NGO_KPIS.avgCheckinRate}%`, emoji: '📍', gradient: ['#059669', '#34D399'] as const },
    { label: 'Endorsed', value: SEED_NGO_KPIS.endorsementsAwarded, emoji: '⭐', gradient: ['#F59E0B', '#FBBF24'] as const },
  ];

  const ngoPostsOnly = posts.filter((p) => p.authorRole === 'ngo' || p.type === 'volunteer_live');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Nav */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 14,
        backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand, marginRight: 6 }} />
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.brand, letterSpacing: -0.5 }}>ActiVibe</Text>
        </View>
        <Pressable
          onPress={toggleDarkMode}
          style={({ pressed }) => ({
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center',
            transform: [{ scale: pressed ? 0.9 : 1 }],
          })}
        >
          <Text style={{ fontSize: 16 }}>{darkMode ? '☀️' : '🌙'}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Welcome */}
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.ink, marginBottom: 4 }}>
          Welcome, Greenpeace 👋
        </Text>
        <Text style={{ fontSize: 15, color: colors.inkMuted, marginBottom: 20 }}>
          Here's your organisation dashboard.
        </Text>

        {/* KPI Cards — 2x2 Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          {kpis.map((kpi, i) => (
            <View key={i} style={{
              width: KPI_WIDTH, backgroundColor: colors.card, borderRadius: 20,
              padding: 18, overflow: 'hidden',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
              borderWidth: 1, borderColor: colors.border,
            }}>
              <View style={{
                width: 40, height: 40, borderRadius: 12,
                backgroundColor: `${kpi.gradient[0]}15`,
                alignItems: 'center', justifyContent: 'center', marginBottom: 10,
              }}>
                <Text style={{ fontSize: 20 }}>{kpi.emoji}</Text>
              </View>
              <Text style={{ fontSize: 28, fontWeight: '800', color: kpi.gradient[0] }}>
                {kpi.value}
              </Text>
              <Text style={{ fontSize: 12, color: colors.inkMuted, marginTop: 4, fontWeight: '500' }}>{kpi.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 14 }}>
          Recent Activity
        </Text>
        {ngoPostsOnly.slice(0, 4).map((post) => (
          <View key={post.id} style={{
            backgroundColor: colors.card, borderRadius: 18, padding: 16, marginBottom: 12,
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
            borderWidth: 1, borderColor: colors.border,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 40, height: 40, borderRadius: 20, borderWidth: 2,
                borderColor: colors.brand, padding: 2, backgroundColor: colors.card,
              }}>
                <Image
                  source={{ uri: post.authorAvatar }}
                  style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.gray100 }}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>{post.authorName}</Text>
                <Text style={{ fontSize: 11, color: colors.inkMuted }}>{post.timestamp}</Text>
              </View>
              {post.verifiedBadge && (
                <View style={{
                  backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999,
                }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#059669' }}>✓ Verified</Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: 13, color: colors.inkLight, marginTop: 10, lineHeight: 19 }} numberOfLines={2}>
              {post.caption}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
