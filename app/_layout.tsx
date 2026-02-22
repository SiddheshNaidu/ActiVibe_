import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/stores/authStore";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function RootLayout() {
  const darkMode = useAuthStore((s) => s.darkMode);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: darkMode ? '#0F0E17' : '#F9F9FB', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: darkMode ? '#0F0E17' : '#F9F9FB' }}>
        <StatusBar style={darkMode ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: darkMode ? '#0F0E17' : '#F9F9FB' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(volunteer)" />
          <Stack.Screen name="(ngo)" />
          <Stack.Screen name="(shared)" />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}
