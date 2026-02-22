import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView,
  KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

/* ─── Google G Logo (inline SVG-style rendered with Views) ─── */
function GoogleGIcon() {
  return (
    <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#4285F4' }}>G</Text>
    </View>
  );
}

/* ─── Animated Segmented Control ─── */
function RoleSelector({
  role,
  onSelect,
  colors,
}: {
  role: 'volunteer' | 'ngo';
  onSelect: (r: 'volunteer' | 'ngo') => void;
  colors: typeof Colors.light;
}) {
  const CONTAINER_PAD = 4;
  const SEGMENT_WIDTH = (width - 48 - CONTAINER_PAD * 2) / 2;
  const translateX = useSharedValue(role === 'volunteer' ? 0 : SEGMENT_WIDTH);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleSelect = (r: 'volunteer' | 'ngo') => {
    translateX.value = withSpring(r === 'volunteer' ? 0 : SEGMENT_WIDTH, {
      damping: 20,
      stiffness: 200,
      overshootClamping: true,
    });
    onSelect(r);
  };

  return (
    <View style={{
      height: 48, backgroundColor: '#F0F0F0', borderRadius: 999,
      padding: CONTAINER_PAD, marginBottom: 24, position: 'relative',
      flexDirection: 'row', overflow: 'hidden',
    }}>
      {/* Sliding indicator */}
      <Animated.View style={[{
        position: 'absolute', top: CONTAINER_PAD, bottom: CONTAINER_PAD, left: CONTAINER_PAD,
        width: SEGMENT_WIDTH, borderRadius: 999,
        backgroundColor: '#059669',
        shadowColor: '#059669', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
      }, pillStyle]} />

      {(['volunteer', 'ngo'] as const).map((r) => (
        <Pressable
          key={r}
          onPress={() => handleSelect(r)}
          style={{
            flex: 1, height: 40, borderRadius: 999,
            alignItems: 'center', justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Text style={{
            fontSize: 14,
            fontWeight: role === r ? '600' : '400',
            color: role === r ? '#FFFFFF' : '#7B78A0',
          }}>
            {r === 'volunteer' ? '🧑‍🤝‍🧑 Volunteer' : '🏢 NGO'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const darkMode = useAuthStore((s) => s.darkMode);
  const user = useAuthStore((s) => s.user);
  const loginAsVolunteer = useAuthStore((s) => s.loginAsVolunteer);
  const loginAsNGO = useAuthStore((s) => s.loginAsNGO);
  const colors = darkMode ? Colors.dark : Colors.light;

  const [role, setRole] = useState<'volunteer' | 'ngo'>(user?.role || 'volunteer');
  const [email, setEmail] = useState('demo@activibe.com');
  const [password, setPassword] = useState('demo123');
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValid = email.includes('@') && password.length >= 6 && (!isSignUp || password === confirmPassword);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    
    if (role === 'volunteer') {
      loginAsVolunteer();
      router.replace('/(auth)/onboarding');
    } else {
      loginAsNGO();
      router.replace('/(auth)/ngo-register');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.surface }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 36 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                width: 10, height: 10, borderRadius: 5,
                backgroundColor: colors.brand, marginRight: 6,
              }} />
              <Text style={{ fontSize: 32, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 }}>
                ActiVibe
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: colors.inkMuted, marginTop: 4 }}>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </Text>
          </View>

          {/* Auth Card */}
          <View style={{
            backgroundColor: colors.card, borderRadius: 24,
            padding: 24, shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1,
            shadowRadius: 20, elevation: 5,
            borderWidth: 1, borderColor: colors.glassBorder,
          }}>
            {/* Role Selector */}
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.inkLight, marginBottom: 8 }}>
              I am a…
            </Text>
            <RoleSelector role={role} onSelect={setRole} colors={colors} />

            {/* Google Sign-In Button */}
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => ({
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                height: 52, borderRadius: 12, borderWidth: 1, borderColor: '#E4E4F0',
                backgroundColor: '#FFFFFF', paddingHorizontal: 16, gap: 12,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <GoogleGIcon />
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#0F0E17' }}>
                Continue with Google
              </Text>
            </Pressable>

            {/* OR Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 22 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              <Text style={{ marginHorizontal: 14, fontSize: 12, color: colors.inkMuted, fontWeight: '500' }}>or</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            </View>

            {/* Email */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight, marginBottom: 6 }}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.inkMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border,
                paddingHorizontal: 16, fontSize: 15, color: colors.ink,
                backgroundColor: colors.gray100, marginBottom: 14,
              }}
            />

            {/* Password */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight, marginBottom: 6 }}>Password</Text>
            <View style={{ position: 'relative', marginBottom: isSignUp ? 14 : 22 }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••"
                placeholderTextColor={colors.inkMuted}
                secureTextEntry={!showPassword}
                style={{
                  height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border,
                  paddingHorizontal: 16, paddingRight: 48, fontSize: 15, color: colors.ink,
                  backgroundColor: colors.gray100,
                }}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 14, top: 14 }}
              >
                <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
              </Pressable>
            </View>

            {/* Confirm Password (sign up only) */}
            {isSignUp && (
              <>
                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight, marginBottom: 6 }}>
                  Confirm Password
                </Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••"
                  placeholderTextColor={colors.inkMuted}
                  secureTextEntry
                  style={{
                    height: 52, borderRadius: 14, borderWidth: 1.5,
                    borderColor: confirmPassword && password !== confirmPassword ? '#DC2626' : colors.border,
                    paddingHorizontal: 16, fontSize: 15, color: colors.ink,
                    backgroundColor: colors.gray100, marginBottom: 22,
                  }}
                />
                {confirmPassword && password !== confirmPassword && (
                  <Text style={{ fontSize: 11, color: '#DC2626', marginTop: -18, marginBottom: 16 }}>
                    Passwords don't match
                  </Text>
                )}
              </>
            )}

            {/* Submit Button — Gradient */}
            <Pressable
              onPress={handleSubmit}
              disabled={!isValid || loading}
              style={({ pressed }) => ({
                borderRadius: 14, overflow: 'hidden',
                opacity: !isValid || loading ? 0.4 : 1,
                transform: [{ scale: pressed && isValid ? 0.97 : 1 }],
                shadowColor: '#059669', shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isValid ? 0.3 : 0,
                shadowRadius: 12, elevation: isValid ? 4 : 0,
              })}
            >
              <LinearGradient
                colors={['#059669', '#10B981']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{
                  height: 52, alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '600' }}>
                  {loading ? '⏳ Signing in...' : (isSignUp ? 'Create Account' : 'Sign In →')}
                </Text>
              </LinearGradient>
            </Pressable>

            {/* Toggle Mode */}
            <Pressable onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: 18, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: colors.brand, fontWeight: '500' }}>
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
