import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "@/stores/authStore";
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

export default function NGOLayout() {
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  return (
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
          title: 'Dashboard',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="grid-outline" focusedName="grid" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create-drive"
        options={{
          title: 'Create',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="add-circle-outline" focusedName="add-circle" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="bar-chart-outline" focusedName="bar-chart" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="badges"
        options={{
          title: 'Badges',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="ribbon-outline" focusedName="ribbon" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="business-outline" focusedName="business" focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
