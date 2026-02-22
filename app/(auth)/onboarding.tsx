import React, { useState } from 'react';
import { View, Text, Pressable, SafeAreaView, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Colors, SkillCategories } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_COLS = 2;
const CARD_SIZE = (width - 32 - CARD_GAP * (CARD_COLS - 1)) / CARD_COLS;

export default function OnboardingScreen() {
  const router = useRouter();
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSkill = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    router.replace('/(volunteer)/feed');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <LinearGradient
        colors={darkMode ? ['#064E3B', '#0F0E17'] : ['#059669', '#047857']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28,
          borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12,
          }}>
            <Text style={{ fontSize: 12, color: '#FFF', fontWeight: '600' }}>Step 1 of 1</Text>
          </View>
        </View>
        <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFF', marginTop: 14 }}>
          What are your{'\n'}strengths?
        </Text>
        <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>
          We'll match you with relevant drives nearby.
        </Text>
      </LinearGradient>

      {/* Skill Grid */}
      <FlatList
        data={SkillCategories}
        numColumns={CARD_COLS}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        columnWrapperStyle={{ gap: CARD_GAP }}
        ItemSeparatorComponent={() => <View style={{ height: CARD_GAP }} />}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selected.includes(item.id);
          return (
            <Pressable
              onPress={() => toggleSkill(item.id)}
              style={({ pressed }) => ({
                width: CARD_SIZE, height: CARD_SIZE * 0.72, borderRadius: 20,
                backgroundColor: isSelected ? item.color : colors.card,
                borderWidth: 2.5,
                borderColor: isSelected ? item.color : colors.border,
                alignItems: 'center', justifyContent: 'center',
                transform: [{ scale: pressed ? 0.94 : isSelected ? 1.02 : 1 }],
                shadowColor: isSelected ? item.color : '#000',
                shadowOffset: { width: 0, height: isSelected ? 6 : 2 },
                shadowOpacity: isSelected ? 0.35 : 0.06,
                shadowRadius: isSelected ? 12 : 6,
                elevation: isSelected ? 6 : 2,
              })}
            >
              {/* Selection checkmark */}
              {isSelected && (
                <View style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 24, height: 24, borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 14, color: '#FFF' }}>✓</Text>
                </View>
              )}
              <Text style={{ fontSize: 36, marginBottom: 8 }}>{item.emoji}</Text>
              <Text style={{
                fontSize: 14, fontWeight: '700',
                color: isSelected ? '#FFF' : colors.ink,
                textAlign: 'center', paddingHorizontal: 8,
              }}>
                {item.label}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* Pinned Footer CTA */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 24, paddingTop: 16, paddingBottom: 36,
        backgroundColor: colors.surface,
        borderTopWidth: 1, borderTopColor: colors.border,
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08, shadowRadius: 16,
      }}>
        <Text style={{
          fontSize: 13, color: colors.inkMuted, textAlign: 'center', marginBottom: 12,
        }}>
          {selected.length} {selected.length === 1 ? 'category' : 'categories'} selected
        </Text>
        <Pressable
          onPress={handleContinue}
          disabled={selected.length < 1}
          style={({ pressed }) => ({
            borderRadius: 22, overflow: 'hidden',
            opacity: selected.length < 1 ? 0.35 : 1,
            transform: [{ scale: pressed && selected.length >= 1 ? 0.96 : 1 }],
            shadowColor: '#059669', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: selected.length >= 1 ? 0.3 : 0,
            shadowRadius: 12, elevation: selected.length >= 1 ? 6 : 0,
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
            <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700' }}>Let's Go</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20, marginLeft: 8 }}>→</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
