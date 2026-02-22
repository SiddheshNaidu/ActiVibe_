import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Pressable, Animated, Dimensions, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useActiveEventStore } from '@/stores/activeEventStore';
import { useFeedStore } from '@/stores/feedStore';
import { Colors } from '@/constants/theme';
import { SEED_DRIVE } from '@/data/seed';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height: screenHeight } = Dimensions.get('window');

export default function MapScreen() {
  const router = useRouter();
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;
  
  const activeDrive = useActiveEventStore((s) => s.activeDrive);
  const inZone = useActiveEventStore((s) => s.inZone);
  const timerSeconds = useActiveEventStore((s) => s.timerSeconds);
  const postCount = useActiveEventStore((s) => s.postCount);
  const postLimit = useActiveEventStore((s) => s.postLimit);
  const isEventEnded = useActiveEventStore((s) => s.isEventEnded);
  const simulateEntry = useActiveEventStore((s) => s.simulateEntry);
  const simulateExit = useActiveEventStore((s) => s.simulateExit);
  const simulatePost = useActiveEventStore((s) => s.simulatePost);
  const endEvent = useActiveEventStore((s) => s.endEvent);
  const checkout = useActiveEventStore((s) => s.checkout);
  const incrementTimer = useActiveEventStore((s) => s.incrementTimer);
  const addPost = useFeedStore((s) => s.addPost);

  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationFade = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const celebrationFired = useRef(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const userDotPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => { incrementTimer(); }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 1250, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1250, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(userDotPulse, { toValue: 1.4, duration: 1500, useNativeDriver: true }),
        Animated.timing(userDotPulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const formatTimer = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const handleSimulateEntry = () => {
    simulateEntry();
    if (!celebrationFired.current) {
      celebrationFired.current = true;
      setShowCelebration(true);
      Animated.parallel([
        Animated.timing(celebrationFade, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(checkScale, { toValue: 1, damping: 10, stiffness: 120, useNativeDriver: true }),
      ]).start();
      setTimeout(() => {
        Animated.timing(celebrationFade, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
          setShowCelebration(false);
          checkScale.setValue(0);
        });
      }, 3500);
    }
  };

  const handleSimulatePost = () => {
    simulatePost();
    addPost({
      id: `post-dev-${Date.now()}`,
      type: 'volunteer_live',
      authorName: 'You',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=You',
      authorRole: 'volunteer',
      driveName: SEED_DRIVE.name,
      ngoName: SEED_DRIVE.ngoName,
      caption: 'Loving this drive! 🌊 Making a real difference today.',
      likes: 0, comments: 0,
      verifiedBadge: 'live',
      timestamp: 'Just now',
    });
  };

  const handleEndEvent = () => {
    endEvent();
    celebrationFired.current = false;
  };

  const handleCheckout = () => {
    checkout();
    celebrationFired.current = false;
    router.push('/(shared)/performance-card');
  };

  const getStatus = () => {
    if (isEventEnded) return 'ended';
    if (activeDrive && inZone) return 'checked-in';
    if (activeDrive && !inZone) return 'left-zone';
    return 'outside';
  };
  const status = getStatus();

  const DevButton = ({ onPress, label, emoji, bgColor, textColor }: any) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 16, height: 44, borderRadius: 22,
        backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center',
        flexDirection: 'row',
        transform: [{ scale: pressed ? 0.93 : 1 }],
        shadowColor: bgColor, shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
      })}
    >
      <Text style={{ fontSize: 14, marginRight: 6 }}>{emoji}</Text>
      <Text style={{ fontSize: 13, fontWeight: '700', color: textColor }}>{label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Styled Map Area */}
      <View style={{ flex: 1, backgroundColor: '#f0f4f0' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {/* Styled map background — roads, parks, water */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            {/* Water feature */}
            <View style={{
              position: 'absolute', top: '5%', right: '-10%',
              width: 220, height: 160, borderRadius: 80,
              backgroundColor: '#c8dce8', opacity: 0.7,
              transform: [{ rotate: '-15deg' }],
            }} />
            {/* Park areas */}
            <View style={{
              position: 'absolute', bottom: '25%', left: '5%',
              width: 140, height: 100, borderRadius: 20,
              backgroundColor: '#d8edd8', opacity: 0.8,
            }} />
            <View style={{
              position: 'absolute', top: '15%', left: '15%',
              width: 80, height: 60, borderRadius: 14,
              backgroundColor: '#d8edd8', opacity: 0.6,
            }} />
            {/* Roads */}
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={`h-${i}`} style={{
                position: 'absolute', top: i * 100 + 40, left: 0, right: 0,
                height: i % 2 === 0 ? 3 : 2,
                backgroundColor: i % 2 === 0 ? '#e8e8f0' : '#FFFFFF',
                opacity: 0.9,
              }} />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <View key={`v-${i}`} style={{
                position: 'absolute', left: i * (width / 4) + 30, top: 0, bottom: 0,
                width: i % 2 === 0 ? 3 : 2,
                backgroundColor: i % 2 === 0 ? '#e8e8f0' : '#FFFFFF',
                opacity: 0.8,
              }} />
            ))}
          </View>

          {/* Geofence Circle */}
          <Animated.View style={{
            width: 200, height: 200, borderRadius: 100,
            backgroundColor: 'rgba(5, 150, 105, 0.08)',
            borderWidth: 2, borderColor: 'rgba(5, 150, 105, 0.3)',
            borderStyle: 'dashed',
            alignItems: 'center', justifyContent: 'center',
            transform: [{ scale: pulseAnim }],
          }}>
            <Animated.View style={{
              position: 'absolute', width: 220, height: 220, borderRadius: 110,
              backgroundColor: 'rgba(5, 150, 105, 0.04)',
              borderWidth: 1, borderColor: 'rgba(5, 150, 105, 0.12)',
            }} />
            <View style={{
              width: 52, height: 52, borderRadius: 26,
              backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center',
              shadowColor: colors.brand, shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4, shadowRadius: 12,
            }}>
              <Text style={{ fontSize: 24 }}>🏖️</Text>
            </View>
            <Text style={{ fontSize: 12, color: colors.ink, fontWeight: '700', marginTop: 6 }}>
              {SEED_DRIVE.name.split(' ').slice(0, 2).join(' ')}
            </Text>
          </Animated.View>

          {/* User Location Dot — always visible */}
          <Animated.View style={{
            position: 'absolute',
            top: status === 'checked-in' ? '48%' : status === 'left-zone' ? '30%' : '68%',
            left: status === 'checked-in' ? '52%' : status === 'left-zone' ? '25%' : '60%',
            transform: [{ scale: userDotPulse }],
          }}>
            <View style={{
              width: 22, height: 22, borderRadius: 11,
              backgroundColor: '#2563EB', borderWidth: 3, borderColor: '#FFF',
              shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.6, shadowRadius: 6, elevation: 5,
            }} />
          </Animated.View>

          {/* Distance Label */}
          {status === 'outside' && (
            <View style={{
              position: 'absolute', bottom: '30%',
              backgroundColor: darkMode ? 'rgba(30,30,50,0.9)' : 'rgba(255,255,255,0.95)',
              paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
              flexDirection: 'row', alignItems: 'center',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1, shadowRadius: 8,
            }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#D97706', marginRight: 8 }} />
              <Text style={{ fontSize: 13, color: colors.ink, fontWeight: '600' }}>~250m from check-in zone</Text>
            </View>
          )}
        </View>

        {/* DEV Mode Banner */}
        <View style={{
          backgroundColor: '#FEF3C7', paddingHorizontal: 16, paddingVertical: 8,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
          borderTopWidth: 1, borderTopColor: '#FDE68A',
        }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#92400E' }}>
            🧪 DEV MODE — GPS Simulation Active
          </Text>
        </View>
      </View>

      {/* Status Card */}
      <View style={{
        backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28,
        paddingHorizontal: 20, paddingTop: 16, paddingBottom: 34,
        shadowColor: '#000', shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.1, shadowRadius: 24,
        borderWidth: 1, borderBottomWidth: 0, borderColor: colors.glassBorder,
      }}>
        <View style={{
          width: 36, height: 4, borderRadius: 2,
          backgroundColor: colors.gray200, alignSelf: 'center', marginBottom: 16,
        }} />

        {/* Status indicator */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{
            width: 12, height: 12, borderRadius: 6, marginRight: 10,
            backgroundColor: status === 'checked-in' ? '#059669' :
              status === 'left-zone' || status === 'ended' ? '#D97706' : '#9CA3AF',
            shadowColor: status === 'checked-in' ? '#059669' : '#D97706',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6, shadowRadius: 4,
          }} />
          <Text style={{ fontSize: 17, fontWeight: '800', color: 
            status === 'checked-in' ? '#059669' :
            status === 'left-zone' ? '#D97706' :
            status === 'ended' ? '#D97706' : colors.ink,
          }}>
            {status === 'checked-in' ? 'Checked In ✓' :
             status === 'left-zone' ? 'Outside Zone — Paused' :
             status === 'ended' ? 'Event Ended' :
             'Outside Check-In Zone'}
          </Text>
        </View>

        {/* Timer */}
        {activeDrive && (
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 }}>
            <Text style={{
              fontSize: 32, fontWeight: '800', fontFamily: 'monospace',
              color: inZone ? '#059669' : '#D97706',
            }}>
              {formatTimer(timerSeconds)}
            </Text>
            {!inZone && activeDrive && (
              <Text style={{ fontSize: 13, color: '#D97706', marginLeft: 8, fontStyle: 'italic' }}>(paused)</Text>
            )}
          </View>
        )}

        {/* Post count */}
        {activeDrive && inZone && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 13, marginRight: 6 }}>📷</Text>
            <View style={{ flex: 1, height: 6, backgroundColor: colors.gray100, borderRadius: 3, marginRight: 8 }}>
              <View style={{
                width: `${(postCount / postLimit) * 100}%`, height: 6,
                backgroundColor: colors.brand, borderRadius: 3,
              }} />
            </View>
            <Text style={{ fontSize: 12, color: colors.inkMuted, fontWeight: '600' }}>
              {postCount}/{postLimit}
            </Text>
          </View>
        )}

        {/* Contextual message */}
        <Text style={{ fontSize: 13, color: colors.inkMuted, fontStyle: 'italic', marginBottom: 14, lineHeight: 18 }}>
          {status === 'checked-in' ? 'Camera unlocked. Your time is being tracked automatically.' :
           status === 'left-zone' ? "You've left the drive zone — active time is paused. Return to resume." :
           status === 'ended' ? 'Event ended. Check out and post about your experience.' :
           'Check-in is automatic — walk into the zone to start.'}
        </Text>

        {/* DEV Buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {!activeDrive && (
              <Pressable
                onPress={handleSimulateEntry}
                style={({ pressed }) => ({
                  height: 48, borderRadius: 12, borderWidth: 2, borderColor: '#059669',
                  alignItems: 'center', justifyContent: 'center',
                  flex: 1,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                })}
              >
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#059669' }}>
                  📍 Simulate Entry (DEV)
                </Text>
              </Pressable>
            )}

            {activeDrive && inZone && (
              <>
                <DevButton onPress={() => simulateExit()} label="Exit Zone" emoji="🚶" bgColor="#FEF3C7" textColor="#92400E" />
                {postCount < postLimit && (
                  <DevButton onPress={handleSimulatePost} label="Post" emoji="📸" bgColor="#D1FAE5" textColor="#059669" />
                )}
                <DevButton onPress={handleEndEvent} label="End Event" emoji="⏹️" bgColor="#FEE2E2" textColor="#DC2626" />
              </>
            )}

            {activeDrive && !inZone && !isEventEnded && (
              <DevButton onPress={handleSimulateEntry} label="Re-Enter" emoji="📍" bgColor="#D1FAE5" textColor="#059669" />
            )}

            {isEventEnded && postCount < postLimit && (
              <DevButton
                onPress={() => {
                  simulatePost();
                  addPost({
                    id: `post-pe-${Date.now()}`,
                    type: 'volunteer_post_event',
                    authorName: 'You',
                    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=You',
                    authorRole: 'volunteer',
                    driveName: SEED_DRIVE.name, ngoName: SEED_DRIVE.ngoName,
                    caption: 'Just wrapped up an amazing drive! 🌿✨',
                    likes: 0, comments: 0, verifiedBadge: 'post_event', timestamp: 'Just now',
                  });
                }}
                label="Post About Event" emoji="📝" bgColor="#FEF3C7" textColor="#92400E"
              />
            )}
          </View>
        </ScrollView>

        {/* Checkout Button */}
        {activeDrive && (
          <Pressable
            onPress={handleCheckout}
            style={({ pressed }) => ({
              height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
              borderWidth: 2, borderColor: '#DC2626',
              backgroundColor: 'rgba(220, 38, 38, 0.06)',
              transform: [{ scale: pressed ? 0.96 : 1 }], marginTop: 4,
            })}
          >
            <Text style={{ color: '#DC2626', fontSize: 16, fontWeight: '700' }}>End My Shift</Text>
          </Pressable>
        )}
      </View>

      {/* Celebration Overlay */}
      {showCelebration && (
        <Pressable
          onPress={() => {
            Animated.timing(celebrationFade, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
              setShowCelebration(false);
              checkScale.setValue(0);
            });
          }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Animated.View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: darkMode ? 'rgba(15,14,23,0.95)' : 'rgba(255,255,255,0.95)',
            opacity: celebrationFade,
          }} />
          <Animated.View style={{
            alignItems: 'center', opacity: celebrationFade,
            transform: [{ scale: checkScale }],
          }}>
            <Text style={{ fontSize: 72 }}>✅</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#059669', marginTop: 16 }}>
              You're In!
            </Text>
            <Text style={{ fontSize: 17, color: colors.ink, marginTop: 8 }}>
              {SEED_DRIVE.name}
            </Text>
            <Text style={{ fontSize: 15, color: colors.inkMuted, marginTop: 4, textAlign: 'center' }}>
              Your time is now being{'\n'}tracked automatically.
            </Text>
            <Text style={{ fontSize: 32, marginTop: 20 }}>🎉🎊🎉</Text>
          </Animated.View>
        </Pressable>
      )}
    </SafeAreaView>
  );
}
