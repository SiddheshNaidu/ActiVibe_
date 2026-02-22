import { Tabs } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "@/stores/authStore";
import { useNotifStore } from "@/stores/notifStore";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

function TabIcon({ name, focusedName, focused, color }: {
  name: string; focusedName: string; focused: boolean; color: string;
}) {
  return (
    <View style={{ alignItems: 'center' }}>
      {focused && (
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#059669', marginBottom: 4 }} />
      )}
      <Ionicons name={(focused ? focusedName : name) as any} size={24} color={color} />
    </View>
  );
}

export default function VolunteerLayout() {
  const darkMode = useAuthStore((s) => s.darkMode);
  const unread = useNotifStore((s) => s.unread);
  const colors = darkMode ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="home-outline" focusedName="home" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="location-outline" focusedName="location" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ focused, color }) => (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#059669', marginBottom: 4 }} />
              )}
              <View>
                <Ionicons
                  name={focused ? 'notifications' : 'notifications-outline'}
                  size={24}
                  color={color}
                />
                {unread > 0 && (
                  <View style={{
                    position: 'absolute', top: -4, right: -8,
                    backgroundColor: '#DC2626', borderRadius: 999,
                    minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center',
                    paddingHorizontal: 3, borderWidth: 1.5, borderColor: colors.card,
                  }}>
                    <Text style={{ color: '#FFF', fontSize: 9, fontWeight: '700' }}>{unread > 9 ? '9+' : unread}</Text>
                  </View>
                )}
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="person-outline" focusedName="person" focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
    </GestureHandlerRootView>
  );
}
