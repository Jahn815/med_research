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

export const defaultTermsContentKr = `연구 참여 안내 및 동의서

<연구 동의서>
이 연구는 한국 말더듬 아동의 기질과 말더듬이 아동 및 부모에게 미치는 영향 사이의 관계를 알아보기 위한 연구입니다.
간편 행동억제 기질검사(Short Behavioral Inhibition Scale, SBIS)는 아동의 행동억제 기질을 측정하는 검사이고, 페일린 부모평가지(Palin Parent Rating Scale)는 말더듬이 아동 및 부모에게 미치는 영향 등을 평가하는 검사입니다.
본 연구에서는 연구를 위해 개발된 앱을 이용하여 아동의 배경정보를 입력하고 SBIS와 Palin 부모평가지에 응답하게 됩니다. 앱에 입력한 응답자료는 연구자료로 전자적으로 수집·저장됩니다.
검사 완료 후 앱을 통해 검사 결과를 확인할 수 있습니다. 제공되는 결과는 아동을 진단하기 위한 것이 아니라 아동과 부모의 특성을 이해하기 위한 참고자료입니다.
설문 및 검사 작성에는 약 10~15분 정도 소요됩니다.

<참여 자격>
말더듬 진단을 받은 적이 있는 유치원생 및 초등학생 자녀를 둔 부모님이 참여하실 수 있습니다. 과거에 말더듬 진단을 받았지만 현재는 회복된 아동의 부모님도 참여 가능합니다.

<앱 사용 및 연구자료 수집>
본 연구에 참여하는 경우 연구용 앱을 이용하여 설문과 검사를 실시합니다. 앱을 통해 입력한 아동의 배경정보와 검사 응답 및 검사 결과는 연구목적으로 수집·저장됩니다.
앱에 입력된 연구자료는 연구책임자 및 승인된 연구진만 접근할 수 있도록 관리하며, 연구결과 분석 및 학술논문·학술대회 발표 시 개인을 식별할 수 있는 정보는 공개하지 않습니다.
앱 사용 중 기술적인 문제가 발생하거나 사용을 원하지 않게 된 경우 언제든 연구 참여를 중단할 수 있습니다.

<개인 정보 및 연구자료 보호>
연구 진행 및 필요한 경우 연구 관련 연락을 위하여 보호자의 전화번호를 수집할 수 있습니다. 전화번호 등 개인을 식별할 수 있는 정보는 연구자료와 분리하여 관리하며 연구목적 이외의 용도로 사용하지 않습니다.
앱을 통해 수집된 전자자료는 안전하게 관리되며, 연구책임자 및 승인된 연구진만 접근할 수 있습니다. 연구자료는 관련 규정에 따라 일정 기간 보관한 후 안전한 방법으로 폐기합니다.

<연구 참여에 따른 위험과 이익>
본 연구는 설문 및 검사로 진행되므로 신체적 위험은 없습니다. 다만 자녀의 말더듬과 관련된 질문에 응답하는 과정에서 일시적인 심리적 부담을 느낄 수 있습니다.
연구 참여에 따른 직접적인 치료적 이익은 보장되지 않으며, 앱에서 제공되는 검사 결과 역시 의학적 또는 임상적 진단을 의미하지 않습니다.

<자발적 참여 및 철회>
본 연구 참여는 전적으로 자발적입니다. 앱 사용 및 연구자료 수집에 동의하지 않는 경우 연구에 참여하지 않을 수 있으며, 연구 참여를 거부하거나 연구 도중 참여를 중단하더라도 어떠한 불이익도 없습니다.
연구에 관하여 궁금한 사항이 있는 경우 언제든 연구자에게 문의하실 수 있습니다.

최다혜, 이수복 드림 
연구자 연락처:
최다혜: dchoi@southalabama.edu
이수복: sblee@wsu.ac.kr`;

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
      <View style={styles.overlay}>
        {/* Backdrop touch area to dismiss modal on background click */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Main Modal Card Container */}
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
            scrollEventThrottle={16}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.termsText, { color: theme.textPrimary }]} selectable={true}>
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 20 : 10,
  },
  modalCard: {
    width: '96%',
    maxWidth: 900,
    height: '92%',
    maxHeight: '92%',
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
    flexDirection: 'column',
    zIndex: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  modalHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
  },
  scrollArea: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  scrollContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },
  termsText: {
    fontSize: 15.5,
    lineHeight: 27,
    fontWeight: '400',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  agreeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  agreeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
