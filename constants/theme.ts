// ActiVibe Design System — Token Reference
// Instagram-grade polish. Every value intentional.

export const Colors = {
  light: {
    // Brand
    brand: '#059669',
    brandLight: '#D1FAE5',
    brandDark: '#047857',
    brandMid: '#10B981',

    // Surfaces
    surface: '#F9F9FB',
    card: '#FFFFFF',
    cardSolid: '#FFFFFF',

    // Text
    ink: '#0F0E17',
    inkLight: '#3D3A54',
    inkMuted: '#7B78A0',

    // Border
    border: '#E4E4F0',
    glassBorder: '#E4E4F0',

    // Semantic
    green: '#059669',
    greenLight: '#D1FAE5',
    amber: '#D97706',
    amberLight: '#FEF3C7',
    red: '#DC2626',
    teal: '#0D9488',
    tealLight: '#CCFBF1',

    // Neutrals
    white: '#FFFFFF',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray400: '#9CA3AF',
  },
  dark: {
    // Brand — green stays same in dark
    brand: '#059669',
    brandLight: '#052E16',
    brandDark: '#047857',
    brandMid: '#10B981',

    // Surfaces
    surface: '#0F0E17',
    card: '#1A1828',
    cardSolid: '#1A1828',

    // Text
    ink: '#F0EFFF',
    inkLight: '#A09ABF',
    inkMuted: '#5E5A7A',

    // Border
    border: '#2D2B45',
    glassBorder: '#2D2B45',

    // Semantic
    green: '#059669',
    greenLight: '#052E16',
    amber: '#D97706',
    amberLight: '#78350F',
    red: '#DC2626',
    teal: '#14B8A6',
    tealLight: '#134E4A',

    // Neutrals
    white: '#FFFFFF',
    gray100: '#1F2937',
    gray200: '#374151',
    gray400: '#6B7280',
  },
};

// Typography scale — Inter font family
// lineHeight = fontSize × 1.45 for multiline, omit for single-line
export const Typography = {
  display:  { fontSize: 32, fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
  h1:       { fontSize: 24, fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
  h2:       { fontSize: 18, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
  body:     { fontSize: 15, fontWeight: '400' as const, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  bodyMed:  { fontSize: 15, fontWeight: '500' as const, fontFamily: 'Inter_500Medium' },
  small:    { fontSize: 13, fontWeight: '400' as const, fontFamily: 'Inter_400Regular', lineHeight: 19 },
  caption:  { fontSize: 11, fontWeight: '400' as const, fontFamily: 'Inter_400Regular' },
  button:   { fontSize: 15, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
  mono:     { fontSize: 13, fontWeight: '400' as const, fontFamily: 'Courier' },
};

// Spacing — 8dp base grid
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  screenPad: 16,
  cardPad: 16,
  gapCards: 12,
  gapSection: 24,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
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
