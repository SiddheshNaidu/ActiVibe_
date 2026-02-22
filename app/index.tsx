import React, { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, Pressable, Animated, Dimensions,
  SafeAreaView, useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

const FEATURE_CARDS = [
  { emoji: '📍', title: 'GPS Auto Check-In', subtitle: 'No manual attendance. Walk in, get verified.', gradient: ['#059669', '#047857'] as const },
  { emoji: '📊', title: 'Live Reports', subtitle: 'Engagement analytics. Zero spreadsheets.', gradient: ['#10B981', '#059669'] as const },
  { emoji: '🏅', title: 'Verified Hours', subtitle: 'GPS-proven record. On your profile forever.', gradient: ['#34D399', '#10B981'] as const },
];

const STEPS = [
  { num: '1', text: 'NGO posts a drive' },
  { num: '2', text: 'Volunteer GPS auto check-in' },
  { num: '3', text: 'Hours logged, reports generated' },
];

export default function SplashScreen() {
  const router = useRouter();
  const darkMode = useAuthStore((s) => s.darkMode);
  const toggleDarkMode = useAuthStore((s) => s.toggleDarkMode);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const blob1 = useRef(new Animated.Value(0)).current;
  const blob2 = useRef(new Animated.Value(0)).current;
  const btnSlide = useRef(new Animated.Value(40)).current;
  const btnFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    // Buttons entrance with delay
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.spring(btnSlide, { toValue: 0, damping: 14, stiffness: 100, useNativeDriver: true }),
        Animated.timing(btnFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blob1, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(blob1, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(blob2, { toValue: 1, duration: 5000, useNativeDriver: true }),
        Animated.timing(blob2, { toValue: 0, duration: 5000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const blob1TranslateX = blob1.interpolate({ inputRange: [0, 1], outputRange: [-30, 30] });
  const blob1TranslateY = blob1.interpolate({ inputRange: [0, 1], outputRange: [-20, 20] });
  const blob2TranslateX = blob2.interpolate({ inputRange: [0, 1], outputRange: [20, -20] });
  const blob2TranslateY = blob2.interpolate({ inputRange: [0, 1], outputRange: [15, -25] });

  return (
    <View style={{ flex: 1, backgroundColor: '#0F0E17' }}>
      {/* Animated blob backgrounds */}
      <Animated.View
        style={{
          position: 'absolute', top: 60, left: -40,
          width: 200, height: 200, borderRadius: 100,
          backgroundColor: 'rgba(5, 150, 105, 0.15)',
          transform: [{ translateX: blob1TranslateX }, { translateY: blob1TranslateY }],
        }}
      />
      <Animated.View
        style={{
          position: 'absolute', top: 200, right: -60,
          width: 260, height: 260, borderRadius: 130,
          backgroundColor: 'rgba(16, 185, 129, 0.10)',
          transform: [{ translateX: blob2TranslateX }, { translateY: blob2TranslateY }],
        }}
      />
      <Animated.View
        style={{
          position: 'absolute', bottom: 100, left: 30,
          width: 180, height: 180, borderRadius: 90,
          backgroundColor: 'rgba(52, 211, 153, 0.08)',
          transform: [{ translateX: blob2TranslateX }, { translateY: blob1TranslateY }],
        }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Dark mode toggle */}
        <Pressable
          onPress={toggleDarkMode}
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 10,
            backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14,
            paddingHorizontal: 12, paddingVertical: 6,
          }}
        >
          <Text style={{ fontSize: 18 }}>{darkMode ? '☀️' : '🌙'}</Text>
        </Pressable>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Wordmark */}
          <Animated.View
            style={{
              alignItems: 'center', marginTop: 50,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Animated.View
                style={{
                  width: 12, height: 12, borderRadius: 6,
                  backgroundColor: '#10B981', marginRight: 8,
                  transform: [{ scale: pulseAnim }],
                  shadowColor: '#10B981', shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8, shadowRadius: 8,
                }}
              />
              <Text style={{ fontSize: 38, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1 }}>
                ActiVibe
              </Text>
            </View>

            {/* Hero Headline */}
            <Text style={{
              fontSize: 30, fontWeight: '800', color: '#FFFFFF',
              textAlign: 'center', marginTop: 24, lineHeight: 38,
            }}>
              Where action{'\n'}meets community.
            </Text>

            <Text style={{
              fontSize: 15, color: '#9090B8', textAlign: 'center',
              marginTop: 12, lineHeight: 22, maxWidth: 300,
            }}>
              GPS-verified volunteering. Real hours.{'\n'}Real impact. Real connections.
            </Text>
          </Animated.View>

          {/* Value Props */}
          <Animated.View style={{ marginTop: 32, opacity: fadeAnim }}>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: 20, padding: 20, marginBottom: 8,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
            }}>
              <Text style={{ fontSize: 12, color: '#10B981', fontWeight: '700', marginBottom: 14, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                How ActiVibe Connects
              </Text>

              {[
                { emoji: '🤝', title: 'Bridge the Gap', desc: 'NGOs post drives, volunteers discover & join with one tap. No phone calls, no forms.' },
                { emoji: '✅', title: 'Prove Real Impact', desc: 'GPS tracks actual presence, not just sign-ups. Every hour is verified and permanent.' },
                { emoji: '🌟', title: 'Earn Recognition', desc: 'Build a verified portfolio with NGO endorsements. Share your impact story anywhere.' },
              ].map((item, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: i < 2 ? 18 : 0 }}>
                  <View style={{
                    width: 44, height: 44, borderRadius: 14,
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    alignItems: 'center', justifyContent: 'center', marginRight: 14,
                    borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)',
                  }}>
                    <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>{item.title}</Text>
                    <Text style={{ color: '#9090B8', fontSize: 13, marginTop: 3, lineHeight: 18 }}>
                      {item.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Feature Cards */}
          <Animated.View style={{ marginTop: 20, opacity: fadeAnim }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + 12}
              decelerationRate="fast"
              contentContainerStyle={{ paddingRight: 24 }}
            >
              {FEATURE_CARDS.map((card, i) => (
                <LinearGradient
                  key={i}
                  colors={[card.gradient[0], card.gradient[1]]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={{
                    width: CARD_WIDTH, height: 140,
                    borderRadius: 20, padding: 20, marginRight: 12,
                  }}
                >
                  <Text style={{ fontSize: 30, marginBottom: 8 }}>{card.emoji}</Text>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFF' }}>{card.title}</Text>
                  <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>{card.subtitle}</Text>
                </LinearGradient>
              ))}
            </ScrollView>
          </Animated.View>

          {/* How It Works */}
          <Animated.View style={{ marginTop: 28, opacity: fadeAnim }}>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderRadius: 16, padding: 20,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
            }}>
              <Text style={{ fontSize: 12, color: '#10B981', fontWeight: '700', marginBottom: 16, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                How It Works
              </Text>
              {STEPS.map((step, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: i < 2 ? 16 : 0 }}>
                  <LinearGradient
                    colors={['#059669', '#10B981']}
                    style={{
                      width: 34, height: 34, borderRadius: 17,
                      alignItems: 'center', justifyContent: 'center',
                      marginRight: 14,
                    }}
                  >
                    <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 14 }}>{step.num}</Text>
                  </LinearGradient>
                  <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '500', flex: 1 }}>{step.text}</Text>
                  {i < 2 && <Text style={{ color: '#4B5563', fontSize: 18, marginLeft: 8 }}>→</Text>}
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ===== CTA BUTTONS — Inline at bottom of scroll ===== */}
          <Animated.View style={{
            marginTop: 36,
            opacity: btnFade,
            transform: [{ translateY: btnSlide }],
          }}>
            {/* Primary — I'm a Volunteer */}
            <Pressable
              onPress={() => {
                useAuthStore.getState().loginAsVolunteer();
                router.push('/(auth)/login');
              }}
              style={({ pressed }) => ({
                borderRadius: 22, overflow: 'hidden',
                transform: [{ scale: pressed ? 0.96 : 1 }],
                shadowColor: '#059669', shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
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
                <Text style={{ fontSize: 20, marginRight: 10 }}>🙋</Text>
                <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 }}>
                  I'm a Volunteer
                </Text>
              </LinearGradient>
            </Pressable>

            {/* Secondary — I'm an NGO */}
            <Pressable
              onPress={() => {
                useAuthStore.getState().loginAsNGO();
                router.push('/(auth)/login');
              }}
              style={({ pressed }) => ({
                height: 56, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
                flexDirection: 'row',
                borderWidth: 2, borderColor: '#10B981', marginTop: 14,
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                transform: [{ scale: pressed ? 0.96 : 1 }],
              })}
            >
              <Text style={{ fontSize: 20, marginRight: 10 }}>🏢</Text>
              <Text style={{ color: '#10B981', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 }}>
                I'm an NGO
              </Text>
            </Pressable>

            {/* Bottom tagline */}
            <Text style={{
              fontSize: 12, color: '#6B7280', textAlign: 'center', marginTop: 20,
            }}>
              Join 2,000+ volunteers making verified impact
            </Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
