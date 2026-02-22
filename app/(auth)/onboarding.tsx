import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Colors, SkillCategories } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (screenWidth - 16 * 2 - CARD_GAP) / 2;
const CARD_HEIGHT = 100;

function SkillCard({
  item,
  isSelected,
  onPress,
  colors,
}: {
  item: typeof SkillCategories[0];
  isSelected: boolean;
  onPress: () => void;
  colors: typeof Colors.light;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(isSelected ? 1.03 : 1, { damping: 15, stiffness: 200 });
  };

  // Update scale when selection changes
  React.useEffect(() => {
    scale.value = withSpring(isSelected ? 1.03 : 1, { damping: 15, stiffness: 200 });
  }, [isSelected]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: 16,
          backgroundColor: isSelected ? item.color : '#FFFFFF',
          borderWidth: isSelected ? 0 : 2,
          borderColor: isSelected ? 'transparent' : item.color,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: isSelected ? item.color : '#000',
          shadowOffset: { width: 0, height: isSelected ? 6 : 2 },
          shadowOpacity: isSelected ? 0.35 : 0.06,
          shadowRadius: isSelected ? 12 : 6,
          elevation: isSelected ? 6 : 2,
        }}
      >
        {/* Selection checkmark */}
        {isSelected && (
          <View style={{
            position: 'absolute', top: 8, right: 8,
            width: 22, height: 22, borderRadius: 11,
            backgroundColor: 'rgba(255,255,255,0.3)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 12, color: '#FFF' }}>✓</Text>
          </View>
        )}
        <Text style={{ fontSize: 32, marginBottom: 8 }}>{item.emoji}</Text>
        <Text style={{
          fontSize: 15, fontWeight: '600',
          color: isSelected ? '#FFFFFF' : item.color,
          textAlign: 'center', paddingHorizontal: 8,
        }}>
          {item.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

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
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: darkMode ? '#064E3B' : '#059669' }}>
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
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        <FlatList
          data={SkillCategories}
          numColumns={2}
          contentContainerStyle={{ gap: CARD_GAP, padding: 16, paddingBottom: 120 }}
          columnWrapperStyle={{ gap: CARD_GAP }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SkillCard
              item={item}
              isSelected={selected.includes(item.id)}
              onPress={() => toggleSkill(item.id)}
              colors={colors}
            />
          )}
        />
      </View>

      {/* Pinned Footer CTA */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 16, paddingTop: 16, paddingBottom: 36,
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
            height: 52, borderRadius: 12,
            backgroundColor: '#059669',
            alignItems: 'center', justifyContent: 'center',
            flexDirection: 'row',
            marginHorizontal: 0,
            opacity: selected.length < 1 ? 0.4 : 1,
            transform: [{ scale: pressed && selected.length >= 1 ? 0.96 : 1 }],
            shadowColor: '#059669', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: selected.length >= 1 ? 0.3 : 0,
            shadowRadius: 12, elevation: selected.length >= 1 ? 6 : 0,
          })}
        >
          <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700' }}>Let's Go</Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20, marginLeft: 8 }}>→</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
