import React, { useState, useMemo, useEffect } from 'react';
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
  const [resultsInitialTab, setResultsInitialTab] = useState<'sbis' | 'palin' | 'both'>('both');

  const isConsentYes = answers[1536400327] === 0;
  const isConsentNo = answers[1536400327] === 1;
  const isLocked = !isConsentYes;

  useEffect(() => {
    if (isLocked && activeSecIndex !== 0) {
      setActiveSecIndex(0);
    }
  }, [isLocked, activeSecIndex]);

  const currentLang: Language = lang && i18n[lang] ? lang : 'ko';
  const t = i18n[currentLang];
  const allQuestions = useMemo(() => getAllPalinQuestions(), []);

  const sbisIds = [2015490662, 1544182638, 1140751121, 2129570078, 676432939];
  const sbisAnsweredCount = useMemo(() => {
    return sbisIds.filter((id) => answers[id] !== undefined && answers[id] !== '').length;
  }, [answers]);

  const palinIds = [
    1481741321, 1575572212, 107897978, 914545063, 146388951, 859143932, 1623691428, 2094095092, 648032736, 740503268,
    1050082798, 341804199, 905335102, 1048848859, 1520832689, 1667221451, 1434469522, 493302818, 705539961,
  ];
  const palinAnsweredCount = useMemo(() => {
    return palinIds.filter((id) => answers[id] !== undefined && answers[id] !== '').length;
  }, [answers]);

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

  const customTabs = [
    { id: 0, title: lang === 'en' ? '1. Consent' : '1. 연구 동의' },
    { id: 1, title: lang === 'en' ? '2. Background Info' : '2. 아동 배경정보' },
    { id: 2, title: lang === 'en' ? '3. Quiz Hub' : '3. 검사 선택' },
    { id: 3, title: lang === 'en' ? '4. SBIS Quiz (5 Qs)' : '4. SBIS 기질검사 (5문항)' },
    { id: 4, title: lang === 'en' ? '5. Palin PPRS (19 Qs)' : '5. Palin 부모평가지 (19문항)' },
  ];

  const openResultsWithTab = (tab: 'sbis' | 'palin' | 'both') => {
    setResultsInitialTab(tab);
    setShowResultsPage(true);
  };

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
        initialTab={resultsInitialTab}
        onGoToQuizHub={() => {
          setShowResultsPage(false);
          setActiveSecIndex(2);
        }}
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
              style={[
                styles.resultsPageBtn,
                {
                  backgroundColor: isLocked ? theme.chipBg : theme.primaryLight,
                  borderColor: isLocked ? theme.cardBorder : theme.primary,
                  opacity: isLocked ? 0.5 : 1,
                },
              ]}
              onPress={() => {
                if (!isLocked) openResultsWithTab('both');
              }}
              disabled={isLocked}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isLocked ? 'lock-closed' : 'analytics-sharp'}
                size={14}
                color={isLocked ? theme.textMuted : theme.primary}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.resultsPageBtnText, { color: isLocked ? theme.textMuted : theme.primary }]}>
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

      {/* Section Navigation Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {customTabs.map((tab) => {
            const isActive = tab.id === activeSecIndex;
            const isTabLocked = tab.id > 0 && isLocked;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  {
                    backgroundColor: isActive ? theme.primary : theme.cardBg,
                    borderColor: isActive ? theme.primary : theme.cardBorder,
                    opacity: isTabLocked ? 0.4 : 1,
                  },
                ]}
                onPress={() => {
                  if (!isTabLocked) setActiveSecIndex(tab.id);
                }}
                disabled={isTabLocked}
                activeOpacity={0.8}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {isTabLocked && (
                    <Ionicons name="lock-closed" size={12} color={theme.textMuted} style={{ marginRight: 4 }} />
                  )}
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: isActive ? '#FFFFFF' : isTabLocked ? theme.textMuted : theme.textPrimary,
                        fontWeight: isActive ? '700' : '600',
                      },
                    ]}
                  >
                    {tab.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Questions & Content Container */}
      <ScrollView contentContainerStyle={styles.questionsContainer} showsVerticalScrollIndicator={false}>
        {/* PAGE 1 (TAB 0): RESEARCH CONSENT ONLY */}
        {activeSecIndex === 0 && (
          <>
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

            {/* Question 1: Research Consent */}
            {palinFormSchema.sections[0].questions.map((q) => (
              <PalinQuestionRenderer
                key={q.id}
                question={q}
                displayNumber={1}
                hideBadge={true}
                value={answers[q.id]}
                onChange={(val) => handleAnswerChange(q.id, val)}
                theme={theme}
                lang={lang}
              />
            ))}

            {/* Warning Box if user selected No or has not consented */}
            {isConsentNo && (
              <View style={[styles.warningBox, { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', paddingVertical: 14 }]}>
                <Ionicons name="lock-closed" size={22} color="#DC2626" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.warningText, { fontSize: 14, fontWeight: '800' }]}>
                    {lang === 'en' ? 'Survey Locked' : '설문 진행이 잠겼습니다'}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#991B1B', marginTop: 2, lineHeight: 16 }}>
                    {lang === 'en'
                      ? 'Consent is required to proceed with this research study. Remaining questions and sections are locked until you select "Yes" (예).'
                      : '연구 참여에 동의("예")하셔야 다음 설문 항목을 진행하실 수 있습니다. 동의 여부를 "예"로 변경하시면 잠금이 해제됩니다.'}
                  </Text>
                </View>
              </View>
            )}

            {/* Navigation Button Below Consent Question */}
            <View style={styles.bottomNavRow}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.nextBtn,
                  {
                    backgroundColor: !isConsentYes ? '#9CA3AF' : theme.primary,
                    flex: 1,
                    opacity: !isConsentYes ? 0.6 : 1,
                  },
                ]}
                onPress={() => {
                  if (isConsentYes) setActiveSecIndex(1);
                }}
                disabled={!isConsentYes}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={!isConsentYes ? 'lock-closed' : 'arrow-forward-circle-outline'}
                  size={20}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.btnText, { color: '#FFFFFF', fontWeight: '800', fontSize: 15 }]}>
                  {!isConsentYes
                    ? (lang === 'en' ? 'Consent Required to Proceed' : '다음 단계로 이동 불가 (동의 필요)')
                    : (lang === 'en' ? 'Next: Child Background Info' : '다음: 아동 배경정보 작성하기')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* PAGE 2 (TAB 1): CHILD BACKGROUND INFORMATION (Q1 ~ Q15) */}
        {activeSecIndex === 1 && (
          <>
            <View style={[styles.subCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary, borderWidth: 1, marginBottom: 16 }]}>
              <Text style={[styles.subCardTitle, { color: theme.primary, fontSize: 15 }]}>
                📋 {lang === 'en' ? 'Child Background Information (Q1 ~ Q15)' : '아동 배경정보 (1 ~ 15번 문항)'}
              </Text>
            </View>

            {/* Questions for Section 1 (Q1 ~ Q15) */}
            {palinFormSchema.sections[1].questions.map((q, idx) => (
              <PalinQuestionRenderer
                key={q.id}
                question={q}
                displayNumber={idx + 1}
                value={answers[q.id]}
                onChange={(val) => handleAnswerChange(q.id, val)}
                theme={theme}
                lang={lang}
              />
            ))}

            {/* Bottom Nav for Tab 1 */}
            <View style={styles.bottomNavRow}>
              <TouchableOpacity
                style={[styles.btn, styles.prevBtn, { borderColor: theme.cardBorder }]}
                onPress={() => setActiveSecIndex(0)}
              >
                <Ionicons name="chevron-back" size={18} color={theme.textPrimary} />
                <Text style={[styles.btnText, { color: theme.textPrimary }]}>
                  {lang === 'en' ? 'Prev: Consent' : '이전: 연구 동의'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.nextBtn,
                  {
                    backgroundColor: isLocked ? '#9CA3AF' : theme.primary,
                    flex: 1,
                    opacity: isLocked ? 0.7 : 1,
                  },
                ]}
                onPress={() => {
                  if (!isLocked) setActiveSecIndex(2);
                }}
                disabled={isLocked}
              >
                <Ionicons
                  name={isLocked ? 'lock-closed' : 'grid-outline'}
                  size={18}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.btnText, { color: '#FFFFFF', fontWeight: '800' }]}>
                  {lang === 'en' ? 'Next: Choose Quiz' : '다음: 검사 선택 화면으로'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* TAB 2: QUIZ SELECTION HUB */}
        {activeSecIndex === 2 && (
          <View style={{ gap: 16 }}>
            {/* Hub Banner */}
            <View style={[styles.consentCard, { backgroundColor: theme.cardBg, borderColor: theme.primary }]}>
              <View style={styles.consentHeader}>
                <Ionicons name="grid-sharp" size={24} color={theme.primary} />
                <Text style={[styles.consentTitle, { color: theme.textPrimary, fontSize: 17 }]}>
                  {lang === 'en' ? 'Select Survey Quiz to Complete' : '진행할 검사를 선택하세요'}
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 20, marginTop: 4 }}>
                {lang === 'en'
                  ? 'You can choose to take SBIS (5 questions) or Palin PPRS (19 questions) independently.'
                  : 'SBIS 기질검사와 Palin 부모평가지 중 원하시는 검사를 선택하여 진행할 수 있습니다.'}
              </Text>
            </View>

            {/* Quiz Choice 1: SBIS Only */}
            <View style={[styles.quizChoiceCard, { backgroundColor: theme.cardBg, borderColor: '#8B5CF6' }]}>
              <View style={styles.quizChoiceHeader}>
                <View style={[styles.quizChoiceBadge, { backgroundColor: '#8B5CF6' }]}>
                  <Ionicons name="ribbon" size={14} color="#FFF" />
                  <Text style={styles.quizChoiceBadgeText}>5문항</Text>
                </View>
                <Text style={[styles.quizChoiceTitle, { color: theme.textPrimary }]}>
                  {lang === 'en' ? 'SBIS Quiz' : 'SBIS 기질검사'}
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 12, lineHeight: 18 }}>
                낯선 사람이나 장소에 대한 아동의 행동억제 기질을 측정합니다. (5문항 완료 후 SBIS 결과 확인)
              </Text>
              <View style={styles.quizStatusRow}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: sbisAnsweredCount === 5 ? '#10B981' : theme.textSecondary }}>
                  진행 상태: {sbisAnsweredCount} / 5 문항 완료 {sbisAnsweredCount === 5 ? '✓' : ''}
                </Text>
              </View>
              <View style={styles.quizChoiceBtnRow}>
                <TouchableOpacity
                  style={[styles.quizActionBtn, { backgroundColor: '#8B5CF6' }]}
                  onPress={() => setActiveSecIndex(3)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="play-circle-outline" size={18} color="#FFF" />
                  <Text style={styles.quizActionBtnText}>SBIS 검사 시작</Text>
                </TouchableOpacity>

                {sbisAnsweredCount > 0 && (
                  <TouchableOpacity
                    style={[styles.quizResultBtn, { borderColor: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}
                    onPress={() => openResultsWithTab('sbis')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="analytics-outline" size={16} color="#8B5CF6" />
                    <Text style={[styles.quizResultBtnText, { color: '#8B5CF6' }]}>SBIS 결과 보기</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Quiz Choice 2: Palin Only */}
            <View style={[styles.quizChoiceCard, { backgroundColor: theme.cardBg, borderColor: theme.primary }]}>
              <View style={styles.quizChoiceHeader}>
                <View style={[styles.quizChoiceBadge, { backgroundColor: theme.primary }]}>
                  <Ionicons name="analytics" size={14} color="#FFF" />
                  <Text style={styles.quizChoiceBadgeText}>19문항</Text>
                </View>
                <Text style={[styles.quizChoiceTitle, { color: theme.textPrimary }]}>
                  {lang === 'en' ? 'Palin PPRS Quiz' : 'Palin 부모평가지'}
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 12, lineHeight: 18 }}>
                말더듬이 아동과 부모에게 미치는 영향, 걱정 정도, 말더듬 관리 지식 및 자신감을 평가합니다. (19문항 완료 후 Palin 결과 확인)
              </Text>
              <View style={styles.quizStatusRow}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: palinAnsweredCount === 19 ? '#10B981' : theme.textSecondary }}>
                  진행 상태: {palinAnsweredCount} / 19 문항 완료 {palinAnsweredCount === 19 ? '✓' : ''}
                </Text>
              </View>
              <View style={styles.quizChoiceBtnRow}>
                <TouchableOpacity
                  style={[styles.quizActionBtn, { backgroundColor: theme.primary }]}
                  onPress={() => setActiveSecIndex(4)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="play-circle-outline" size={18} color="#FFF" />
                  <Text style={styles.quizActionBtnText}>Palin 검사 시작</Text>
                </TouchableOpacity>

                {palinAnsweredCount > 0 && (
                  <TouchableOpacity
                    style={[styles.quizResultBtn, { borderColor: theme.primary, backgroundColor: theme.primaryLight }]}
                    onPress={() => openResultsWithTab('palin')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="analytics-outline" size={16} color={theme.primary} />
                    <Text style={[styles.quizResultBtnText, { color: theme.primary }]}>Palin 결과 보기</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Bottom Back Button */}
            <View style={styles.bottomNavRow}>
              <TouchableOpacity
                style={[styles.btn, styles.prevBtn, { borderColor: theme.cardBorder }]}
                onPress={() => setActiveSecIndex(1)}
              >
                <Ionicons name="chevron-back" size={18} color={theme.textPrimary} />
                <Text style={[styles.btnText, { color: theme.textPrimary }]}>이전: 아동 배경정보</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 3: SBIS QUIZ (S1 ~ S5) */}
        {activeSecIndex === 3 && (
          <>
            <View style={[styles.subCard, { backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: '#8B5CF6', borderWidth: 1, marginBottom: 16 }]}>
              <Text style={[styles.subCardTitle, { color: '#8B5CF6', fontSize: 15 }]}>
                🟣 SBIS 간편 행동억제기질검사 (S1 ~ S5번 문항)
              </Text>
            </View>

            {palinFormSchema.sections[2].questions.map((q, idx) => (
              <PalinQuestionRenderer
                key={q.id}
                question={q}
                displayNumber={idx + 1}
                prefix="S"
                value={answers[q.id]}
                onChange={(val) => handleAnswerChange(q.id, val)}
                theme={theme}
                lang={lang}
              />
            ))}

            <View style={styles.bottomNavRow}>
              <TouchableOpacity
                style={[styles.btn, styles.prevBtn, { borderColor: theme.cardBorder }]}
                onPress={() => setActiveSecIndex(2)}
              >
                <Ionicons name="chevron-back" size={18} color={theme.textPrimary} />
                <Text style={[styles.btnText, { color: theme.textPrimary }]}>검사 선택으로</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#8B5CF6', flex: 1 }]}
                onPress={() => openResultsWithTab('sbis')}
              >
                <Ionicons name="analytics" size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={[styles.btnText, { color: '#FFF', fontWeight: '800' }]}>SBIS 결과 확인하기</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* TAB 4: PALIN PPRS QUIZ (P1 ~ P19) */}
        {activeSecIndex === 4 && (
          <>
            <View style={[styles.subCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary, borderWidth: 1, marginBottom: 16 }]}>
              <Text style={[styles.subCardTitle, { color: theme.primary, fontSize: 15 }]}>
                🔵 Palin 부모평가지 (PPRS) (P1 ~ P19번 문항)
              </Text>
            </View>

            {palinFormSchema.sections[3].questions.map((q, idx) => (
              <PalinQuestionRenderer
                key={q.id}
                question={q}
                displayNumber={idx + 1}
                prefix="P"
                value={answers[q.id]}
                onChange={(val) => handleAnswerChange(q.id, val)}
                theme={theme}
                lang={lang}
              />
            ))}

            <View style={styles.bottomNavRow}>
              <TouchableOpacity
                style={[styles.btn, styles.prevBtn, { borderColor: theme.cardBorder }]}
                onPress={() => setActiveSecIndex(2)}
              >
                <Ionicons name="chevron-back" size={18} color={theme.textPrimary} />
                <Text style={[styles.btnText, { color: theme.textPrimary }]}>검사 선택으로</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: theme.primary, flex: 1 }]}
                onPress={() => openResultsWithTab('palin')}
              >
                <Ionicons name="analytics" size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={[styles.btnText, { color: '#FFF', fontWeight: '800' }]}>Palin 결과 확인하기</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    fontSize: 17,
    fontWeight: '800',
  },
  consentBody: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '500',
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
  quizChoiceCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  quizChoiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  quizChoiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  quizChoiceBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  quizChoiceTitle: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  quizStatusRow: {
    marginBottom: 12,
  },
  quizChoiceBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quizActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  quizActionBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  quizResultBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  quizResultBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
