import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColorTheme } from '../theme/colors';
import { SurveyState } from '../types/survey';
import {
  ONSET_AGE_OPTIONS,
  ONSET_SPEED_OPTIONS,
  SYMPTOM_OPTIONS,
  SITUATION_OPTIONS,
  REACTION_OPTIONS,
  AVOIDANCE_OPTIONS,
  FAMILY_HISTORY_OPTIONS,
} from '../constants/surveyData';

interface SummaryModalProps {
  visible: boolean;
  theme: ColorTheme;
  surveyData: SurveyState;
  onClose: () => void;
  onReset: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  visible,
  theme,
  surveyData,
  onClose,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const getLabel = (options: { label: string; value: string }[], value: string) => {
    return options.find((opt) => opt.value === value)?.label || value || '미입력';
  };

  const generateReportText = (): string => {
    const { childInfo, onset, situations, family } = surveyData;

    const symptomLabels = onset.symptoms
      .map((id) => SYMPTOM_OPTIONS.find((s) => s.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    const situationLabels = situations.worseningSituations
      .map((id) => SITUATION_OPTIONS.find((s) => s.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    const reactionLabels = situations.childReaction
      .map((id) => REACTION_OPTIONS.find((r) => r.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    return `[말더듬아동 부모 설문지 결과 요약]
    
1. 기본 정보
- 아동 이름: ${childInfo.childName || '미입력'}
- 생년월일/연령: ${childInfo.birthDate || '미입력'} (${childInfo.ageMonths || '-'}개월)
- 성별: ${childInfo.gender === 'male' ? '남아' : childInfo.gender === 'female' ? '여아' : '미입력'}
- 작성자: ${childInfo.respondentRole || '미입력'}
- 작성일자: ${childInfo.surveyDate || '미입력'}

2. 말더듬 시작 및 증상
- 시작 시기: ${getLabel(ONSET_AGE_OPTIONS, onset.onsetAge)}
- 시작 양상: ${getLabel(ONSET_SPEED_OPTIONS, onset.onsetSpeed)}
- 주요 증상: ${symptomLabels || '없음/미선택'}
- 말더듬 심도 평가: ${onset.severityRating}점 / 5점

3. 상황별 양상 및 반응
- 악화 상황: ${situationLabels || '없음/미선택'}
- 아동의 반응: ${reactionLabels || '없음/미선택'}
- 말하기 회피 여부: ${getLabel(AVOIDANCE_OPTIONS, situations.avoidanceBehavior)}

4. 가족력 및 부모 소견
- 말더듬 가족력: ${getLabel(FAMILY_HISTORY_OPTIONS, family.familyHistory)}
- 부모 걱정 정도: ${family.parentConcernLevel}점 / 5점
- 상담 요청사항: ${family.therapistNotes || '특이사항 없음'}
`;
  };

  const handleCopyText = () => {
    const text = generateReportText();
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
            <Ionicons name="document-text" size={24} color={theme.primary} />
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>설문 결과 보고서</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Card 1: Basic Info */}
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-circle" size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>1. 기본 정보</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>아동 이름</Text>
              <Text style={[styles.value, { color: theme.textPrimary }]}>{surveyData.childInfo.childName || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>생년월일 (개월 수)</Text>
              <Text style={[styles.value, { color: theme.textPrimary }]}>
                {surveyData.childInfo.birthDate || '-'} {surveyData.childInfo.ageMonths ? `(${surveyData.childInfo.ageMonths}개월)` : ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>성별</Text>
              <Text style={[styles.value, { color: theme.textPrimary }]}>
                {surveyData.childInfo.gender === 'male' ? '남아' : surveyData.childInfo.gender === 'female' ? '여아' : '-'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>작성자 / 작성일</Text>
              <Text style={[styles.value, { color: theme.textPrimary }]}>
                {surveyData.childInfo.respondentRole || '-'} / {surveyData.childInfo.surveyDate || '-'}
              </Text>
            </View>
          </View>

          {/* Card 2: Onset */}
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>2. 말더듬 시작 및 증상</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>시작 시기</Text>
              <Text style={[styles.value, { color: theme.textPrimary }]}>
                {getLabel(ONSET_AGE_OPTIONS, surveyData.onset.onsetAge)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>시작 양상</Text>
              <Text style={[styles.value, { color: theme.textPrimary }]}>
                {getLabel(ONSET_SPEED_OPTIONS, surveyData.onset.onsetSpeed)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>주요 증상</Text>
              <Text style={[styles.value, { color: theme.textPrimary }]}>
                {surveyData.onset.symptoms
                  .map((id) => SYMPTOM_OPTIONS.find((s) => s.id === id)?.label)
                  .filter(Boolean)
                  .join(', ') || '선택 없음'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>주관적 심도</Text>
              <Text style={[styles.value, { color: theme.primary, fontWeight: '700' }]}>
                {surveyData.onset.severityRating}점 / 5점
              </Text>
            </View>
          </View>

          {/* Card 3: Situations */}
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="chatbubbles" size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>3. 상황별 양상 및 반응</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>악화 상황</Text>
              <Text style={[styles.value, { color: theme.textPrimary }]}>
                {surveyData.situations.worseningSituations
                  .map((id) => SITUATION_OPTIONS.find((s) => s.id === id)?.label)
                  .filter(Boolean)
                  .join(', ') || '선택 없음'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>아동의 반응</Text>
              <Text style={[styles.value, { color: theme.textPrimary }]}>
                {surveyData.situations.childReaction
                  .map((id) => REACTION_OPTIONS.find((r) => r.id === id)?.label)
                  .filter(Boolean)
                  .join(', ') || '선택 없음'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>말하기 회피</Text>
              <Text style={[styles.value, { color: theme.textPrimary }]}>
                {getLabel(AVOIDANCE_OPTIONS, surveyData.situations.avoidanceBehavior)}
              </Text>
            </View>
          </View>

          {/* Card 4: Family & Notes */}
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart" size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>4. 가족력 및 부모 소견</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>가족력</Text>
              <Text style={[styles.value, { color: theme.textPrimary }]}>
                {getLabel(FAMILY_HISTORY_OPTIONS, surveyData.family.familyHistory)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>부모 걱정 정도</Text>
              <Text style={[styles.value, { color: theme.primary, fontWeight: '700' }]}>
                {surveyData.family.parentConcernLevel}점 / 5점
              </Text>
            </View>
            <View style={styles.infoRowVertical}>
              <Text style={[styles.label, { color: theme.textSecondary, marginBottom: 4 }]}>상담 요청 및 전달사항</Text>
              <Text style={[styles.notesValue, { color: theme.textPrimary, backgroundColor: theme.chipBg }]}>
                {surveyData.family.therapistNotes || '작성된 특이사항이 없습니다.'}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.primary }]}
              onPress={handleCopyText}
              activeOpacity={0.8}
            >
              <Ionicons name={copied ? 'checkmark-circle' : 'copy-outline'} size={18} color="#FFF" />
              <Text style={styles.actionBtnText}>{copied ? '복사 완료!' : '결과 요약 복사'}</Text>
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
              <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>새 설문 작성</Text>
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
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoRowVertical: {
    paddingVertical: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 10,
  },
  notesValue: {
    fontSize: 13,
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
    lineHeight: 18,
  },
  modalActions: {
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
