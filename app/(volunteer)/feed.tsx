import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, SafeAreaView, Image,
  FlatList, TextInput, Modal, RefreshControl, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useFeedStore } from '@/stores/feedStore';
import { useActiveEventStore } from '@/stores/activeEventStore';
import { useNotifStore } from '@/stores/notifStore';
import { Colors } from '@/constants/theme';
import { type FeedPost } from '@/data/seed';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

function VerifiedBadge({ variant }: { variant: 'live' | 'post_event' }) {
  const isLive = variant === 'live';
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: isLive ? '#D1FAE5' : '#FEF3C7',
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999,
      alignSelf: 'flex-start', marginTop: 4,
    }}>
      <Text style={{ fontSize: 10 }}>✓ </Text>
      <Text style={{
        fontSize: 11, fontWeight: '700',
        color: isLive ? '#059669' : '#D97706',
      }}>
        {isLive ? 'GPS Verified' : 'Post-Event'}
      </Text>
    </View>
  );
}

function PostCard({ post, colors }: { post: FeedPost; colors: typeof Colors.light }) {
  const [liked, setLiked] = useState(false);

  if (post.type === 'recommendation') {
    return (
      <View style={{
        backgroundColor: colors.tealLight, borderRadius: 18, padding: 18,
        marginBottom: 14, borderLeftWidth: 4, borderLeftColor: colors.teal,
      }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.teal }}>✨ Matched for You</Text>
        <Text style={{ fontSize: 14, color: colors.ink, marginTop: 8, lineHeight: 20 }}>{post.caption}</Text>
        <Pressable style={({ pressed }) => ({
          marginTop: 10, height: 38, borderRadius: 12,
          backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center',
          transform: [{ scale: pressed ? 0.96 : 1 }],
        })}>
          <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '700' }}>View Drive →</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{
      backgroundColor: colors.card, borderRadius: 20, marginBottom: 14,
      shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
      overflow: 'hidden', borderWidth: 1, borderColor: colors.border,
    }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
        <View style={{
          width: 46, height: 46, borderRadius: 23, borderWidth: 2,
          borderColor: colors.brand, padding: 2, backgroundColor: colors.card,
        }}>
          <Image
            source={{ uri: post.authorAvatar }}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors.gray100 }}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.ink }}>{post.authorName}</Text>
            {post.ngoName && post.authorRole === 'volunteer' && (
              <Text style={{ fontSize: 13, color: colors.inkMuted }}> at {post.ngoName}</Text>
            )}
          </View>
          {post.driveName && (
            <View style={{
              backgroundColor: colors.brandLight, paddingHorizontal: 8, paddingVertical: 3,
              borderRadius: 8, alignSelf: 'flex-start', marginTop: 3,
            }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.brand }}>#{post.driveName}</Text>
            </View>
          )}
          {post.verifiedBadge && <VerifiedBadge variant={post.verifiedBadge} />}
        </View>
        <Text style={{ fontSize: 11, color: colors.inkMuted }}>{post.timestamp}</Text>
      </View>

      {/* Caption */}
      <Text style={{ fontSize: 15, color: colors.ink, paddingHorizontal: 14, lineHeight: 22, marginBottom: post.imageUrl ? 10 : 0 }}>
        {post.caption}
      </Text>

      {/* Image */}
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          style={{ width: '100%', height: 200, marginTop: 4 }}
          resizeMode="cover"
        />
      )}

      {/* Actions */}
      <View style={{ flexDirection: 'row', padding: 14, gap: 20, alignItems: 'center' }}>
        <Pressable
          onPress={() => setLiked(!liked)}
          style={({ pressed }) => ({
            flexDirection: 'row', alignItems: 'center',
            transform: [{ scale: pressed ? 0.9 : 1 }],
          })}
        >
          <Text style={{ fontSize: 20 }}>{liked ? '❤️' : '🤍'}</Text>
          <Text style={{ fontSize: 13, color: colors.inkMuted, marginLeft: 5, fontWeight: '600' }}>
            {post.likes + (liked ? 1 : 0)}
          </Text>
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 18 }}>💬</Text>
          <Text style={{ fontSize: 13, color: colors.inkMuted, marginLeft: 5, fontWeight: '600' }}>{post.comments}</Text>
        </View>
        <Pressable style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.9 : 1 }] })}>
          <Text style={{ fontSize: 18 }}>↗️</Text>
        </Pressable>
      </View>

      {/* CTA */}
      {post.ctaLabel && (
        <Pressable style={({ pressed }) => ({
          marginHorizontal: 14, marginBottom: 14, height: 42, borderRadius: 14,
          backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center',
          transform: [{ scale: pressed ? 0.96 : 1 }],
        })}>
          <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '700' }}>{post.ctaLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function FeedScreen() {
  const router = useRouter();
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;
  const posts = useFeedStore((s) => s.posts);
  const feedTab = useFeedStore((s) => s.feedTab);
  const setFeedTab = useFeedStore((s) => s.setFeedTab);
  const activeDrive = useActiveEventStore((s) => s.activeDrive);
  const inZone = useActiveEventStore((s) => s.inZone);
  const timerSeconds = useActiveEventStore((s) => s.timerSeconds);
  const unread = useNotifStore((s) => s.unread);
  const toggleDarkMode = useAuthStore((s) => s.toggleDarkMode);
  const [refreshing, setRefreshing] = useState(false);

  const formatTimer = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filteredPosts = feedTab === 'all' ? posts :
    feedTab === 'drives' ? posts.filter((p) => p.type === 'ngo_drive' || p.type === 'recommendation') :
    posts.filter((p) => p.type === 'ngo_update' || p.type === 'volunteer_live' || p.type === 'volunteer_post_event');

  const tabs: { key: typeof feedTab; label: string; emoji: string }[] = [
    { key: 'all', label: 'All', emoji: '📋' },
    { key: 'drives', label: 'Drives', emoji: '📍' },
    { key: 'updates', label: 'Updates', emoji: '📢' },
  ];

  const STORY_SIZE = 68;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Nav Bar */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 14,
        backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 8, height: 8, borderRadius: 4,
            backgroundColor: colors.brand, marginRight: 6,
          }} />
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.brand, letterSpacing: -0.5 }}>
            ActiVibe
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
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
          <Pressable
            onPress={() => router.push('/(volunteer)/notifications')}
            style={({ pressed }) => ({
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center',
              transform: [{ scale: pressed ? 0.9 : 1 }],
            })}
          >
            <Text style={{ fontSize: 18 }}>🔔</Text>
            {unread > 0 && (
              <View style={{
                position: 'absolute', top: -2, right: -2,
                backgroundColor: '#DC2626', borderRadius: 10,
                minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center',
                borderWidth: 2, borderColor: colors.card,
              }}>
                <Text style={{ color: '#FFF', fontSize: 9, fontWeight: '800' }}>{unread}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Active Drive Banner */}
      {activeDrive && (
        <LinearGradient
          colors={['#059669', '#10B981']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            paddingHorizontal: 20, paddingVertical: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 8, height: 8, borderRadius: 4,
              backgroundColor: inZone ? '#34D399' : '#FBBF24', marginRight: 8,
            }} />
            <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '700' }}>{activeDrive.driveName}</Text>
          </View>
          <Text style={{
            color: inZone ? '#FFF' : '#FBBF24', fontSize: 15,
            fontFamily: 'monospace', fontWeight: '700',
          }}>
            {formatTimer(timerSeconds)}{!inZone ? ' ⏸' : ''}
          </Text>
        </LinearGradient>
      )}

      {/* Filter Chips */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 10 }}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setFeedTab(tab.key)}
            style={({ pressed }) => ({
              paddingHorizontal: 18, height: 38, borderRadius: 9999,
              backgroundColor: feedTab === tab.key ? colors.brand : colors.gray100,
              alignItems: 'center', justifyContent: 'center',
              flexDirection: 'row',
              transform: [{ scale: pressed ? 0.95 : 1 }],
              shadowColor: feedTab === tab.key ? colors.brand : 'transparent',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: feedTab === tab.key ? 0.3 : 0,
              shadowRadius: 6,
              borderWidth: feedTab === tab.key ? 0 : 1,
              borderColor: colors.border,
            })}
          >
            <Text style={{ fontSize: 13, marginRight: 4 }}>{tab.emoji}</Text>
            <Text style={{
              fontSize: 13, fontWeight: '700',
              color: feedTab === tab.key ? '#FFF' : colors.inkMuted,
            }}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />
        }
        ListHeaderComponent={
          /* Stories Row */
          <View style={{ marginBottom: 18 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.inkMuted, marginBottom: 10, letterSpacing: 0.5 }}>
              DRIVES NEAR YOU
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Greenpeace', 'TeachForIndia', 'iVolunteer', 'NSS', 'Red Cross'].map((name, i) => (
                <Pressable
                  key={i}
                  style={({ pressed }) => ({
                    alignItems: 'center', marginRight: 16,
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  })}
                >
                  <LinearGradient
                    colors={i === 0 ? ['#059669', '#34D399'] : [colors.border, colors.border]}
                    style={{
                      width: STORY_SIZE + 4, height: STORY_SIZE + 4, borderRadius: (STORY_SIZE + 4) / 2,
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <View style={{
                      width: STORY_SIZE, height: STORY_SIZE, borderRadius: STORY_SIZE / 2,
                      borderWidth: 2, borderColor: colors.card,
                      overflow: 'hidden', backgroundColor: colors.card,
                    }}>
                      <Image
                        source={{ uri: `https://api.dicebear.com/7.x/identicon/png?seed=${name}` }}
                        style={{ width: STORY_SIZE - 4, height: STORY_SIZE - 4, borderRadius: (STORY_SIZE - 4) / 2 }}
                      />
                    </View>
                  </LinearGradient>
                  <Text style={{ fontSize: 11, color: colors.ink, marginTop: 6, textAlign: 'center', fontWeight: '500' }}>
                    {name.length > 10 ? name.slice(0, 9) + '…' : name}
                  </Text>
                  <View style={{
                    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
                    backgroundColor: i === 0 ? '#059669' : colors.gray100, marginTop: 3,
                  }}>
                    <Text style={{ fontSize: 9, fontWeight: '800', color: i === 0 ? '#FFF' : colors.inkMuted }}>
                      {i === 0 ? '🔴 LIVE' : 'OPEN'}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => <PostCard post={item} colors={colors} />}
      />
    </SafeAreaView>
  );
}
