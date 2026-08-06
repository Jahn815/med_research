import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColorTheme } from '../theme/colors';
import { Language, i18n } from '../i18n/translations';

interface HeaderProps {
  theme: ColorTheme;
  isDark: boolean;
  onToggleTheme: () => void;
  lang: Language;
  onToggleLanguage: () => void;
  progressPercent: number;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  isDark,
  onToggleTheme,
  lang,
  onToggleLanguage,
  progressPercent,
  onReset,
}) => {
  const currentLang: Language = lang && i18n[lang] ? lang : 'ko';
  const t = i18n[currentLang];

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
            <Ionicons name="medical" size={14} color={theme.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.badgeText, { color: theme.primary }]}>{t.clinicalBadge}</Text>
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{t.appTitle}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t.appSubtitle}</Text>
        </View>

        <View style={styles.actionsRow}>
          {/* Language Toggle Button */}
          <TouchableOpacity
            style={[styles.langButton, { backgroundColor: theme.chipBg, borderColor: theme.cardBorder }]}
            onPress={onToggleLanguage}
            activeOpacity={0.7}
          >
            <Text style={[styles.langText, { color: theme.textPrimary }]}>
              {lang === 'ko' ? '🇺🇸 EN' : '🇰🇷 KR'}
            </Text>
          </TouchableOpacity>

          {/* Theme Toggle Button */}
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.chipBg }]}
            onPress={onToggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={20} color={theme.textPrimary} />
          </TouchableOpacity>

          {/* Reset Button */}
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.chipBg }]}
            onPress={onReset}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>{t.progressLabel}</Text>
          <Text style={[styles.progressValue, { color: theme.primary }]}>
            {Math.round(progressPercent)}%
          </Text>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: theme.chipBg }]}>
          <View
            style={[
              styles.progressBarFill,
              { backgroundColor: theme.primary, width: `${Math.min(100, Math.max(0, progressPercent))}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 16 : 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginTop: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
