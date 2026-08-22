import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColorTheme } from '../theme/colors';
import { PalinAnswers } from '../types/palinSurvey';
import {
  calculatePalinScores,
  generatePalinSummaryText,
  palinFormSchema,
} from '../services/palinSurveyService';
import { saveSurveyResponseToFirestore } from '../services/firebase';
import { Language, i18n } from '../i18n/translations';
import { palinTranslationsEn } from '../i18n/palinTranslationsEn';

interface PalinResultsPageProps {
  answers: PalinAnswers;
  theme: ColorTheme;
  isDark: boolean;
  onToggleTheme: () => void;
  lang: Language;
  onToggleLanguage: () => void;
  onBackToSurvey: () => void;
  onResetSurvey: () => void;
  initialTab?: 'sbis' | 'palin' | 'both';
  onGoToQuizHub?: () => void;
}

export const PalinResultsPage: React.FC<PalinResultsPageProps> = ({
  answers,
  theme,
  isDark,
  onToggleTheme,
  lang,
  onToggleLanguage,
  onBackToSurvey,
  onResetSurvey,
  initialTab = 'sbis',
  onGoToQuizHub,
}) => {
  const [activeResultsTab, setActiveResultsTab] = useState<'sbis' | 'palin' | 'both'>(
    initialTab === 'both' ? 'sbis' : initialTab
  );
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const scores = calculatePalinScores(answers);
  const f1 = scores.factor1;
  const f2 = scores.factor2;
  const f3 = scores.factor3;
  const currentLang: Language = lang && i18n[lang] ? lang : 'ko';
  const t = i18n[currentLang];

  const handleSaveToCloud = async () => {
    try {
      setSaveStatus('saving');
      const docId = await saveSurveyResponseToFirestore({
        answers,
        scores,
        locale: lang,
        metadata: {
          platform: Platform.OS,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
        }
      });
      setSavedDocId(docId);
      setSaveStatus('saved');
    } catch (err) {
      console.error('Firebase save error:', err);
      setSaveStatus('error');
    }
  };

  const handleCopyText = () => {
    const text = generatePalinSummaryText(answers);
    if (Platform.OS === 'web') {
      try {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Clipboard copy error', err);
      }
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Top Navigation Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.chipBg }]}
          onPress={onGoToQuizHub || onBackToSurvey}
          activeOpacity={0.8}
        >
          <Ionicons name="grid-outline" size={18} color={theme.textPrimary} />
          <Text style={[styles.backBtnText, { color: theme.textPrimary }]}>
            {lang === 'en' ? 'Quiz Selection Hub' : '검사 선택 화면으로'}
          </Text>
        </TouchableOpacity>

        <View style={styles.headerRightActions}>
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Page Title Banner */}
        <View style={[styles.titleBanner, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
            <Ionicons name="analytics-sharp" size={14} color={theme.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.badgeText, { color: theme.primary }]}>
              {lang === 'en' ? 'Factor Analysis & Clinical Report' : '요인 분석 및 설문 결과'}
            </Text>
          </View>
          <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
            {activeResultsTab === 'sbis'
              ? (lang === 'en' ? 'SBIS Temperament Assessment Results' : 'SBIS 간편 행동억제기질검사 결과')
              : activeResultsTab === 'palin'
              ? (lang === 'en' ? 'Palin Parent Rating Scale Results' : 'Palin 부모평가지 검사 결과')
              : (lang === 'en' ? 'Comprehensive Palin & SBIS Results' : 'Palin & SBIS 종합 검사 결과')}
          </Text>
          <Text style={[styles.subTitle, { color: theme.textSecondary }]}>
            {lang === 'en'
              ? `Completed ${scores.totalAnsweredCount} of ${scores.totalQuestionsCount} questions`
              : `총 ${scores.totalQuestionsCount}문항 중 ${scores.totalAnsweredCount}문항 응답 완료`}
          </Text>

          {/* Results Segmented Tab Switcher */}
          <View style={[styles.resultsTabBar, { backgroundColor: theme.chipBg }]}>
            <TouchableOpacity
              style={[
                styles.resultsTabBtn,
                activeResultsTab === 'sbis' && { backgroundColor: '#8B5CF6' },
              ]}
              onPress={() => setActiveResultsTab('sbis')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="ribbon"
                size={14}
                color={activeResultsTab === 'sbis' ? '#FFFFFF' : theme.textSecondary}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.resultsTabText,
                  { color: activeResultsTab === 'sbis' ? '#FFFFFF' : theme.textSecondary, fontWeight: activeResultsTab === 'sbis' ? '800' : '600' },
                ]}
              >
                {lang === 'en' ? 'SBIS Results' : 'SBIS 결과'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.resultsTabBtn,
                activeResultsTab === 'palin' && { backgroundColor: theme.primary },
              ]}
              onPress={() => setActiveResultsTab('palin')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="analytics"
                size={14}
                color={activeResultsTab === 'palin' ? '#FFFFFF' : theme.textSecondary}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.resultsTabText,
                  { color: activeResultsTab === 'palin' ? '#FFFFFF' : theme.textSecondary, fontWeight: activeResultsTab === 'palin' ? '800' : '600' },
                ]}
              >
                {lang === 'en' ? 'Palin Results' : 'Palin 결과'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 1. SBIS SECTION CARD (RENDERED FOR 'sbis' OR 'both') */}
        {(activeResultsTab === 'sbis' || activeResultsTab === 'both') && (
          <View style={[styles.factorCard, { backgroundColor: theme.cardBg, borderColor: '#8B5CF6' }]}>
            <View style={styles.factorHeaderRow}>
              <View style={styles.factorTitleGroup}>
                <View style={[styles.factorBadge, { backgroundColor: '#8B5CF6' }]}>
                  <Text style={styles.factorBadgeText}>SBIS</Text>
                </View>
                <Text style={[styles.factorTitle, { color: theme.textPrimary }]}>
                  {lang === 'en'
                    ? 'Short Behavioral Inhibition Scale (SBIS)'
                    : '간편 행동억제기질검사 (SBIS)'}
                </Text>
              </View>
              <View style={[styles.scoreContainer, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                <Text style={[styles.factorScoreValue, { color: '#8B5CF6' }]}>
                  {scores.sbisTotalScore} / 25
                </Text>
                <Text style={{ fontSize: 11, fontWeight: '700', color: theme.textSecondary, textAlign: 'right' }}>
                  {lang === 'en' ? 'Points' : '점 (25점 만점)'}
                </Text>
              </View>
            </View>

            {/* SBIS Assessment Summary Box */}
            <View style={[styles.scaleAssessmentCard, { backgroundColor: 'rgba(139, 92, 246, 0.06)', borderColor: '#8B5CF6' }]}>
              <View style={styles.scaleAssessmentRow}>
                <Ionicons name="ribbon" size={18} color="#8B5CF6" />
                <Text style={[styles.scaleAssessmentTitle, { color: '#8B5CF6' }]}>
                  행동억제 기질 총점:
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '800', color: theme.textPrimary }}>
                  {scores.sbisTotalScore} / 25 점
                </Text>
              </View>
            </View>

            {/* SBIS Active Score Range Display (Only rendered when at least 1 question is answered and score > 0) */}
            {scores.sbis.answeredCount > 0 && scores.sbisTotalScore > 0 && (
              <View style={[styles.scaleAssessmentCard, { backgroundColor: 'rgba(139, 92, 246, 0.06)', borderColor: '#8B5CF6' }]}>
                <View style={styles.scaleAssessmentRow}>
                  <Ionicons name="podium" size={18} color="#8B5CF6" />
                  <Text style={[styles.scaleAssessmentTitle, { color: '#8B5CF6' }]}>
                    점수 구간 평가:
                  </Text>
                  <View style={[styles.inlineLevelTag, { backgroundColor: scores.sbis.rangeInfo.badgeColor }]}>
                    <Text style={styles.inlineLevelTagText}>
                      {scores.sbis.rangeInfo.rangeLabel}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: 8, padding: 12, borderRadius: 10, backgroundColor: theme.cardBg, borderWidth: 1, borderColor: theme.cardBorder }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: theme.textPrimary, marginBottom: 6 }}>
                    해당 점수 구간: {scores.sbis.rangeInfo.rangeLabel}
                  </Text>
                  {scores.sbis.rangeInfo.descriptionKr ? (
                    <Text style={{ fontSize: 13, color: theme.textPrimary, lineHeight: 21, fontWeight: '500' }}>
                      {scores.sbis.rangeInfo.descriptionKr}
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 20 }}>
                      현재 행동억제 기질 점수({scores.sbisTotalScore}점)는 <Text style={{ fontWeight: '700', color: theme.textPrimary }}>{scores.sbis.rangeInfo.rangeLabel}</Text> 구간에 해당합니다.
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {/* 2. PALIN CARDS (RENDERED FOR 'palin' OR 'both') */}
        {(activeResultsTab === 'palin' || activeResultsTab === 'both') && (
          <>
            {/* FACTOR 1 CARD (FEATURED) */}
            <View style={[styles.factorCard, { backgroundColor: theme.cardBg, borderColor: theme.primary }]}>
              <View style={styles.factorHeaderRow}>
                <View style={styles.factorTitleGroup}>
                  <View style={[styles.factorBadge, { backgroundColor: theme.primary }]}>
                    <Text style={styles.factorBadgeText}>Factor 1</Text>
                  </View>
                  <Text style={[styles.factorTitle, { color: theme.textPrimary }]}>
                    {lang === 'en' ? 'Factor 1 Weighted Average' : 'Factor 1 가중평균 점수'}
                  </Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={[styles.factorScoreValue, { color: theme.primary }]}>
                    {f1.score}
                  </Text>
                  <View style={[styles.levelBadge, { backgroundColor: f1.badgeColor }]}>
                    <Text style={styles.levelBadgeText}>
                      {lang === 'en' ? f1.levelLabelEn : f1.levelLabelKr}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Factor 1 Active Score Range Display (Shows ONLY the single active range for Factor 1) */}
              <View style={[styles.scaleAssessmentCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                <View style={styles.scaleAssessmentRow}>
                  <Ionicons name="pricetag" size={16} color={theme.primary} />
                  <Text style={[styles.scaleAssessmentTitle, { color: theme.primary }]}>
                    Factor 1 점수 구간 평가:
                  </Text>
                  <View style={[styles.inlineLevelTag, { backgroundColor: f1.rangeInfo.badgeColor }]}>
                    <Text style={styles.inlineLevelTagText}>
                      {f1.rangeInfo.rangeLabel}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: 8, padding: 12, borderRadius: 10, backgroundColor: theme.cardBg, borderWidth: 1, borderColor: theme.cardBorder }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: theme.textPrimary, marginBottom: 6 }}>
                    해당 점수 구간: {f1.rangeInfo.rangeLabel}
                  </Text>
                  {f1.rangeInfo.descriptionKr ? (
                    <Text style={{ fontSize: 13, color: theme.textPrimary, lineHeight: 21, fontWeight: '500' }}>
                      {f1.rangeInfo.descriptionKr}
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 20 }}>
                      현재 Factor 1 가중평균 점수({f1.score}점)는 <Text style={{ fontWeight: '700', color: theme.textPrimary }}>{f1.rangeInfo.rangeLabel}</Text> 구간에 해당합니다.
                    </Text>
                  )}
                </View>
              </View>
            </View>

        {/* FACTOR 2 CARD (FEATURED) */}
        <View style={[styles.factorCard, { backgroundColor: theme.cardBg, borderColor: theme.accent }]}>
          <View style={styles.factorHeaderRow}>
            <View style={styles.factorTitleGroup}>
              <View style={[styles.factorBadge, { backgroundColor: theme.accent }]}>
                <Text style={styles.factorBadgeText}>Factor 2</Text>
              </View>
              <Text style={[styles.factorTitle, { color: theme.textPrimary }]}>
                {lang === 'en' ? 'Factor 2 Weighted Average' : 'Factor 2 가중평균 점수'}
              </Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={[styles.factorScoreValue, { color: theme.accent }]}>
                {f2.score}
              </Text>
              <View style={[styles.levelBadge, { backgroundColor: f2.badgeColor }]}>
                <Text style={styles.levelBadgeText}>
                  {lang === 'en' ? f2.levelLabelEn : f2.levelLabelKr}
                </Text>
              </View>
            </View>
          </View>

          {/* Factor 2 Active Score Range Display (Shows ONLY the single active range for Factor 2) */}
          <View style={[styles.scaleAssessmentCard, { backgroundColor: theme.primaryLight, borderColor: theme.accent }]}>
            <View style={styles.scaleAssessmentRow}>
              <Ionicons name="pricetag" size={16} color={theme.accent} />
              <Text style={[styles.scaleAssessmentTitle, { color: theme.accent }]}>
                Factor 2 점수 구간 평가:
              </Text>
              <View style={[styles.inlineLevelTag, { backgroundColor: f2.rangeInfo.badgeColor }]}>
                <Text style={styles.inlineLevelTagText}>
                  {f2.rangeInfo.rangeLabel}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 8, padding: 12, borderRadius: 10, backgroundColor: theme.cardBg, borderWidth: 1, borderColor: theme.cardBorder }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: theme.textPrimary, marginBottom: 6 }}>
                해당 점수 구간: {f2.rangeInfo.rangeLabel}
              </Text>
              {f2.rangeInfo.descriptionKr ? (
                <Text style={{ fontSize: 13, color: theme.textPrimary, lineHeight: 21, fontWeight: '500' }}>
                  {f2.rangeInfo.descriptionKr}
                </Text>
              ) : (
                <Text style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 20 }}>
                  현재 Factor 2 가중평균 점수({f2.score}점)는 <Text style={{ fontWeight: '700', color: theme.textPrimary }}>{f2.rangeInfo.rangeLabel}</Text> 구간에 해당합니다.
                </Text>
              )}
            </View>
          </View>


        </View>

        {/* FACTOR 3 CARD (FEATURED) */}
        <View style={[styles.factorCard, { backgroundColor: theme.cardBg, borderColor: '#8B5CF6' }]}>
          <View style={styles.factorHeaderRow}>
            <View style={styles.factorTitleGroup}>
              <View style={[styles.factorBadge, { backgroundColor: '#8B5CF6' }]}>
                <Text style={styles.factorBadgeText}>Factor 3</Text>
              </View>
              <Text style={[styles.factorTitle, { color: theme.textPrimary }]}>
                {lang === 'en' ? 'Factor 3 Weighted Average' : 'Factor 3 가중평균 점수'}
              </Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={[styles.factorScoreValue, { color: '#8B5CF6' }]}>
                {f3.score}
              </Text>
              <View style={[styles.levelBadge, { backgroundColor: f3.badgeColor }]}>
                <Text style={styles.levelBadgeText}>
                  {lang === 'en' ? f3.levelLabelEn : f3.levelLabelKr}
                </Text>
              </View>
            </View>
          </View>

          {/* Factor 3 Active Score Range Display (Shows ONLY the single active range for Factor 3) */}
          <View style={[styles.scaleAssessmentCard, { backgroundColor: theme.primaryLight, borderColor: '#8B5CF6' }]}>
            <View style={styles.scaleAssessmentRow}>
              <Ionicons name="pricetag" size={16} color="#8B5CF6" />
              <Text style={[styles.scaleAssessmentTitle, { color: '#8B5CF6' }]}>
                Factor 3 점수 구간 평가:
              </Text>
              <View style={[styles.inlineLevelTag, { backgroundColor: f3.rangeInfo.badgeColor }]}>
                <Text style={styles.inlineLevelTagText}>
                  {f3.rangeInfo.rangeLabel}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 8, padding: 12, borderRadius: 10, backgroundColor: theme.cardBg, borderWidth: 1, borderColor: theme.cardBorder }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: theme.textPrimary, marginBottom: 6 }}>
                해당 점수 구간: {f3.rangeInfo.rangeLabel}
              </Text>
              {f3.rangeInfo.descriptionKr ? (
                <Text style={{ fontSize: 13, color: theme.textPrimary, lineHeight: 21, fontWeight: '500' }}>
                  {f3.rangeInfo.descriptionKr}
                </Text>
              ) : (
                <Text style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 20 }}>
                  현재 Factor 3 가중평균 점수({f3.score}점)는 <Text style={{ fontWeight: '700', color: theme.textPrimary }}>{f3.rangeInfo.rangeLabel}</Text> 구간에 해당합니다.
                </Text>
              )}
            </View>
          </View>


        </View>

        {/* OVERALL SUBSCALES SUMMARY */}
        <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={styles.infoCardHeader}>
            <Ionicons name="bar-chart" size={20} color={theme.primary} />
            <Text style={[styles.infoCardTitle, { color: theme.textPrimary }]}>{t.pprsTitle}</Text>
          </View>

          <View style={styles.subscaleRow}>
            <Text style={[styles.subscaleLabel, { color: theme.textPrimary }]}>{t.pprsSub1}</Text>
            <Text style={[styles.subscaleVal, { color: theme.primary }]}>{t.avgScore} {scores.pprsImpactAvg} / 10</Text>
          </View>
          <View style={styles.subscaleRow}>
            <Text style={[styles.subscaleLabel, { color: theme.textPrimary }]}>{t.pprsSub2}</Text>
            <Text style={[styles.subscaleVal, { color: theme.primary }]}>{t.avgScore} {scores.pprsConcernAvg} / 10</Text>
          </View>
          <View style={styles.subscaleRow}>
            <Text style={[styles.subscaleLabel, { color: theme.textPrimary }]}>{t.pprsSub3}</Text>
            <Text style={[styles.subscaleVal, { color: theme.primary }]}>{t.avgScore} {scores.pprsKnowledgeAvg} / 10</Text>
          </View>
          <View style={styles.subscaleRow}>
            <Text style={[styles.subscaleLabel, { color: theme.textPrimary }]}>{t.sbisTitle}</Text>
            <Text style={[styles.subscaleVal, { color: theme.accent }]}>{scores.sbisTotalScore} / 25 점</Text>
          </View>
        </View>
      </>
    )}

        {/* ACTION BUTTONS */}
        <View style={styles.actionsGroup}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor:
                  saveStatus === 'saved'
                    ? '#10B981'
                    : saveStatus === 'error'
                    ? '#EF4444'
                    : '#2563EB',
              },
            ]}
            onPress={handleSaveToCloud}
            disabled={saveStatus === 'saving' || saveStatus === 'saved'}
            activeOpacity={0.8}
          >
            <Ionicons
              name={
                saveStatus === 'saving'
                  ? 'sync'
                  : saveStatus === 'saved'
                  ? 'cloud-done'
                  : saveStatus === 'error'
                  ? 'alert-circle'
                  : 'cloud-upload-outline'
              }
              size={18}
              color="#FFF"
            />
            <Text style={styles.actionBtnText}>
              {saveStatus === 'saving'
                ? lang === 'en' ? 'Saving to Database...' : 'DB에 저장 중...'
                : saveStatus === 'saved'
                ? lang === 'en' ? 'Saved to Database!' : 'DB 저장 완료!'
                : saveStatus === 'error'
                ? lang === 'en' ? 'Error Saving (Check Config)' : '저장 실패 (설정 확인)'
                : lang === 'en' ? 'Save to Firebase Cloud DB' : '파이어베이스 클라우드 DB에 저장'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.primary }]}
            onPress={handleCopyText}
            activeOpacity={0.8}
          >
            <Ionicons name={copied ? 'checkmark-circle' : 'copy-outline'} size={18} color="#FFF" />
            <Text style={styles.actionBtnText}>{copied ? t.copied : t.copySummary}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.chipBg, borderColor: theme.cardBorder, borderWidth: 1 }]}
            onPress={onBackToSurvey}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={18} color={theme.textPrimary} />
            <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>
              {lang === 'en' ? 'Edit Responses' : '응답 수정하기'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.chipBg, borderColor: theme.cardBorder, borderWidth: 1 }]}
            onPress={onResetSurvey}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh-outline" size={18} color="#EF4444" />
            <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>{t.resetSurvey}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  scrollContent: {
    padding: 16,
    gap: 16,
    maxWidth: 750,
    width: '100%',
    alignSelf: 'center',
  },
  titleBanner: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  subTitle: {
    fontSize: 12,
    marginTop: 4,
  },
  factorCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 18,
  },
  factorHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  factorTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  factorBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  factorBadgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
  factorTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  scoreContainer: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  factorScoreValue: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'right',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  levelBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  scaleAssessmentCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  scaleAssessmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  scaleAssessmentTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  inlineLevelTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 4,
  },
  inlineLevelTagText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 4,
  },
  legendItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  legendLabel: {
    fontSize: 10,
  },
  legendRange: {
    fontSize: 9,
    marginTop: 2,
    fontWeight: '600',
  },
  tableSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  tableContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  th: {
    fontSize: 11,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  td: {
    fontSize: 12,
  },
  infoCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  infoCardDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  subscaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  subscaleLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  subscaleVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionsGroup: {
    gap: 10,
    marginTop: 8,
    marginBottom: 30,
  },
  actionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  resultsTabBar: {
    flexDirection: 'row',
    marginTop: 12,
    padding: 4,
    borderRadius: 12,
    gap: 4,
  },
  resultsTabBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  resultsTabText: {
    fontSize: 13,
  },
});
