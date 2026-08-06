import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColorTheme } from '../theme/colors';
import { PalinAnswers, PalinSection } from '../types/palinSurvey';
import {
  palinFormSchema,
  calculatePalinScores,
  getAllPalinQuestions,
} from '../services/palinSurveyService';
import { Language, i18n } from '../i18n/translations';
import {
  palinSectionTitlesEn,
  palinSubsectionsEn,
} from '../i18n/palinTranslationsEn';
import { PalinQuestionRenderer } from './PalinQuestionRenderer';
import { PalinReportModal } from './PalinReportModal';
import { PalinResultsPage } from './PalinResultsPage';

interface PalinSurveyViewProps {
  theme: ColorTheme;
  isDark: boolean;
  onToggleTheme: () => void;
  lang: Language;
  onToggleLanguage: () => void;
}

export const PalinSurveyView: React.FC<PalinSurveyViewProps> = ({
  theme,
  isDark,
  onToggleTheme,
  lang,
  onToggleLanguage,
}) => {
  const [activeSecIndex, setActiveSecIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<PalinAnswers>({});
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showResultsPage, setShowResultsPage] = useState<boolean>(false);

  const t = i18n[lang];
  const currentSection: PalinSection = palinFormSchema.sections[activeSecIndex];
  const allQuestions = useMemo(() => getAllPalinQuestions(), []);

  const handleAnswerChange = (questionId: number, val: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  };

  const handleReset = () => {
    setAnswers({});
    setActiveSecIndex(0);
    setShowResultsPage(false);
  };

  // Progress Calculation
  const progressPercent = useMemo(() => {
    const answeredCount = Object.keys(answers).filter(
      (k) => answers[Number(k)] !== undefined && answers[Number(k)] !== ''
    ).length;
    return Math.round((answeredCount / allQuestions.length) * 100);
  }, [answers, allQuestions]);

  const scores = calculatePalinScores(answers);

  const consentDescriptionEn = `<Research Consent Statement>
This study investigates the relationship between temperament in Korean children who stutter and the impact of stuttering on the child.
The Short Behavioral Inhibition Scale (SBIS) measures behavioral inhibition temperament, and the Palin Parent Rating Scale (PPRS) evaluates the impact of stuttering.
Completion of this survey takes approximately 10-15 minutes.
<Eligibility>
Parents of preschool or elementary school children diagnosed with stuttering (or recovered from past stuttering).
Your responses will be kept strictly anonymous and confidential.`;

  // IF RESULTS PAGE MODE IS ACTIVE, RENDER RESULTS PAGE
  if (showResultsPage) {
    return (
      <PalinResultsPage
        answers={answers}
        theme={theme}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        lang={lang}
        onToggleLanguage={onToggleLanguage}
        onBackToSurvey={() => setShowResultsPage(false)}
        onResetSurvey={handleReset}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Research Title Header Banner */}
      <View style={[styles.headerBanner, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
        <View style={styles.headerTop}>
          <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
            <Ionicons name="school" size={14} color={theme.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.badgeText, { color: theme.primary }]}>{t.researchBadge}</Text>
          </View>

          <View style={styles.headerActionBtns}>
            {/* Direct Jump to Results Page */}
            <TouchableOpacity
              style={[styles.resultsPageBtn, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
              onPress={() => setShowResultsPage(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="analytics-sharp" size={14} color={theme.primary} style={{ marginRight: 4 }} />
              <Text style={[styles.resultsPageBtnText, { color: theme.primary }]}>
                {lang === 'en' ? 'Results Page' : '결과 분석'}
              </Text>
            </TouchableOpacity>

            {/* Language Switch */}
            <TouchableOpacity
              style={[styles.langBtn, { backgroundColor: theme.chipBg, borderColor: theme.cardBorder }]}
              onPress={onToggleLanguage}
              activeOpacity={0.7}
            >
              <Text style={[styles.langBtnText, { color: theme.textPrimary }]}>
                {lang === 'ko' ? '🇺🇸 EN' : '🇰🇷 KR'}
              </Text>
            </TouchableOpacity>

            {/* Theme Switch */}
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: theme.chipBg }]}
              onPress={onToggleTheme}
              activeOpacity={0.7}
            >
              <Ionicons name={isDark ? 'sunny' : 'moon'} size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
          {lang === 'en' ? 'Stuttering Child Parent Questionnaire' : palinFormSchema.title}
        </Text>
        <Text style={[styles.subTitle, { color: theme.textSecondary }]}>{t.appSubtitle}</Text>

        {/* Progress Bar */}
        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>
            {t.progressLabel}: {progressPercent}% ({scores.totalAnsweredCount}/{scores.totalQuestionsCount})
          </Text>
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

      {/* Section Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {palinFormSchema.sections.map((sec, idx) => {
            const isActive = idx === activeSecIndex;
            const secTitle = lang === 'en' && palinSectionTitlesEn[idx] ? palinSectionTitlesEn[idx] : sec.title;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.tab,
                  {
                    backgroundColor: isActive ? theme.primary : theme.cardBg,
                    borderColor: isActive ? theme.primary : theme.cardBorder,
                  },
                ]}
                onPress={() => setActiveSecIndex(idx)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive ? '#FFFFFF' : theme.textPrimary,
                      fontWeight: isActive ? '700' : '600',
                    },
                  ]}
                >
                  {secTitle}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Questions Content */}
      <ScrollView contentContainerStyle={styles.questionsContainer} showsVerticalScrollIndicator={false}>
        {/* Consent Info Box for Section 1 */}
        {activeSecIndex === 0 && (
          <View style={[styles.consentCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.consentHeader}>
              <Ionicons name="shield-checkmark" size={22} color={theme.primary} />
              <Text style={[styles.consentTitle, { color: theme.textPrimary }]}>
                {lang === 'en' ? 'Research Participation Consent' : '연구 참여 안내 및 동의서'}
              </Text>
            </View>
            <Text style={[styles.consentBody, { color: theme.textSecondary }]}>
              {lang === 'en' ? consentDescriptionEn : palinFormSchema.description}
            </Text>
          </View>
        )}

        {/* Notice if user selected No to consent */}
        {activeSecIndex === 0 && answers[1536400327] === 1 && (
          <View style={[styles.warningBox, { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }]}>
            <Ionicons name="alert-circle" size={20} color="#DC2626" />
            <Text style={styles.warningText}>
              {lang === 'en'
                ? 'Consent is required to proceed with this research study.'
                : '연구에 동의하지 않으신 경우, 다음 단계로 진행하실 수 없습니다.'}
            </Text>
          </View>
        )}

        {/* Subsections if any */}
        {currentSection.subsections && currentSection.subsections.length > 0 && (
          <View style={styles.subsectionsBox}>
            {currentSection.subsections.map((sub, sidx) => {
              const subTitle = lang === 'en' && palinSubsectionsEn[sidx] ? palinSubsectionsEn[sidx] : sub.title;
              return (
                <View key={sidx} style={[styles.subCard, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.subCardTitle, { color: theme.primary }]}>{subTitle}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Question List */}
        {currentSection.questions.map((q) => (
          <PalinQuestionRenderer
            key={q.id}
            question={q}
            value={answers[q.id]}
            onChange={(val) => handleAnswerChange(q.id, val)}
            theme={theme}
            lang={lang}
          />
        ))}

        {/* Bottom Nav inside Scroll */}
        <View style={styles.bottomNavRow}>
          {activeSecIndex > 0 && (
            <TouchableOpacity
              style={[styles.btn, styles.prevBtn, { borderColor: theme.cardBorder }]}
              onPress={() => setActiveSecIndex((prev) => prev - 1)}
            >
              <Ionicons name="chevron-back" size={18} color={theme.textPrimary} />
              <Text style={[styles.btnText, { color: theme.textPrimary }]}>{t.prevSection}</Text>
            </TouchableOpacity>
          )}

          {activeSecIndex < palinFormSchema.sections.length - 1 ? (
            <TouchableOpacity
              style={[styles.btn, styles.nextBtn, { backgroundColor: theme.primary, flex: 1 }]}
              onPress={() => setActiveSecIndex((prev) => prev + 1)}
            >
              <Text style={[styles.btnText, { color: '#FFFFFF', fontWeight: '700' }]}>{t.nextSection}</Text>
              <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.btn, styles.nextBtn, { backgroundColor: theme.primary, flex: 1 }]}
              onPress={() => setShowResultsPage(true)}
            >
              <Ionicons name="analytics" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={[styles.btnText, { color: '#FFFFFF', fontWeight: '800' }]}>
                {lang === 'en' ? 'View Results & Factor Analysis' : '결과 보고서 및 요인분석 보기'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Report Modal */}
      <PalinReportModal
        visible={showReportModal}
        theme={theme}
        answers={answers}
        onClose={() => setShowReportModal(false)}
        onReset={handleReset}
        lang={lang}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBanner: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 14 : 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  headerActionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultsPageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  resultsPageBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  langBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 12,
    marginTop: 2,
  },
  progressRow: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  tabsContainer: {
    paddingVertical: 10,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 13,
  },
  questionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    maxWidth: 750,
    width: '100%',
    alignSelf: 'center',
  },
  consentCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  consentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  consentBody: {
    fontSize: 13,
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: 16,
  },
  warningText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  subsectionsBox: {
    gap: 8,
    marginBottom: 16,
  },
  subCard: {
    padding: 12,
    borderRadius: 12,
  },
  subCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  bottomNavRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  prevBtn: {
    borderWidth: 1,
  },
  nextBtn: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
