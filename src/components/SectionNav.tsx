import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColorTheme } from '../theme/colors';
import { SURVEY_SECTIONS } from '../constants/surveyData';
import { SurveySection } from '../types/survey';
import { Language, i18n } from '../i18n/translations';

interface SectionNavProps {
  theme: ColorTheme;
  activeSection: SurveySection;
  onSelectSection: (section: SurveySection) => void;
  sectionStatus: Record<SurveySection, boolean>;
  lang?: Language;
}

export const SectionNav: React.FC<SectionNavProps> = ({
  theme,
  activeSection,
  onSelectSection,
  sectionStatus,
  lang = 'ko',
}) => {
  const t = i18n[lang];
  const sectionTitleMap: Record<SurveySection, string> = {
    info: t.sec1Title,
    onset: t.sec2Title,
    situations: t.sec3Title,
    family: t.sec4Title,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {SURVEY_SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          const isComplete = sectionStatus[sec.id as SurveySection];
          const displayTitle = sectionTitleMap[sec.id as SurveySection] || sec.title;

          return (
            <TouchableOpacity
              key={sec.id}
              style={[
                styles.tab,
                {
                  backgroundColor: isActive
                    ? theme.primary
                    : isComplete
                    ? theme.primaryLight
                    : theme.cardBg,
                  borderColor: isActive
                    ? theme.primary
                    : isComplete
                    ? theme.primary
                    : theme.cardBorder,
                },
              ]}
              onPress={() => onSelectSection(sec.id as SurveySection)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={sec.icon as any}
                size={16}
                color={isActive ? '#FFFFFF' : isComplete ? theme.primary : theme.textMuted}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive
                      ? '#FFFFFF'
                      : isComplete
                      ? theme.primary
                      : theme.textSecondary,
                    fontWeight: isActive ? '700' : '600',
                  },
                ]}
              >
                {displayTitle}
              </Text>

              {isComplete && !isActive && (
                <Ionicons name="checkmark-circle" size={14} color={theme.primary} style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 13,
  },
  checkIcon: {
    marginLeft: 6,
  },
});
