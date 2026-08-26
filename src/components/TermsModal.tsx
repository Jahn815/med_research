import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColorTheme } from '../theme/colors';
import { Language } from '../i18n/translations';

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
  onAgreeAndClose?: () => void;
  theme: ColorTheme;
  lang: Language;
  termsContentKr?: string;
  termsContentEn?: string;
}

export const defaultTermsContentKr = `[연구 참여 동의서 및 이용 약관]

1. 연구 목적 및 개요
본 연구는 한국 말더듬 아동의 기질(행동억제기질)과 말더듬이 아동 및 가족에게 미치는 심리·사회적 영향 간의 관계를 탐구하기 위해 시행되는 학술 연구입니다. 본 설문을 통해 제공해 주시는 응답은 언어병리학 및 말더듬 중재 연구의 소중한 기초 자료로 활용됩니다.

2. 참여 자격 및 절차
- 대상: 말더듬 진단을 받은 적이 있는 유치원생 및 초등학생 자녀를 둔 부모(보호자)
- 작성 소요 시간: 약 10분 ~ 15분
- 본 설문은 연구 참여 동의서 확인 후 진행할 수 있으며, 자발적 동의에 의해서만 작성됩니다.

3. 개인정보 보호 및 데이터 관리
- 익명성 보장: 본 연구는 아동 및 보호자의 주민등록번호, 실명 등 개인식별정보를 수집하지 않습니다.
- 데이터 보관: 수집된 연구 데이터는 암호화되어 안전하게 보관되며, 오직 연구 목적 이외의 어떠한 용도로도 유출되거나 사용되지 않습니다.
- 자발적 철회: 귀하는 설문 작성 중 언제라도 자발적으로 참여를 중단할 권리가 있습니다.

4. 연구진 연락처
- 책임연구자: 최다혜, 이수복 드림
- 문의사항이 있으신 경우 담당 연구팀으로 연락해 주시기 바랍니다.`;

export const defaultTermsContentEn = `[Research Participation Consent Terms & Conditions]

1. Study Purpose & Overview
This study investigates the relationship between behavioral inhibition temperament in Korean children who stutter and the psychosocial impact of stuttering on the child and family. Your answers provide invaluable baseline data for clinical speech-language pathology research.

2. Eligibility & Procedure
- Eligible Participants: Parents or legal guardians of preschool and elementary school children diagnosed with (or with a history of) stuttering.
- Estimated Completion Time: Approx. 10 - 15 minutes.
- Participation is strictly voluntary upon reviewing and agreeing to these consensual terms and conditions.

3. Privacy & Data Confidentiality
- Confidentiality & Anonymity: No personal identification numbers or legal full names are collected.
- Data Storage: Collected research data is encrypted and securely stored. Data will be strictly restricted to academic research purposes.
- Right to Withdraw: You maintain the right to withdraw from this study at any time during questionnaire completion.

4. Research Team Contact
- Principal Investigators: Dahye Choi, Subok Lee
- For inquiries regarding this study, please contact the research team.`;

export const TermsModal: React.FC<TermsModalProps> = ({
  visible,
  onClose,
  onAgreeAndClose,
  theme,
  lang,
  termsContentKr,
  termsContentEn,
}) => {
  const content =
    lang === 'en'
      ? termsContentEn || defaultTermsContentEn
      : termsContentKr || defaultTermsContentKr;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.modalCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              {/* Modal Header */}
              <View style={[styles.modalHeader, { borderBottomColor: theme.cardBorder }]}>
                <View style={styles.modalHeaderTitleGroup}>
                  <Ionicons name="document-text-sharp" size={22} color={theme.primary} />
                  <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                    {lang === 'en'
                      ? 'Research Terms & Conditions'
                      : '연구 참여 동의서 및 약관 전문'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
                  <Ionicons name="close" size={22} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Scrollable Terms Content */}
              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
              >
                <Text style={[styles.termsText, { color: theme.textPrimary }]}>
                  {content}
                </Text>
              </ScrollView>

              {/* Modal Footer Actions */}
              <View style={[styles.modalFooter, { borderTopColor: theme.cardBorder, backgroundColor: theme.chipBg }]}>
                <TouchableOpacity
                  style={[styles.cancelBtn, { borderColor: theme.cardBorder }]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>
                    {lang === 'en' ? 'Close' : '닫기'}
                  </Text>
                </TouchableOpacity>

                {onAgreeAndClose && (
                  <TouchableOpacity
                    style={[styles.agreeBtn, { backgroundColor: theme.primary }]}
                    onPress={() => {
                      onAgreeAndClose();
                      onClose();
                    }}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.agreeBtnText}>
                      {lang === 'en' ? 'Agree & Proceed' : '동의하고 계속하기'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 680,
    maxHeight: '85%',
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
    borderRadius: 8,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '400',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  agreeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  agreeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
