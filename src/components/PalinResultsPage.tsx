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
}) => {
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
          onPress={onBackToSurvey}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color={theme.textPrimary} />
          <Text style={[styles.backBtnText, { color: theme.textPrimary }]}>
            {lang === 'en' ? 'Back to Survey' : '설문 수정으로 돌아가기'}
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
              {lang === 'en' ? 'Factor Analysis & Clinical Report' : '요인 분석 및 종합 결과'}
            </Text>
          </View>
          <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
            {lang === 'en' ? 'Palin Scale Survey Results' : 'Palin 부모평가지 설문 결과 보고서'}
          </Text>
          <Text style={[styles.subTitle, { color: theme.textSecondary }]}>
            {lang === 'en'
              ? `Completed ${scores.totalAnsweredCount} of ${scores.totalQuestionsCount} questions`
              : `총 ${scores.totalQuestionsCount}문항 중 ${scores.totalAnsweredCount}문항 응답 완료`}
          </Text>
        </View>

        {/* 1. SBIS SECTION CARD (FIRST PLACE) */}
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
                {lang === 'en' ? 'SBIS Temperament Total Score:' : '행동억제 기질 측정 결과:'}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '800', color: theme.textPrimary }}>
                {scores.sbisTotalScore} / 25 {lang === 'en' ? 'pts' : '점'}
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4, lineHeight: 18 }}>
              {lang === 'en'
                ? 'Each response option is scored from 1 point (first option) to 5 points (fifth option) for a total maximum of 25 points.'
                : '각 문항당 첫 번째 선택지는 1점, 마지막 선택지는 5점으로 계산되며 (문항별 1~5점), 총 25점 만점입니다.'}
            </Text>
          </View>

          {/* SBIS Itemized Breakdown Table */}
          <Text style={[styles.tableSectionTitle, { color: theme.textPrimary, marginTop: 8 }]}>
            {lang === 'en' ? 'SBIS 5-Item Response & Scoring Breakdown' : 'SBIS 5문항 응답 및 세부 점수 (문항별 1~5점)'}
          </Text>

          <View style={[styles.tableContainer, { borderColor: theme.cardBorder }]}>
            <View style={[styles.tableHeaderRow, { backgroundColor: theme.chipBg }]}>
              <Text style={[styles.th, { width: 45, color: theme.textSecondary }]}>{lang === 'en' ? 'Q#' : '문항'}</Text>
              <Text style={[styles.th, { flex: 1, color: theme.textSecondary }]}>{lang === 'en' ? 'Question & Response' : '문항 내용 및 선택한 답변'}</Text>
              <Text style={[styles.th, { width: 75, textAlign: 'right', color: theme.textSecondary }]}>{lang === 'en' ? 'Score' : '획득 점수'}</Text>
            </View>

            {scores.sbis.itemDetails.map((item, idx) => (
              <View
                key={item.qNum}
                style={[
                  styles.tableRow,
                  {
                    backgroundColor: idx % 2 === 0 ? theme.cardBg : theme.chipBg,
                    borderBottomColor: theme.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.td, { width: 45, fontWeight: '700', color: theme.textSecondary }]}>
                  Q{item.qNum}
                </Text>
                <View style={{ flex: 1, paddingRight: 6 }}>
                  <Text style={[styles.td, { fontWeight: '600', color: theme.textPrimary, fontSize: 12 }]} numberOfLines={2}>
                    {lang === 'en' ? item.textEn : item.text}
                  </Text>
                  <Text style={{ fontSize: 11, color: item.value !== null ? '#8B5CF6' : theme.textMuted, marginTop: 2, fontWeight: '700' }}>
                    {lang === 'en' ? 'Selected: ' : '선택한 답변: '}
                    {lang === 'en' ? item.selectedLabelEn : item.selectedLabel}
                    {item.value !== null ? ` (${item.score}${lang === 'en' ? ' pts' : '점'})` : ''}
                  </Text>
                </View>
                <Text style={[styles.td, { width: 75, textAlign: 'right', fontWeight: '900', color: '#8B5CF6', fontSize: 14 }]}>
                  {item.value !== null ? `${item.score} / ${lang === 'en' ? '5 pts' : '5점'}` : '-'}
                </Text>
              </View>
            ))}
          </View>
        </View>

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

          {/* Scale Assessment Box */}
          <View style={[styles.scaleAssessmentCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
            <View style={styles.scaleAssessmentRow}>
              <Ionicons name="pricetag" size={16} color={theme.primary} />
              <Text style={[styles.scaleAssessmentTitle, { color: theme.primary }]}>
                {lang === 'en' ? 'Factor 1 Category Rating:' : 'Factor 1 평가 카테고리:'}
              </Text>
              <View style={[styles.inlineLevelTag, { backgroundColor: f1.badgeColor }]}>
                <Text style={styles.inlineLevelTagText}>
                  {lang === 'en' ? f1.levelLabelEn : f1.levelLabelKr}
                </Text>
              </View>
            </View>

            {/* Threshold Legend Bar */}
            <View style={styles.legendRow}>
              {[
                { label: lang === 'en' ? 'Very High' : '매우 높음', range: '0 - 2.79', key: 'very_high', color: '#EF4444' },
                { label: lang === 'en' ? 'High' : '높음', range: '2.80 - 4.19', key: 'high', color: '#F97316' },
                { label: lang === 'en' ? 'Moderate' : '보통', range: '4.20 - 5.59', key: 'moderate', color: '#F59E0B' },
                { label: lang === 'en' ? 'Low' : '낮음', range: '5.60 - 6.69', key: 'low', color: '#10B981' },
                { label: lang === 'en' ? 'Very Low' : '매우 낮음', range: '> 6.69', key: 'very_low', color: '#059669' },
              ].map((item) => {
                const isActive = f1.levelKey === item.key;
                return (
                  <View
                    key={item.key}
                    style={[
                      styles.legendItem,
                      {
                        backgroundColor: isActive ? item.color : theme.chipBg,
                        borderColor: isActive ? item.color : theme.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.legendLabel,
                        { color: isActive ? '#FFFFFF' : theme.textPrimary, fontWeight: isActive ? '800' : '600' },
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.legendRange,
                        { color: isActive ? '#FFFFFF' : theme.textMuted },
                      ]}
                    >
                      {item.range}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Itemized Responses Table */}
          <Text style={[styles.tableSectionTitle, { color: theme.textPrimary }]}>
            {lang === 'en' ? 'Q22 - Q28 Individual Response Breakdown:' : 'Q22 ~ Q28 문항별 응답 및 가중치 내역:'}
          </Text>

          <View style={[styles.tableContainer, { borderColor: theme.cardBorder }]}>
            <View style={[styles.tableHeaderRow, { backgroundColor: theme.chipBg }]}>
              <Text style={[styles.th, { width: 45, color: theme.textSecondary }]}>문항</Text>
              <Text style={[styles.th, { flex: 1, color: theme.textSecondary }]}>질문 내용</Text>
              <Text style={[styles.th, { width: 50, textAlign: 'center', color: theme.textSecondary }]}>응답</Text>
              <Text style={[styles.th, { width: 55, textAlign: 'center', color: theme.textSecondary }]}>가중치</Text>
              <Text style={[styles.th, { width: 55, textAlign: 'right', color: theme.textSecondary }]}>가중값</Text>
            </View>

            {f1.itemDetails.map((item) => {
              const qText =
                lang === 'en' && palinTranslationsEn[item.qNum === 22 ? 1481741321 : item.qNum === 23 ? 1575572212 : item.qNum === 24 ? 107897978 : item.qNum === 25 ? 914545063 : item.qNum === 26 ? 146388951 : item.qNum === 27 ? 859143932 : 1623691428]
                  ? palinTranslationsEn[item.qNum === 22 ? 1481741321 : item.qNum === 23 ? 1575572212 : item.qNum === 24 ? 107897978 : item.qNum === 25 ? 914545063 : item.qNum === 26 ? 146388951 : item.qNum === 27 ? 859143932 : 1623691428].text
                  : item.text;

              return (
                <View key={item.qNum} style={[styles.tableRow, { borderBottomColor: theme.cardBorder }]}>
                  <Text style={[styles.td, { width: 45, fontWeight: '700', color: theme.primary }]}>
                    Q{item.qNum}
                  </Text>
                  <Text style={[styles.td, { flex: 1, color: theme.textPrimary }]} numberOfLines={2}>
                    {qText}
                  </Text>
                  <Text style={[styles.td, { width: 50, textAlign: 'center', fontWeight: '700', color: theme.textPrimary }]}>
                    {item.value !== null ? item.value : '-'}
                  </Text>
                  <Text style={[styles.td, { width: 55, textAlign: 'center', color: theme.textSecondary }]}>
                    {item.weight}
                  </Text>
                  <Text style={[styles.td, { width: 55, textAlign: 'right', fontWeight: '700', color: theme.accent }]}>
                    {item.value !== null ? item.weightedValue : '-'}
                  </Text>
                </View>
              );
            })}
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

          {/* Scale Assessment Box */}
          <View style={[styles.scaleAssessmentCard, { backgroundColor: theme.primaryLight, borderColor: theme.accent }]}>
            <View style={styles.scaleAssessmentRow}>
              <Ionicons name="pricetag" size={16} color={theme.accent} />
              <Text style={[styles.scaleAssessmentTitle, { color: theme.accent }]}>
                {lang === 'en' ? 'Factor 2 Category Rating:' : 'Factor 2 평가 카테고리:'}
              </Text>
              <View style={[styles.inlineLevelTag, { backgroundColor: f2.badgeColor }]}>
                <Text style={styles.inlineLevelTagText}>
                  {lang === 'en' ? f2.levelLabelEn : f2.levelLabelKr}
                </Text>
              </View>
            </View>

            {/* Threshold Legend Bar */}
            <View style={styles.legendRow}>
              {[
                { label: lang === 'en' ? 'Very High' : '매우 높음', range: '0 - 1.79', key: 'very_high', color: '#EF4444' },
                { label: lang === 'en' ? 'High' : '높음', range: '1.80 - 2.79', key: 'high', color: '#F97316' },
                { label: lang === 'en' ? 'Moderate' : '보통', range: '2.80 - 4.19', key: 'moderate', color: '#F59E0B' },
                { label: lang === 'en' ? 'Low' : '낮음', range: '4.20 - 5.39', key: 'low', color: '#10B981' },
                { label: lang === 'en' ? 'Very Low' : '매우 낮음', range: '> 5.39', key: 'very_low', color: '#059669' },
              ].map((item) => {
                const isActive = f2.levelKey === item.key;
                return (
                  <View
                    key={item.key}
                    style={[
                      styles.legendItem,
                      {
                        backgroundColor: isActive ? item.color : theme.chipBg,
                        borderColor: isActive ? item.color : theme.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.legendLabel,
                        { color: isActive ? '#FFFFFF' : theme.textPrimary, fontWeight: isActive ? '800' : '600' },
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.legendRange,
                        { color: isActive ? '#FFFFFF' : theme.textMuted },
                      ]}
                    >
                      {item.range}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Itemized Responses Table */}
          <Text style={[styles.tableSectionTitle, { color: theme.textPrimary }]}>
            {lang === 'en' ? 'Q29 - Q35 Individual Response Breakdown:' : 'Q29 ~ Q35 문항별 응답 및 가중치 내역:'}
          </Text>

          <View style={[styles.tableContainer, { borderColor: theme.cardBorder }]}>
            <View style={[styles.tableHeaderRow, { backgroundColor: theme.chipBg }]}>
              <Text style={[styles.th, { width: 45, color: theme.textSecondary }]}>문항</Text>
              <Text style={[styles.th, { flex: 1, color: theme.textSecondary }]}>질문 내용</Text>
              <Text style={[styles.th, { width: 50, textAlign: 'center', color: theme.textSecondary }]}>응답</Text>
              <Text style={[styles.th, { width: 55, textAlign: 'center', color: theme.textSecondary }]}>가중치</Text>
              <Text style={[styles.th, { width: 55, textAlign: 'right', color: theme.textSecondary }]}>가중값</Text>
            </View>

            {f2.itemDetails.map((item) => {
              const qIdMap: Record<number, number> = {
                29: 2094095092,
                30: 648032736,
                31: 740503268,
                32: 1050082798,
                33: 341804199,
                34: 905335102,
                35: 1048848859,
              };
              const targetId = qIdMap[item.qNum];
              const qText =
                lang === 'en' && targetId && palinTranslationsEn[targetId]
                  ? palinTranslationsEn[targetId].text
                  : item.text;

              return (
                <View key={item.qNum} style={[styles.tableRow, { borderBottomColor: theme.cardBorder }]}>
                  <Text style={[styles.td, { width: 45, fontWeight: '700', color: theme.accent }]}>
                    Q{item.qNum}
                  </Text>
                  <Text style={[styles.td, { flex: 1, color: theme.textPrimary }]} numberOfLines={2}>
                    {qText}
                  </Text>
                  <Text style={[styles.td, { width: 50, textAlign: 'center', fontWeight: '700', color: theme.textPrimary }]}>
                    {item.value !== null ? item.value : '-'}
                  </Text>
                  <Text style={[styles.td, { width: 55, textAlign: 'center', color: theme.textSecondary }]}>
                    {item.weight}
                  </Text>
                  <Text style={[styles.td, { width: 55, textAlign: 'right', fontWeight: '700', color: theme.primary }]}>
                    {item.value !== null ? item.weightedValue : '-'}
                  </Text>
                </View>
              );
            })}
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

          {/* Scale Assessment Box */}
          <View style={[styles.scaleAssessmentCard, { backgroundColor: theme.primaryLight, borderColor: '#8B5CF6' }]}>
            <View style={styles.scaleAssessmentRow}>
              <Ionicons name="pricetag" size={16} color="#8B5CF6" />
              <Text style={[styles.scaleAssessmentTitle, { color: '#8B5CF6' }]}>
                {lang === 'en' ? 'Factor 3 Category Rating:' : 'Factor 3 평가 카테고리:'}
              </Text>
              <View style={[styles.inlineLevelTag, { backgroundColor: f3.badgeColor }]}>
                <Text style={styles.inlineLevelTagText}>
                  {lang === 'en' ? f3.levelLabelEn : f3.levelLabelKr}
                </Text>
              </View>
            </View>

            {/* Threshold Legend Bar */}
            <View style={styles.legendRow}>
              {[
                { label: lang === 'en' ? 'Very High' : '매우 높음', range: '>= 6.60', key: 'very_high', color: '#059669' },
                { label: lang === 'en' ? 'High' : '높음', range: '5.60 - 6.59', key: 'high', color: '#10B981' },
                { label: lang === 'en' ? 'Moderate' : '보통', range: '4.10 - 5.59', key: 'moderate', color: '#F59E0B' },
                { label: lang === 'en' ? 'Low' : '낮음', range: '2.20 - 4.09', key: 'low', color: '#F97316' },
                { label: lang === 'en' ? 'Very Low' : '매우 낮음', range: '< 2.20', key: 'very_low', color: '#EF4444' },
              ].map((item) => {
                const isActive = f3.levelKey === item.key;
                return (
                  <View
                    key={item.key}
                    style={[
                      styles.legendItem,
                      {
                        backgroundColor: isActive ? item.color : theme.chipBg,
                        borderColor: isActive ? item.color : theme.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.legendLabel,
                        { color: isActive ? '#FFFFFF' : theme.textPrimary, fontWeight: isActive ? '800' : '600' },
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.legendRange,
                        { color: isActive ? '#FFFFFF' : theme.textMuted },
                      ]}
                    >
                      {item.range}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Itemized Responses Table */}
          <Text style={[styles.tableSectionTitle, { color: theme.textPrimary }]}>
            {lang === 'en' ? 'Q36 - Q40 Individual Response Breakdown:' : 'Q36 ~ Q40 문항별 응답 및 가중치 내역:'}
          </Text>

          <View style={[styles.tableContainer, { borderColor: theme.cardBorder }]}>
            <View style={[styles.tableHeaderRow, { backgroundColor: theme.chipBg }]}>
              <Text style={[styles.th, { width: 45, color: theme.textSecondary }]}>문항</Text>
              <Text style={[styles.th, { flex: 1, color: theme.textSecondary }]}>질문 내용</Text>
              <Text style={[styles.th, { width: 50, textAlign: 'center', color: theme.textSecondary }]}>응답</Text>
              <Text style={[styles.th, { width: 55, textAlign: 'center', color: theme.textSecondary }]}>가중치</Text>
              <Text style={[styles.th, { width: 55, textAlign: 'right', color: theme.textSecondary }]}>가중값</Text>
            </View>

            {f3.itemDetails.map((item) => {
              const qIdMap: Record<number, number> = {
                36: 1520832689,
                37: 1667221451,
                38: 1434469522,
                39: 493302818,
                40: 705539961,
              };
              const targetId = qIdMap[item.qNum];
              const qText =
                lang === 'en' && targetId && palinTranslationsEn[targetId]
                  ? palinTranslationsEn[targetId].text
                  : item.text;

              return (
                <View key={item.qNum} style={[styles.tableRow, { borderBottomColor: theme.cardBorder }]}>
                  <Text style={[styles.td, { width: 45, fontWeight: '700', color: '#8B5CF6' }]}>
                    Q{item.qNum}
                  </Text>
                  <Text style={[styles.td, { flex: 1, color: theme.textPrimary }]} numberOfLines={2}>
                    {qText}
                  </Text>
                  <Text style={[styles.td, { width: 50, textAlign: 'center', fontWeight: '700', color: theme.textPrimary }]}>
                    {item.value !== null ? item.value : '-'}
                  </Text>
                  <Text style={[styles.td, { width: 55, textAlign: 'center', color: theme.textSecondary }]}>
                    {item.weight}
                  </Text>
                  <Text style={[styles.td, { width: 55, textAlign: 'right', fontWeight: '700', color: theme.primary }]}>
                    {item.value !== null ? item.weightedValue : '-'}
                  </Text>
                </View>
              );
            })}
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
            <Text style={[styles.subscaleVal, { color: theme.accent }]}>{scores.sbisTotalScore} / 20</Text>
          </View>
        </View>

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
});
