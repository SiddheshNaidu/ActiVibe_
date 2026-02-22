import React from 'react';
import { View, Text, SafeAreaView, FlatList, Pressable } from 'react-native';
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

export default function NotificationsScreen() {
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;
  const items = useNotifStore((s) => s.items);
  const markRead = useNotifStore((s) => s.markRead);
  const markAllRead = useNotifStore((s) => s.markAllRead);
  const unread = useNotifStore((s) => s.unread);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
        borderBottomColor: colors.border,
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
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => markRead(item.id)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              backgroundColor: item.read ? colors.card : (darkMode ? 'rgba(16,185,129,0.08)' : colors.brandLight),
              borderRadius: 18, padding: 16, marginBottom: 12,
              borderLeftWidth: item.read ? 0 : 4, borderLeftColor: colors.brand,
              borderWidth: 1, borderColor: item.read ? colors.border : 'transparent',
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
