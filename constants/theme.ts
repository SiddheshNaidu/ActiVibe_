// ActiVibe Design System — Token Reference
// Color theme: Green + lime-yellow off-white + Glass UI

export const Colors = {
  light: {
    brand: '#059669',
    brandLight: '#D1FAE5',
    brandDark: '#047857',
    brandMid: '#10B981',
    ink: '#0F0E17',
    inkLight: '#3D3A54',
    inkMuted: '#7B78A0',
    surface: '#FEFFF8',
    card: 'rgba(255, 255, 255, 0.72)',
    cardSolid: '#FFFFFF',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
    border: '#E4E4F0',
    green: '#059669',
    greenLight: '#D1FAE5',
    amber: '#D97706',
    amberLight: '#FEF3C7',
    red: '#DC2626',
    teal: '#0D9488',
    tealLight: '#CCFBF1',
    white: '#FFFFFF',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray400: '#9CA3AF',
  },
  dark: {
    brand: '#10B981',
    brandLight: '#064E3B',
    brandDark: '#047857',
    brandMid: '#34D399',
    ink: '#F0EFFF',
    inkLight: '#A09ABF',
    inkMuted: '#7B78A0',
    surface: '#0F0E17',
    card: 'rgba(26, 24, 40, 0.75)',
    cardSolid: '#1A1828',
    glassBorder: 'rgba(255, 255, 255, 0.06)',
    border: '#2D2B45',
    green: '#10B981',
    greenLight: '#064E3B',
    amber: '#FBBF24',
    amberLight: '#78350F',
    red: '#EF4444',
    teal: '#14B8A6',
    tealLight: '#134E4A',
    white: '#FFFFFF',
    gray100: '#1F2937',
    gray200: '#374151',
    gray400: '#6B7280',
  },
};

export const GlassStyle = {
  light: {
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.72)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.5)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 3,
    },
    navBar: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderBottomWidth: 0,
    },
    chip: {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.6)',
    },
  },
  dark: {
    card: {
      backgroundColor: 'rgba(26, 24, 40, 0.75)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.06)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 3,
    },
    navBar: {
      backgroundColor: 'rgba(15, 14, 23, 0.85)',
      borderBottomWidth: 0,
    },
    chip: {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
};

export const Typography = {
  display: { fontSize: 32, fontWeight: '800' as const, lineHeight: 38 },
  h1: { fontSize: 26, fontWeight: '700' as const, lineHeight: 32 },
  h2: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
  h3: { fontSize: 17, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodySm: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  caption: { fontSize: 11, fontWeight: '400' as const, lineHeight: 14 },
  button: { fontSize: 15, fontWeight: '600' as const, lineHeight: 20 },
  mono: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
};

export const Spacing = {
  screenPad: 16,
  cardPad: 16,
  gapTight: 8,
  gapCards: 12,
  gapSection: 24,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 9999,
};

export const MinTouch = 48;

export const SkillCategories = [
  { id: 'environment', label: 'Environment', emoji: '🌿', color: '#16A34A' },
  { id: 'education', label: 'Education', emoji: '📚', color: '#2563EB' },
  { id: 'health', label: 'Health & Medical', emoji: '🏥', color: '#DC2626' },
  { id: 'tech', label: 'Tech & IT', emoji: '💻', color: '#0891B2' },
  { id: 'logistics', label: 'Logistics & Ops', emoji: '📦', color: '#EA580C' },
  { id: 'media', label: 'Media & Content', emoji: '🎨', color: '#DB2777' },
  { id: 'community', label: 'Community', emoji: '🤝', color: '#CA8A04' },
];

export const BadgeTypes = [
  { id: 'star', emoji: '🌟', name: 'Star Volunteer', maxPerDrive: 3 },
  { id: 'quick', emoji: '⚡', name: 'Quick Responder', maxPerDrive: 3 },
  { id: 'top', emoji: '🎯', name: 'Top Performer', maxPerDrive: 2 },
  { id: 'first', emoji: '🌱', name: 'First Drive', maxPerDrive: 5 },
  { id: 'leader', emoji: '👑', name: 'Team Leader', maxPerDrive: 2 },
  { id: 'creative', emoji: '✨', name: 'Creative Mind', maxPerDrive: 3 },
  { id: 'reliable', emoji: '🛡️', name: 'Reliable', maxPerDrive: 4 },
  { id: 'spirit', emoji: '🔥', name: 'Team Spirit', maxPerDrive: 3 },
];
