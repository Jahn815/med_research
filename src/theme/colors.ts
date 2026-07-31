export interface ColorTheme {
  bg: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  chipBg: string;
  chipSelectedBg: string;
  chipSelectedText: string;
  inputBg: string;
  inputBorder: string;
  success: string;
  warning: string;
  shadowColor: string;
  badgeBg: string;
}

export const lightTheme: ColorTheme = {
  bg: '#F4F7FB',
  cardBg: '#FFFFFF',
  cardBorder: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#2563EB', // Vibrant medical blue
  primaryLight: '#EFF6FF',
  primaryDark: '#1D4ED8',
  accent: '#0D9488', // Teal accent
  chipBg: '#F1F5F9',
  chipSelectedBg: '#2563EB',
  chipSelectedText: '#FFFFFF',
  inputBg: '#F8FAFC',
  inputBorder: '#CBD5E1',
  success: '#10B981',
  warning: '#F59E0B',
  shadowColor: 'rgba(15, 23, 42, 0.08)',
  badgeBg: '#DBEAFE',
};

export const darkTheme: ColorTheme = {
  bg: '#0F172A',
  cardBg: '#1E293B',
  cardBorder: '#334155',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
  primary: '#3B82F6',
  primaryLight: '#1E3A8A',
  primaryDark: '#60A5FA',
  accent: '#14B8A6',
  chipBg: '#334155',
  chipSelectedBg: '#3B82F6',
  chipSelectedText: '#FFFFFF',
  inputBg: '#0F172A',
  inputBorder: '#475569',
  success: '#34D399',
  warning: '#FBBF24',
  shadowColor: 'rgba(0, 0, 0, 0.4)',
  badgeBg: '#1E3A8A',
};
