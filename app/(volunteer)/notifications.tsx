import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authStore';
import { useNotifStore } from '@/stores/notifStore';
import { Colors } from '@/constants/theme';
import { BlurView } from 'expo-blur';

const ICONS: Record<string, string> = {
  drive_confirmed: '✅',
  drive_reminder: '⏰',
  endorsement: '🌟',
  drive_update: '📢',
};

const ICON_BG: Record<string, string> = {
  drive_confirmed: '#D1FAE5',
  drive_reminder: '#FEF3C7',
  endorsement: '#DBEAFE',
  drive_update: '#E0E7FF',
};

const FILTERS = ['All', 'Drives', 'Endorsements', 'Updates'] as const;
type FilterType = typeof FILTERS[number];

const FILTER_TYPE_MAP: Record<FilterType, string[]> = {
  All: [],
  Drives: ['drive_confirmed', 'drive_reminder'],
  Endorsements: ['endorsement'],
  Updates: ['drive_update'],
};

export default function NotificationsScreen() {
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;
  const items = useNotifStore((s) => s.items);
  const markRead = useNotifStore((s) => s.markRead);
  const markAllRead = useNotifStore((s) => s.markAllRead);
  const unread = useNotifStore((s) => s.unread);

  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') return items;
    const types = FILTER_TYPE_MAP[activeFilter];
    return items.filter((item) => types.includes(item.type));
  }, [items, activeFilter]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header — Frosted */}
      <BlurView intensity={80} tint={darkMode ? 'dark' : 'light'} style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04, shadowRadius: 8,
      }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: '800', color: colors.ink }}>Notifications</Text>
          {unread > 0 && (
            <Text style={{ fontSize: 12, color: colors.inkMuted, marginTop: 2 }}>{unread} unread</Text>
          )}
        </View>
        {unread > 0 && (
          <Pressable
            onPress={markAllRead}
            style={({ pressed }) => ({
              paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12,
              backgroundColor: colors.brandLight,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.brand }}>Mark all read</Text>
          </Pressable>
        )}
      </BlurView>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 8 }}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setActiveFilter(f)}
            style={({ pressed }) => ({
              height: 34, paddingHorizontal: 14, borderRadius: 999,
              backgroundColor: activeFilter === f ? '#059669' : 'rgba(255,255,255,0.5)',
              justifyContent: 'center',
              transform: [{ scale: pressed ? 0.95 : 1 }],
              borderWidth: activeFilter === f ? 0 : 1,
              borderColor: 'rgba(255,255,255,0.6)',
            })}
          >
            <Text style={{
              fontSize: 13,
              fontWeight: activeFilter === f ? '600' : '400',
              color: activeFilter === f ? '#FFFFFF' : '#7B78A0',
            }}>
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Notification List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 64 }}>
            <Text style={{ fontSize: 48 }}>🔔</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.ink, marginTop: 16 }}>
              All caught up
            </Text>
            <Text style={{ fontSize: 15, color: '#7B78A0', marginTop: 8, textAlign: 'center' }}>
              No notifications in this category yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => markRead(item.id)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              backgroundColor: item.read ? colors.card : (darkMode ? 'rgba(16,185,129,0.08)' : colors.brandLight),
              borderRadius: 18, padding: 16, marginBottom: 12,
              borderLeftWidth: item.read ? 0 : 4, borderLeftColor: colors.brand,
              borderWidth: 1, borderColor: item.read ? colors.glassBorder : 'transparent',
              shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <View style={{
              width: 46, height: 46, borderRadius: 14,
              backgroundColor: ICON_BG[item.type] || '#F3F4F6',
              alignItems: 'center', justifyContent: 'center', marginRight: 14,
            }}>
              <Text style={{ fontSize: 22 }}>{ICONS[item.type] || '📌'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.ink }}>{item.title}</Text>
              <Text style={{ fontSize: 13, color: colors.inkLight, marginTop: 3, lineHeight: 18 }}>
                {item.body}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
                <Pressable style={({ pressed }) => ({
                  paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10,
                  backgroundColor: colors.brand,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                })}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFF' }}>{item.ctaLabel}</Text>
                </Pressable>
                <Text style={{ fontSize: 11, color: colors.inkMuted }}>{item.timestamp}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
