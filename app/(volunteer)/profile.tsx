import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions, Share, Modal, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/theme';
import { SEED_VOLUNTEER, SEED_ENDORSEMENTS } from '@/data/seed';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const { width } = Dimensions.get('window');
const ENDORSE_CARD_WIDTH = (width - 52) / 2;

/* ─── Endorsement Card (Pressable) ─── */
function EndorsementCard({
  endorsement,
  colors,
  onPress,
}: {
  endorsement: typeof SEED_ENDORSEMENTS[0];
  colors: typeof Colors.light;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: ENDORSE_CARD_WIDTH, backgroundColor: colors.card, borderRadius: 18,
          padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
          borderWidth: 1, borderColor: colors.border,
        }}
      >
        <View style={{
          width: 44, height: 44, borderRadius: 14,
          backgroundColor: colors.brandLight,
          alignItems: 'center', justifyContent: 'center', marginBottom: 10,
        }}>
          <Text style={{ fontSize: 24 }}>{endorsement.emoji}</Text>
        </View>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>
          {endorsement.badgeName}
        </Text>
        <Text style={{ fontSize: 12, color: colors.inkMuted, marginTop: 3 }}>
          {endorsement.ngoName}
        </Text>
        <Text style={{ fontSize: 10, color: colors.inkMuted, marginTop: 2 }}>
          {endorsement.driveName} • {endorsement.date}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/* ─── Main Screen ─── */
export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const darkMode = useAuthStore((s) => s.darkMode);
  const colors = darkMode ? Colors.dark : Colors.light;
  const vol = SEED_VOLUNTEER;
  const logout = useAuthStore((s) => s.logout);

  // Settings modal state
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [editName, setEditName] = useState(vol.name);
  const [editBio, setEditBio] = useState(vol.bio);

  // Bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const [selectedEndorsement, setSelectedEndorsement] = useState<typeof SEED_ENDORSEMENTS[0] | null>(null);

  const handleOpenSheet = useCallback((endorsement: typeof SEED_ENDORSEMENTS[0]) => {
    setSelectedEndorsement(endorsement);
    bottomSheetRef.current?.expand();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  );

  const handleShareEndorsement = useCallback(async () => {
    if (!selectedEndorsement) return;
    try {
      await Share.share({
        message:
          `🏅 ${selectedEndorsement.badgeName}\n\n` +
          `Endorsed by: ${selectedEndorsement.ngoName}\n` +
          `Drive: ${selectedEndorsement.driveName}\n` +
          `Date: ${selectedEndorsement.date}\n\n` +
          `${selectedEndorsement.description || 'Recognized for outstanding contribution!'}\n\n` +
          `— Verified on ActiVibe`,
      });
    } catch (e) {
      // Silently fail
    }
  }, [selectedEndorsement]);

  const driveHistory = [
    { name: 'Versova Beach Cleanup', ngo: 'Greenpeace Mumbai', role: 'Logistics Coordinator', hours: '2:47', date: 'Jun 2025' },
    { name: 'Literacy Sessions', ngo: 'Teach For India', role: 'Tutor', hours: '4:12', date: 'May 2025' },
    { name: 'City Cleanup Drive', ngo: 'iVolunteer', role: 'Team Lead', hours: '3:15', date: 'Apr 2025' },
    { name: 'Orientation Drive', ngo: 'NSS Mumbai', role: 'Volunteer', hours: '1:30', date: 'Mar 2024' },
  ];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: darkMode ? '#064E3B' : '#059669' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Cover Photo */}
        <LinearGradient
          colors={darkMode ? ['#064E3B', '#0F0E17'] : ['#059669', '#10B981']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ height: 180, position: 'relative' }}
        >
          {/* Gear icon — offset from safe area */}
          <Pressable
            onPress={() => setSettingsVisible(true)}
            style={({ pressed }) => ({
              position: 'absolute', top: 12, right: 16, zIndex: 10,
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: 'rgba(0,0,0,0.35)',
              alignItems: 'center', justifyContent: 'center',
              transform: [{ scale: pressed ? 0.9 : 1 }],
            })}
          >
            <Text style={{ fontSize: 18, color: '#FFFFFF' }}>⚙️</Text>
          </Pressable>
        </LinearGradient>

        {/* Identity Row — fixed overlap by adding bg behind name */}
        <View style={{ backgroundColor: colors.surface }}>
          <View style={{ paddingHorizontal: 20, marginTop: -44 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <View style={{
                width: 96, height: 96, borderRadius: 48, borderWidth: 4, borderColor: colors.surface,
                overflow: 'hidden', backgroundColor: colors.card,
                shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15, shadowRadius: 8,
              }}>
                <Image source={{ uri: vol.avatarUrl }} style={{ width: 88, height: 88, borderRadius: 44 }} />
              </View>
              <View style={{ flex: 1, marginLeft: 14, marginBottom: 8 }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: colors.ink }}>{editName || vol.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <View style={{
                    backgroundColor: colors.brandLight, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 9999,
                  }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.brand }}>Volunteer</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: colors.inkMuted }}>Since {vol.joinedDate}</Text>
                </View>
              </View>
            </View>

            <Text style={{ fontSize: 14, color: colors.inkLight, marginTop: 12, lineHeight: 21 }}>
              {editBio || vol.bio}
            </Text>
          </View>
        </View>

        {/* Primary Stat */}
        <View style={{ backgroundColor: colors.surface }}>
          <View style={{
            marginHorizontal: 20, marginTop: 20, backgroundColor: colors.card,
            borderRadius: 20, padding: 20, borderLeftWidth: 4, borderLeftColor: '#059669',
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
            borderWidth: 1, borderColor: colors.border,
          }}>
            <Text style={{ fontSize: 36, fontWeight: '800', color: '#059669' }}>
              {vol.totalActiveHours} hrs
            </Text>
            <Text style={{ fontSize: 15, color: colors.inkMuted, marginTop: 2, fontWeight: '500' }}>
              Total Active Drive Time
            </Text>
            <Text style={{ fontSize: 11, color: colors.inkMuted, fontStyle: 'italic', marginTop: 2 }}>
              (GPS-verified — time inside drive zones only)
            </Text>

            <View style={{
              flexDirection: 'row', marginTop: 18, gap: 20,
              paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border,
            }}>
              {[
                { value: vol.drivesCompleted, label: 'Drives', emoji: '🎯' },
                { value: vol.endorsementCount, label: 'Endorsed', emoji: '⭐' },
                { value: 'Mumbai', label: 'Location', emoji: '📍' },
              ].map((stat, i) => (
                <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 12, marginBottom: 4 }}>{stat.emoji}</Text>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: colors.ink }}>
                    {stat.value}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.inkMuted, fontWeight: '500' }}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Skills */}
        <View style={{ backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 12 }}>Skills</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {vol.skills?.map((skill, i) => (
              <View key={i} style={{
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9999,
                backgroundColor: skill.tier === 'endorsed' ? colors.brand : skill.tier === 'inferred' ? colors.brandLight : 'transparent',
                borderWidth: skill.tier === 'self' ? 1.5 : 0,
                borderColor: colors.brand,
              }}>
                <Text style={{
                  fontSize: 13, fontWeight: '700',
                  color: skill.tier === 'endorsed' ? '#FFF' : colors.brand,
                }}>
                  {skill.category}
                </Text>
                {skill.tier === 'endorsed' && (
                  <Text style={{ fontSize: 11, color: '#FFF', marginLeft: 4 }}>✓</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Endorsements */}
        <View style={{ backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink }}>Endorsements</Text>
          <Text style={{ fontSize: 12, color: colors.inkMuted, fontStyle: 'italic', marginTop: 3, marginBottom: 14 }}>
            Manually awarded by NGO coordinators. Tap to view details.
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {SEED_ENDORSEMENTS.map((end) => (
              <EndorsementCard
                key={end.id}
                endorsement={end}
                colors={colors}
                onPress={() => handleOpenSheet(end)}
              />
            ))}
          </View>
        </View>

        {/* Drive History */}
        <View style={{ backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 12 }}>
            Drive History
          </Text>
          {driveHistory.map((drive, i) => (
            <View key={i} style={{
              flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
              borderBottomWidth: i < driveHistory.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}>
              <View style={{
                width: 38, height: 38, borderRadius: 12,
                backgroundColor: colors.brandLight,
                alignItems: 'center', justifyContent: 'center', marginRight: 12,
              }}>
                <Text style={{ fontSize: 16 }}>✅</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>{drive.name}</Text>
                <Text style={{ fontSize: 12, color: colors.inkMuted }}>{drive.ngo} • {drive.role}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#059669' }}>{drive.hours}</Text>
                <Text style={{ fontSize: 10, color: colors.inkMuted }}>{drive.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Verified Seal */}
        <View style={{ backgroundColor: colors.surface }}>
          <View style={{
            marginHorizontal: 20, marginTop: 24, marginBottom: 16,
            backgroundColor: colors.card, borderRadius: 18, padding: 18,
            borderLeftWidth: 4, borderLeftColor: colors.brand,
            borderWidth: 1, borderColor: colors.border,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 20, marginRight: 8 }}>🛡️</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink }}>ActiVibe Verified</Text>
            </View>
            <Text style={{ fontSize: 13, color: colors.inkLight, lineHeight: 19 }}>
              Every hour confirmed by GPS geofence. Every endorsement is a deliberate award from an NGO coordinator.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Save as Image Footer */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: colors.surface,
        borderTopWidth: 1, borderTopColor: colors.border,
        paddingHorizontal: 16, paddingTop: 12,
        paddingBottom: insets.bottom + 12,
      }}>
        <Pressable style={({ pressed }) => ({
          height: 52, borderRadius: 12, borderWidth: 2, borderColor: '#059669',
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        })}>
          <Text style={{ fontSize: 20 }}>📸</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#059669' }}>
            Save as Image
          </Text>
        </Pressable>
      </View>

      {/* ── Settings Modal ── */}
      <Modal visible={settingsVisible} animationType="slide" transparent>
        <View style={{
          flex: 1, justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
          <View style={{
            backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: 24, paddingBottom: insets.bottom + 24,
          }}>
            {/* Drag handle */}
            <View style={{
              width: 36, height: 4, borderRadius: 2,
              backgroundColor: colors.gray200, alignSelf: 'center', marginBottom: 20,
            }} />

            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.ink, marginBottom: 20 }}>
              Settings
            </Text>

            {/* Edit Name */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight, marginBottom: 6 }}>
              Display Name
            </Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name"
              placeholderTextColor={colors.inkMuted}
              style={{
                height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border,
                paddingHorizontal: 14, fontSize: 15, color: colors.ink,
                backgroundColor: colors.gray100, marginBottom: 14,
              }}
            />

            {/* Edit Bio */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkLight, marginBottom: 6 }}>
              Bio
            </Text>
            <TextInput
              value={editBio}
              onChangeText={setEditBio}
              placeholder="A short bio..."
              placeholderTextColor={colors.inkMuted}
              multiline
              numberOfLines={3}
              style={{
                height: 80, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border,
                paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.ink,
                backgroundColor: colors.gray100, marginBottom: 20,
                textAlignVertical: 'top',
              }}
            />

            {/* Save Button */}
            <Pressable
              onPress={() => setSettingsVisible(false)}
              style={({ pressed }) => ({
                height: 50, borderRadius: 14, backgroundColor: '#059669',
                alignItems: 'center', justifyContent: 'center',
                transform: [{ scale: pressed ? 0.96 : 1 }],
                marginBottom: 12,
              })}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFF' }}>Save Changes</Text>
            </Pressable>

            {/* Logout Button */}
            <Pressable
              onPress={() => {
                setSettingsVisible(false);
                logout();
                router.replace('/');
              }}
              style={({ pressed }) => ({
                height: 50, borderRadius: 14, borderWidth: 2, borderColor: '#DC2626',
                alignItems: 'center', justifyContent: 'center',
                flexDirection: 'row', gap: 8,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              })}
            >
              <Text style={{ fontSize: 16 }}>🚪</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#DC2626' }}>Log Out</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── Endorsement Detail Bottom Sheet ── */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: colors.card,
          borderRadius: 24,
          shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.12, shadowRadius: 16,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.inkMuted, width: 40 }}
      >
        <BottomSheetView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 8 }}>
          {selectedEndorsement && (
            <>
              {/* Badge emoji */}
              <View style={{ alignItems: 'center', marginBottom: 12 }}>
                <View style={{
                  width: 72, height: 72, borderRadius: 24,
                  backgroundColor: colors.brandLight,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 48 }}>{selectedEndorsement.emoji}</Text>
                </View>
              </View>

              {/* Badge name */}
              <Text style={{
                fontSize: 22, fontWeight: '800', color: colors.ink, textAlign: 'center',
              }}>
                {selectedEndorsement.badgeName}
              </Text>

              {/* Endorser */}
              <Text style={{
                fontSize: 14, color: colors.inkMuted, textAlign: 'center', marginTop: 6,
              }}>
                Endorsed by
              </Text>
              <Text style={{
                fontSize: 16, fontWeight: '700', color: colors.ink, textAlign: 'center', marginTop: 2,
              }}>
                {selectedEndorsement.ngoName}
              </Text>

              {/* Drive & Date */}
              <View style={{
                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                gap: 8, marginTop: 10,
              }}>
                <Text style={{ fontSize: 13, color: colors.inkMuted }}>
                  📍 {selectedEndorsement.driveName}
                </Text>
                <Text style={{ fontSize: 13, color: colors.inkMuted }}>•</Text>
                <Text style={{ fontSize: 13, color: colors.inkMuted }}>
                  📅 {selectedEndorsement.date}
                </Text>
              </View>

              {/* Divider */}
              <View style={{
                height: 1, backgroundColor: colors.border,
                marginVertical: 18, marginHorizontal: 8,
              }} />

              {/* Description */}
              <Text style={{
                fontSize: 14, color: colors.inkLight, lineHeight: 22, textAlign: 'center',
              }}>
                {selectedEndorsement.description ||
                  'Recognized for exceptional dedication, leadership, and positive impact during this drive. An outstanding contribution to the community.'}
              </Text>

              {/* Share button */}
              <Pressable
                onPress={handleShareEndorsement}
                style={({ pressed }) => ({
                  marginTop: 24, height: 52, borderRadius: 16,
                  backgroundColor: '#059669',
                  alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'row',
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  shadowColor: '#059669', shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
                })}
              >
                <Text style={{ fontSize: 16, marginRight: 8 }}>🔗</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFF' }}>
                  Share This Endorsement
                </Text>
              </Pressable>
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}
