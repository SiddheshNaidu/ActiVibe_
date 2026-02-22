import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authStore';
import { useNotifStore } from '@/stores/notifStore';
import { Colors } from '@/constants/theme';

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
      {/* Header — Solid */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, height: 52,
        backgroundColor: colors.card,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
      }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.ink }}>Notifications</Text>
        </View>
        {unread > 0 && (
          <Pressable
            onPress={markAllRead}
            hitSlop={10}
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text style={{ fontSize: 15, fontWeight: '500', color: '#059669' }}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 12 }}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setActiveFilter(f)}
            style={({ pressed }) => ({
              height: 36, paddingHorizontal: 16, borderRadius: 999,
              backgroundColor: activeFilter === f ? '#059669' : 'transparent',
              justifyContent: 'center',
              transform: [{ scale: pressed ? 0.95 : 1 }],
              borderWidth: activeFilter === f ? 0 : 1,
              borderColor: colors.border,
            })}
          >
            <Text style={{
              fontSize: 13, fontWeight: '600',
              color: activeFilter === f ? '#FFFFFF' : colors.inkMuted,
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
        contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
        ItemSeparatorComponent={() => (
          <View style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: colors.border,
          }} />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 64 }}>
            <Text style={{ fontSize: 48 }}>🔔</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.ink, marginTop: 16 }}>
              All caught up
            </Text>
            <Text style={{ fontSize: 13, color: colors.inkMuted, marginTop: 8, textAlign: 'center' }}>
              No notifications in this category yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => markRead(item.id)}
            style={({ pressed }) => ({
              flexDirection: 'row', alignItems: 'flex-start',
              paddingHorizontal: 16, paddingVertical: 14,
              backgroundColor: item.read ? colors.card : colors.brandLight,
              gap: 12,
              opacity: pressed ? 0.85 : 1,
              borderLeftWidth: item.read ? 0 : 3,
              borderLeftColor: '#059669',
            })}
          >
            {/* Icon Circle — 48dp */}
            <View style={{
              width: 48, height: 48, borderRadius: 24,
              backgroundColor: ICON_BG[item.type] || '#F3F4F6',
              alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Text style={{ fontSize: 22 }}>{ICONS[item.type] || '📌'}</Text>
            </View>

            {/* Content */}
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.ink }}>{item.title}</Text>
              <Text style={{ fontSize: 13, color: colors.inkLight, lineHeight: 19 }}>
                {item.body}
              </Text>

              {/* CTA + timestamp row */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                <Pressable
                  hitSlop={10}
                  style={({ pressed }) => ({
                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
                    borderWidth: 1.5, borderColor: '#059669',
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#059669' }}>{item.ctaLabel}</Text>
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
