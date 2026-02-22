import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, Image,
  FlatList, RefreshControl, Dimensions, Share, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useFeedStore } from '@/stores/feedStore';
import { useActiveEventStore } from '@/stores/activeEventStore';
import { useNotifStore } from '@/stores/notifStore';
import { Colors } from '@/constants/theme';
import { type FeedPost } from '@/data/seed';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withSequence,
  withRepeat, withTiming, Easing,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

/* ─── GPS Verified Badge ─── */
function VerifiedBadge({ variant }: { variant: 'live' | 'post_event' }) {
  const isLive = variant === 'live';
  const pulseScale = useSharedValue(1);

  // Pulse the dot only for live badges
  React.useEffect(() => {
    if (isLive) {
      pulseScale.value = withRepeat(
        withTiming(1.4, { duration: 750, easing: Easing.inOut(Easing.ease) }),
        -1, // infinite
        true, // reverse
      );
    }
  }, [isLive]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 4,
      alignSelf: 'flex-start',
      backgroundColor: isLive ? '#D1FAE5' : '#FEF3C7',
      paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999,
      marginTop: 4,
    }}>
      <Animated.View style={[{
        width: 6, height: 6, borderRadius: 3,
        backgroundColor: isLive ? '#059669' : '#D97706',
      }, isLive ? dotStyle : undefined]} />
      <Text style={{
        fontSize: 11, fontWeight: '600',
        color: isLive ? '#059669' : '#D97706',
        letterSpacing: 0.2,
      }}>
        {isLive ? 'GPS Verified' : 'Post-Event'}
      </Text>
    </View>
  );
}

/* ─── Post Card — Instagram-grade ─── */
function PostCard({ post, colors, darkMode, onRegister, registeredDrives }: {
  post: FeedPost;
  colors: typeof Colors.light;
  darkMode: boolean;
  onRegister: (driveId: string) => void;
  registeredDrives: string[];
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes ?? 0);
  const heartScale = useSharedValue(1);

  const handleLike = () => {
    heartScale.value = withSequence(
      withSpring(1.4, { damping: 10, stiffness: 180 }),
      withSpring(1.0, { damping: 12, stiffness: 200 }),
    );
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const isDrive = post.type === 'ngo_drive';
  const isRegistered = isDrive && registeredDrives.includes(post.id);

  if (post.type === 'recommendation') {
    return (
      <View style={{
        backgroundColor: colors.tealLight, borderRadius: 16, padding: 16,
        marginBottom: 12,
      }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.teal }}>✨ Matched for You</Text>
        <Text style={{ fontSize: 15, color: colors.ink, marginTop: 8, lineHeight: 22 }}>{post.caption}</Text>
        <Pressable style={({ pressed }) => ({
          marginTop: 12, height: 44, borderRadius: 10,
          backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center',
          transform: [{ scale: pressed ? 0.97 : 1 }],
        })}>
          <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '600' }}>View Drive →</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{
      backgroundColor: colors.card, borderRadius: 16, marginBottom: 12,
      overflow: 'hidden',
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    }}>
      {/* Header Row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, gap: 10 }}>
        <Image
          source={{ uri: post.authorAvatar }}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gray100 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '500', color: colors.ink }}>{post.authorName}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
            {post.driveName && (
              <View style={{
                backgroundColor: colors.brandLight, paddingHorizontal: 8,
                paddingVertical: 2, borderRadius: 999,
              }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: colors.brand }}>
                  #{post.driveName}
                </Text>
              </View>
            )}
            <Text style={{ fontSize: 11, color: colors.inkMuted }}>{post.timestamp}</Text>
          </View>
        </View>
        <Pressable hitSlop={12}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.inkMuted} />
        </Pressable>
      </View>

      {/* Caption */}
      <Text style={{
        fontSize: 15, lineHeight: 22, color: colors.ink,
        paddingHorizontal: 16, paddingBottom: post.imageUrl ? 10 : 0,
      }}>
        {post.caption}
      </Text>

      {/* GPS Verified Badge */}
      {post.verifiedBadge && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <VerifiedBadge variant={post.verifiedBadge} />
        </View>
      )}

      {/* Image — full bleed */}
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          style={{ width: '100%', aspectRatio: 16 / 9 }}
          resizeMode="cover"
        />
      )}

      {/* Action Row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 0 }}>
        <Pressable
          onPress={handleLike}
          hitSlop={10}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginRight: 18 }}
        >
          <Animated.View style={heartStyle}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={24}
              color={liked ? '#DC2626' : colors.inkMuted}
            />
          </Animated.View>
          <Text style={{ fontSize: 13, color: colors.inkMuted, fontWeight: '500' }}>{likeCount}</Text>
        </Pressable>

        <Pressable
          hitSlop={10}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginRight: 18 }}
        >
          <Ionicons name="chatbubble-outline" size={22} color={colors.inkMuted} />
          <Text style={{ fontSize: 13, color: colors.inkMuted, fontWeight: '500' }}>{post.comments ?? 0}</Text>
        </Pressable>

        <Pressable
          onPress={() => Share.share({ message: 'Check out this drive on ActiVibe!' })}
          hitSlop={10}
          style={{ marginLeft: 'auto' }}
        >
          <Ionicons name="arrow-redo-outline" size={22} color={colors.inkMuted} />
        </Pressable>
      </View>

      {/* Register CTA — drive posts only */}
      {isDrive && !isRegistered && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
          <Pressable
            onPress={() => onRegister(post.id)}
            style={({ pressed }) => ({
              height: 44, borderRadius: 10,
              backgroundColor: '#059669', alignItems: 'center', justifyContent: 'center',
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
          >
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#FFFFFF' }}>
              Register for This Drive
            </Text>
          </Pressable>
        </View>
      )}
      {isDrive && isRegistered && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
          <View style={{
            height: 44, borderRadius: 10, backgroundColor: colors.brandLight,
            alignItems: 'center', justifyContent: 'center',
            flexDirection: 'row', gap: 6,
          }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#059669' }}>
              ✓ Registered
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

/* ─── Feed Screen ─── */
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
  const [registeredDrives, setRegisteredDrives] = useState<string[]>([]);
  const [toast, setToast] = useState<{ visible: boolean; message: string; bg: string; fg: string }>({
    visible: false, message: '', bg: '#D1FAE5', fg: '#059669',
  });

  const showToast = (message: string, bg: string, fg: string, duration = 3000) => {
    setToast({ visible: true, message, bg, fg });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), duration);
  };

  const handleRegister = (postId: string) => {
    setRegisteredDrives((prev) => [...prev, postId]);
    showToast('✓ Registration sent! The NGO will confirm shortly.', '#D1FAE5', '#059669');
  };

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

  const tabs: { key: typeof feedTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'drives', label: 'Drives' },
    { key: 'updates', label: 'Updates' },
  ];

  const STORIES = [
    { name: 'Greenpeace', status: 'live' as const },
    { name: 'TeachForIndia', status: 'open' as const },
    { name: 'iVolunteer', status: 'open' as const },
    { name: 'NSS', status: 'open' as const },
    { name: 'Red Cross', status: 'open' as const },
  ];
  const storyColors = ['#059669', '#2563EB', '#DC2626', '#D97706', '#0891B2'];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Nav Bar — Solid */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, height: 52,
        backgroundColor: colors.card,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
      }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#059669', letterSpacing: -0.5 }}>
          ActiVibe
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Pressable onPress={toggleDarkMode} hitSlop={12}>
            <Ionicons name={darkMode ? 'sunny-outline' : 'moon-outline'} size={22} color={colors.inkMuted} />
          </Pressable>
          <Pressable onPress={() => router.push('/(volunteer)/notifications')} hitSlop={12} style={{ position: 'relative' }}>
            <Ionicons name="notifications-outline" size={22} color={colors.inkMuted} />
            {unread > 0 && (
              <View style={{
                position: 'absolute', top: -4, right: -4,
                backgroundColor: '#DC2626', borderRadius: 999,
                minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center',
                paddingHorizontal: 3, borderWidth: 1.5, borderColor: colors.card,
              }}>
                <Text style={{ fontSize: 9, fontWeight: '700', color: '#FFF' }}>
                  {unread > 9 ? '9+' : unread}
                </Text>
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
            paddingHorizontal: 16, paddingVertical: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 8, height: 8, borderRadius: 4,
              backgroundColor: inZone ? '#34D399' : '#FBBF24', marginRight: 8,
            }} />
            <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '600' }}>{activeDrive.driveName}</Text>
          </View>
          <Text style={{
            color: inZone ? '#FFF' : '#FBBF24', fontSize: 13,
            fontFamily: 'Courier', fontWeight: '700',
          }}>
            {formatTimer(timerSeconds)}{!inZone ? ' ⏸' : ''}
          </Text>
        </LinearGradient>
      )}

      {/* Filter Chips */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setFeedTab(tab.key)}
            style={({ pressed }) => ({
              paddingHorizontal: 16, height: 36, borderRadius: 999,
              backgroundColor: feedTab === tab.key ? '#059669' : 'transparent',
              alignItems: 'center', justifyContent: 'center',
              transform: [{ scale: pressed ? 0.95 : 1 }],
              borderWidth: feedTab === tab.key ? 0 : 1,
              borderColor: colors.border,
            })}
          >
            <Text style={{
              fontSize: 13, fontWeight: '600',
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />
        }
        ListHeaderComponent={
          /* Stories Row — Instagram-style */
          <View style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 11, fontWeight: '600', color: colors.inkMuted,
              marginBottom: 10, letterSpacing: 0.8, textTransform: 'uppercase',
            }}>
              DRIVES NEAR YOU
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 14, paddingVertical: 4 }}
            >
              {STORIES.map((ngo, i) => {
                const bgColor = storyColors[i % storyColors.length];
                return (
                  <Pressable
                    key={i}
                    style={({ pressed }) => ({
                      alignItems: 'center', width: 72,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                    })}
                  >
                    {/* Ring */}
                    <View style={{
                      width: 68, height: 68, borderRadius: 34,
                      borderWidth: 2.5,
                      borderColor: ngo.status === 'live' ? '#059669' : colors.border,
                      padding: 2, marginBottom: 6,
                    }}>
                      <View style={{
                        flex: 1, borderRadius: 999,
                        backgroundColor: bgColor,
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: '#FFF' }}>
                          {ngo.name[0]}
                        </Text>
                      </View>
                    </View>
                    <Text numberOfLines={1} style={{
                      fontSize: 11, color: colors.inkLight,
                      textAlign: 'center', width: 68,
                    }}>
                      {ngo.name}
                    </Text>
                    <View style={{
                      marginTop: 3,
                      paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999,
                      backgroundColor: ngo.status === 'live' ? '#059669' : colors.gray100,
                    }}>
                      <Text style={{
                        fontSize: 9, fontWeight: '700',
                        color: ngo.status === 'live' ? '#FFF' : colors.inkMuted,
                        letterSpacing: 0.4,
                      }}>
                        {ngo.status === 'live' ? '● LIVE' : 'OPEN'}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            colors={colors}
            darkMode={darkMode}
            onRegister={handleRegister}
            registeredDrives={registeredDrives}
          />
        )}
      />

      {/* Toast */}
      {toast.visible && (
        <View style={{
          position: 'absolute', bottom: 90, left: 16, right: 16,
          backgroundColor: toast.bg, borderRadius: 12,
          padding: 14, alignItems: 'center',
          shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15, shadowRadius: 8, elevation: 8,
        }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: toast.fg }}>
            {toast.message}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
