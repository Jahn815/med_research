import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
import { Language, i18n } from '../i18n/translations';

interface PalinReportModalProps {
  visible: boolean;
  theme: ColorTheme;
  answers: PalinAnswers;
  onClose: () => void;
  onReset: () => void;
  lang?: Language;
}

export const PalinReportModal: React.FC<PalinReportModalProps> = ({
  visible,
  theme,
  answers,
  onClose,
  onReset,
  lang = 'ko',
}) => {
  const [copied, setCopied] = useState(false);
  const scores = calculatePalinScores(answers);
  const t = i18n[lang];

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
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={styles.headerTitleRow}>
            <Ionicons name="ribbon" size={24} color={theme.primary} />
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{t.palinReportTitle}</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Status Card */}
          <View style={[styles.statusCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <Text style={[styles.statusTitle, { color: theme.textPrimary }]}>
              {lang === 'en' ? 'Stuttering Child Parent Questionnaire' : palinFormSchema.title}
            </Text>
            <View style={styles.statusRow}>
              <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>{t.surveyStatus}:</Text>
              <Text style={[styles.statusValue, { color: theme.primary }]}>
                {scores.totalAnsweredCount} / {scores.totalQuestionsCount}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>{t.consentStatus}:</Text>
              <Text
                style={[
                  styles.statusValue,
                  { color: scores.consentAgreed ? theme.success : theme.warning, fontWeight: '700' },
                ]}
              >
                {scores.consentAgreed ? t.agreed : t.notAgreed}
              </Text>
            </View>
          </View>

          {/* Subscales Card 1: SBIS */}
          <View style={[styles.scoreCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.scoreHeader}>
              <Ionicons name="sparkles" size={20} color={theme.accent} />
              <Text style={[styles.scoreTitle, { color: theme.textPrimary }]}>{t.sbisTitle}</Text>
            </View>
            <Text style={[styles.scoreDesc, { color: theme.textSecondary }]}>{t.sbisDesc}</Text>
            <View style={styles.bigScoreRow}>
              <Text style={[styles.bigScore, { color: theme.accent }]}>{scores.sbisTotalScore}</Text>
              <Text style={[styles.bigScoreMax, { color: theme.textMuted }]}>/ 20</Text>
            </View>
          </View>

          {/* Subscales Card 2: PPRS Subscales */}
          <View style={[styles.scoreCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.scoreHeader}>
              <Ionicons name="analytics" size={20} color={theme.primary} />
              <Text style={[styles.scoreTitle, { color: theme.textPrimary }]}>{t.pprsTitle}</Text>
            </View>

            <View style={styles.subscaleRow}>
              <View style={styles.subscaleInfo}>
                <Text style={[styles.subscaleName, { color: theme.textPrimary }]}>{t.pprsSub1}</Text>
                <Text style={[styles.subscaleSub, { color: theme.textSecondary }]}>{t.pprsSub1Desc}</Text>
              </View>
              <View style={[styles.scorePill, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.scorePillText, { color: theme.primary }]}>
                  {t.avgScore} {scores.pprsImpactAvg}
                </Text>
              </View>
            </View>

            <View style={styles.subscaleRow}>
              <View style={styles.subscaleInfo}>
                <Text style={[styles.subscaleName, { color: theme.textPrimary }]}>{t.pprsSub2}</Text>
                <Text style={[styles.subscaleSub, { color: theme.textSecondary }]}>{t.pprsSub2Desc}</Text>
              </View>
              <View style={[styles.scorePill, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.scorePillText, { color: theme.primary }]}>
                  {t.avgScore} {scores.pprsConcernAvg}
                </Text>
              </View>
            </View>

            <View style={styles.subscaleRow}>
              <View style={styles.subscaleInfo}>
                <Text style={[styles.subscaleName, { color: theme.textPrimary }]}>{t.pprsSub3}</Text>
                <Text style={[styles.subscaleSub, { color: theme.textSecondary }]}>{t.pprsSub3Desc}</Text>
              </View>
              <View style={[styles.scorePill, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.scorePillText, { color: theme.primary }]}>
                  {t.avgScore} {scores.pprsKnowledgeAvg}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
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
              onPress={() => {
                onReset();
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
              <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>{t.resetSurvey}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  statusCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  scoreCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  scoreTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  scoreDesc: {
    fontSize: 12,
    marginBottom: 10,
  },
  bigScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  bigScore: {
    fontSize: 32,
    fontWeight: '900',
  },
  bigScoreMax: {
    fontSize: 16,
    fontWeight: '600',
  },
  subscaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  subscaleInfo: {
    flex: 1,
    marginRight: 8,
  },
  subscaleName: {
    fontSize: 13,
    fontWeight: '700',
  },
  subscaleSub: {
    fontSize: 11,
    marginTop: 2,
  },
  scorePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scorePillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  actionRow: {
    gap: 10,
    marginTop: 8,
    marginBottom: 24,
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
