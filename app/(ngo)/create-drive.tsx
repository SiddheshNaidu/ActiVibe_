import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, SafeAreaView, ScrollView, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function CreateDriveScreen() {
  const router = useRouter();
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;

  const [driveName, setDriveName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [spots, setSpots] = useState(30);
  const [postLimit, setPostLimit] = useState(5);
  const [zoneRadius, setZoneRadius] = useState(500);
  const [showConfirm, setShowConfirm] = useState(false);

  const isValid = driveName.trim().length > 0 && date.length > 0 && location.length > 0;

  const handlePublish = () => {
    setShowConfirm(false);
    Alert.alert('✅ Drive Published!', 'Volunteers can now register for ' + driveName);
    router.back();
  };

  const StepperButton = ({ onPress, icon }: { onPress: () => void; icon: string }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: 40, height: 40, borderRadius: 14,
        backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center',
        transform: [{ scale: pressed ? 0.9 : 1 }],
        borderWidth: 1, borderColor: colors.border,
      })}
    >
      <Text style={{ fontSize: 18, color: colors.ink, fontWeight: '600' }}>{icon}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1,
        borderBottomColor: colors.border, backgroundColor: colors.card,
      }}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            width: 36, height: 36, borderRadius: 12,
            backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center',
            transform: [{ scale: pressed ? 0.9 : 1 }],
          })}
        >
          <Text style={{ fontSize: 18, color: colors.ink }}>←</Text>
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink }}>Create Drive</Text>
        <Pressable style={({ pressed }) => ({
          paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
          backgroundColor: colors.brandLight,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.brand }}>Save Draft</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
        <View style={{
          backgroundColor: colors.card, borderRadius: 24, padding: 24,
          shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
          borderWidth: 1, borderColor: colors.border,
        }}>
          {/* Drive Name */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight, marginBottom: 6 }}>
            Drive Name
          </Text>
          <TextInput
            value={driveName}
            onChangeText={setDriveName}
            placeholder="e.g. Versova Beach Cleanup"
            placeholderTextColor={colors.inkMuted}
            maxLength={100}
            style={{
              height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border,
              paddingHorizontal: 16, fontSize: 15, color: colors.ink,
              backgroundColor: colors.gray100, marginBottom: 4,
            }}
          />
          <Text style={{ fontSize: 10, color: colors.inkMuted, textAlign: 'right', marginBottom: 18 }}>
            {driveName.length}/100
          </Text>

          {/* Date & Time */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight, marginBottom: 6 }}>
            Date & Time
          </Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="e.g. 15 June 2025, 8:00 AM – 12:00 PM"
            placeholderTextColor={colors.inkMuted}
            style={{
              height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border,
              paddingHorizontal: 16, fontSize: 15, color: colors.ink,
              backgroundColor: colors.gray100, marginBottom: 18,
            }}
          />

          {/* Location */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight, marginBottom: 6 }}>
            Drive Location
          </Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Versova Beach, Mumbai"
            placeholderTextColor={colors.inkMuted}
            style={{
              height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border,
              paddingHorizontal: 16, fontSize: 15, color: colors.ink,
              backgroundColor: colors.gray100, marginBottom: 10,
            }}
          />

          {/* Mini Map */}
          <View style={{
            height: 100, borderRadius: 16, backgroundColor: darkMode ? '#1a2332' : '#e8f5e9',
            alignItems: 'center', justifyContent: 'center', marginBottom: 20,
            borderWidth: 1, borderColor: colors.border,
          }}>
            <Text style={{ fontSize: 28 }}>📍</Text>
            <Text style={{ fontSize: 11, color: colors.inkMuted, marginTop: 4 }}>
              {location || 'Map preview will appear here'}
            </Text>
          </View>

          {/* Zone Radius */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight, marginBottom: 8 }}>
            Check-In Zone Radius: <Text style={{ color: colors.brand }}>{zoneRadius}m</Text>
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <StepperButton onPress={() => setZoneRadius(Math.max(100, zoneRadius - 100))} icon="−" />
            <View style={{
              flex: 1, height: 8, backgroundColor: colors.gray100, borderRadius: 4,
              overflow: 'hidden',
            }}>
              <View style={{
                width: `${((zoneRadius - 100) / 1900) * 100}%`, height: '100%',
                backgroundColor: colors.brand, borderRadius: 4,
              }} />
            </View>
            <StepperButton onPress={() => setZoneRadius(Math.min(2000, zoneRadius + 100))} icon="+" />
          </View>

          {/* Volunteer Spots */}
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            paddingVertical: 16, borderTopWidth: 1, borderTopColor: colors.border,
          }}>
            <View>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight }}>Volunteer Spots</Text>
              <Text style={{ fontSize: 11, color: colors.inkMuted, marginTop: 2 }}>0 of {spots} registered</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <StepperButton onPress={() => setSpots(Math.max(5, spots - 5))} icon="−" />
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.ink, minWidth: 32, textAlign: 'center' }}>{spots}</Text>
              <StepperButton onPress={() => setSpots(Math.min(500, spots + 5))} icon="+" />
            </View>
          </View>

          {/* Post Limit */}
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border,
          }}>
            <View>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight }}>Posts per volunteer</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <StepperButton onPress={() => setPostLimit(Math.max(1, postLimit - 1))} icon="−" />
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.ink, minWidth: 32, textAlign: 'center' }}>{postLimit}</Text>
              <StepperButton onPress={() => setPostLimit(Math.min(10, postLimit + 1))} icon="+" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Publish Footer */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 16,
        paddingBottom: 36, borderTopWidth: 1, borderTopColor: colors.border,
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08, shadowRadius: 16,
      }}>
        <Pressable
          onPress={() => isValid ? setShowConfirm(true) : null}
          disabled={!isValid}
          style={({ pressed }) => ({
            borderRadius: 22, overflow: 'hidden',
            opacity: isValid ? 1 : 0.35,
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
            <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700' }}>Publish Drive →</Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Confirmation Modal */}
      {showConfirm && (
        <Pressable
          onPress={() => setShowConfirm(false)}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Pressable style={{
            backgroundColor: colors.card, borderRadius: 24, padding: 28,
            width: '85%', maxWidth: 360,
            shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15, shadowRadius: 24,
          }}>
            <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 8 }}>🚀</Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.ink, marginBottom: 14, textAlign: 'center' }}>
              Confirm & Publish
            </Text>
            <View style={{
              backgroundColor: colors.gray100, borderRadius: 14, padding: 16, marginBottom: 20,
            }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.ink }}>{driveName}</Text>
              <Text style={{ fontSize: 13, color: colors.inkMuted, marginTop: 4 }}>{date}</Text>
              <Text style={{ fontSize: 13, color: colors.inkMuted, marginTop: 2 }}>{spots} spots · {postLimit} posts per volunteer</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={() => setShowConfirm(false)}
                style={({ pressed }) => ({
                  flex: 1, height: 48, borderRadius: 16, borderWidth: 2, borderColor: colors.border,
                  alignItems: 'center', justifyContent: 'center',
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                })}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.ink }}>Edit More</Text>
              </Pressable>
              <Pressable
                onPress={handlePublish}
                style={({ pressed }) => ({
                  flex: 1, height: 48, borderRadius: 16, overflow: 'hidden',
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                })}
              >
                <LinearGradient
                  colors={['#059669', '#10B981']}
                  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFF' }}>Publish</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      )}
    </SafeAreaView>
  );
}
