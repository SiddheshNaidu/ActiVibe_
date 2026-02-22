import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Colors, SkillCategories } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export default function NGORegisterScreen() {
  const router = useRouter();
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;

  const [orgName, setOrgName] = useState('');
  const [city, setCity] = useState('');
  const [pan, setPan] = useState('');
  const [causes, setCauses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [panError, setPanError] = useState('');

  const isPanValid = PAN_REGEX.test(pan);
  const isValid = orgName.trim().length > 0 && city.trim().length > 0 && isPanValid && causes.length >= 1;

  const handlePanChange = (text: string) => {
    const upper = text.toUpperCase();
    setPan(upper);
    if (upper.length === 10 && !PAN_REGEX.test(upper)) {
      setPanError('Invalid PAN format (e.g., AAAPL1234C)');
    } else {
      setPanError('');
    }
  };

  const toggleCause = (id: string) => {
    setCauses((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    router.replace('/(ngo)/feed');
    setLoading(false);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 140 }}>
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.ink, marginBottom: 6 }}>
            Register Your NGO
          </Text>
          <Text style={{ fontSize: 15, color: colors.inkMuted }}>
            Get verified and start posting drives.
          </Text>
        </View>

        {/* Form Card */}
        <View style={{
          backgroundColor: colors.card, borderRadius: 24, padding: 24,
          shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
          borderWidth: 1, borderColor: colors.border,
        }}>
          {/* Org Name */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight, marginBottom: 6 }}>
            Organisation Name
          </Text>
          <TextInput
            value={orgName}
            onChangeText={setOrgName}
            placeholder="e.g. Greenpeace Mumbai"
            placeholderTextColor={colors.inkMuted}
            maxLength={120}
            style={{
              height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border,
              paddingHorizontal: 16, fontSize: 15, color: colors.ink,
              backgroundColor: colors.gray100, marginBottom: 18,
            }}
          />

          {/* Registered City */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight, marginBottom: 6 }}>
            Registered City
          </Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="e.g. Mumbai, Maharashtra"
            placeholderTextColor={colors.inkMuted}
            style={{
              height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border,
              paddingHorizontal: 16, fontSize: 15, color: colors.ink,
              backgroundColor: colors.gray100, marginBottom: 18,
            }}
          />

          {/* PAN Number */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight, marginBottom: 6 }}>
            PAN Number
          </Text>
          <TextInput
            value={pan}
            onChangeText={handlePanChange}
            placeholder="AAAPL1234C"
            placeholderTextColor={colors.inkMuted}
            maxLength={10}
            autoCapitalize="characters"
            style={{
              height: 52, borderRadius: 14, borderWidth: 1.5,
              borderColor: panError ? '#DC2626' : colors.border,
              paddingHorizontal: 16, fontSize: 15, color: colors.ink,
              backgroundColor: colors.gray100, marginBottom: 4,
            }}
          />
          {panError ? (
            <Text style={{ fontSize: 11, color: '#DC2626', marginBottom: 14 }}>{panError}</Text>
          ) : (
            <Text style={{ fontSize: 11, color: colors.inkMuted, marginBottom: 18 }}>
              Required for 80G/12A compliance verification
            </Text>
          )}

          {/* Cause Areas */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight, marginBottom: 10 }}>
            Cause Area (select 1–3)
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {SkillCategories.map((cat) => {
              const isSelected = causes.includes(cat.id);
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => toggleCause(cat.id)}
                  style={({ pressed }) => ({
                    paddingHorizontal: 16, height: 38, borderRadius: 9999,
                    backgroundColor: isSelected ? cat.color : colors.gray100,
                    alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'row',
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                    shadowColor: isSelected ? cat.color : 'transparent',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isSelected ? 0.3 : 0,
                    shadowRadius: 6,
                    borderWidth: isSelected ? 0 : 1,
                    borderColor: colors.border,
                  })}
                >
                  <Text style={{
                    fontSize: 14, fontWeight: '600',
                    color: isSelected ? '#FFF' : colors.inkMuted,
                  }}>
                    {cat.emoji} {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* PAN Notice */}
        <View style={{
          flexDirection: 'row', marginTop: 20,
          backgroundColor: darkMode ? 'rgba(13, 148, 136, 0.15)' : colors.tealLight,
          borderRadius: 14,
          borderLeftWidth: 4, borderLeftColor: colors.teal, padding: 14,
        }}>
          <Text style={{ fontSize: 14, marginRight: 8 }}>ℹ️</Text>
          <Text style={{ fontSize: 13, color: colors.teal, lineHeight: 18, flex: 1 }}>
            PAN will be reviewed for 80G/12A compliance. You can post drives immediately.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Footer Submit */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 24, paddingTop: 16, paddingBottom: 36,
        backgroundColor: colors.surface,
        borderTopWidth: 1, borderTopColor: colors.border,
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08, shadowRadius: 16,
      }}>
        <Pressable
          onPress={handleSubmit}
          disabled={!isValid || loading}
          style={({ pressed }) => ({
            borderRadius: 22, overflow: 'hidden',
            opacity: !isValid || loading ? 0.35 : 1,
            transform: [{ scale: pressed && isValid ? 0.96 : 1 }],
            shadowColor: '#059669', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isValid ? 0.3 : 0,
            shadowRadius: 12, elevation: isValid ? 6 : 0,
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
            <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700' }}>
              {loading ? '⏳ Registering...' : 'Register Organisation →'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
