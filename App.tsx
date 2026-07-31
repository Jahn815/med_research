import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { lightTheme, darkTheme, ColorTheme } from './src/theme/colors';
import { SurveyState, SurveySection } from './src/types/survey';
import {
  SURVEY_SECTIONS,
  ONSET_AGE_OPTIONS,
  ONSET_SPEED_OPTIONS,
  SYMPTOM_OPTIONS,
  SITUATION_OPTIONS,
  REACTION_OPTIONS,
  AVOIDANCE_OPTIONS,
  FAMILY_HISTORY_OPTIONS,
} from './src/constants/surveyData';

import { Header } from './src/components/Header';
import { SectionNav } from './src/components/SectionNav';
import {
  CardWrapper,
  TextInputField,
  RadioChips,
  CheckboxChips,
  RatingPicker,
} from './src/components/QuestionCard';
import { SummaryModal } from './src/components/SummaryModal';
import { PalinSurveyView } from './src/components/PalinSurveyView';

const initialSurveyState: SurveyState = {
  childInfo: {
    childName: '',
    birthDate: '',
    ageMonths: '',
    gender: '',
    respondentRole: 'mother',
    surveyDate: new Date().toISOString().split('T')[0],
  },
  onset: {
    onsetAge: '',
    onsetSpeed: '',
    symptoms: [],
    severityRating: 3,
  },
  situations: {
    worseningSituations: [],
    childReaction: [],
    avoidanceBehavior: '',
  },
  family: {
    familyHistory: '',
    parentConcernLevel: 3,
    therapistNotes: '',
  },
};

type AppSurveyMode = 'palin' | 'standard';

export default function App() {
  const [surveyMode, setSurveyMode] = useState<AppSurveyMode>('palin');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<SurveySection>('info');
  const [surveyData, setSurveyData] = useState<SurveyState>(initialSurveyState);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

  const theme: ColorTheme = isDark ? darkTheme : lightTheme;

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleResetSurvey = () => {
    setSurveyData(initialSurveyState);
    setActiveSection('info');
  };

  const { progressPercent, sectionStatus } = useMemo(() => {
    let completedCount = 0;
    const totalRequiredItems = 10;

    if (surveyData.childInfo.childName) completedCount++;
    if (surveyData.childInfo.birthDate || surveyData.childInfo.ageMonths) completedCount++;
    if (surveyData.childInfo.gender) completedCount++;

    if (surveyData.onset.onsetAge) completedCount++;
    if (surveyData.onset.onsetSpeed) completedCount++;
    if (surveyData.onset.symptoms.length > 0) completedCount++;

    if (surveyData.situations.worseningSituations.length > 0) completedCount++;
    if (surveyData.situations.childReaction.length > 0) completedCount++;

    if (surveyData.family.familyHistory) completedCount++;
    if (surveyData.family.parentConcernLevel > 0) completedCount++;

    const percent = Math.min(100, (completedCount / totalRequiredItems) * 100);

    return {
      progressPercent: percent,
      sectionStatus: {
        info: Boolean(surveyData.childInfo.childName && surveyData.childInfo.gender),
        onset: Boolean(surveyData.onset.onsetAge && surveyData.onset.symptoms.length > 0),
        situations: Boolean(surveyData.situations.worseningSituations.length > 0),
        family: Boolean(surveyData.family.familyHistory),
      },
    };
  }, [surveyData]);

  const updateChildInfo = (key: keyof SurveyState['childInfo'], value: string) => {
    setSurveyData((prev) => ({
      ...prev,
      childInfo: { ...prev.childInfo, [key]: value },
    }));
  };

  const updateOnset = (key: keyof SurveyState['onset'], value: any) => {
    setSurveyData((prev) => ({
      ...prev,
      onset: { ...prev.onset, [key]: value },
    }));
  };

  const toggleSymptom = (symptomId: string) => {
    setSurveyData((prev) => {
      const exists = prev.onset.symptoms.includes(symptomId);
      const nextSymptoms = exists
        ? prev.onset.symptoms.filter((id) => id !== symptomId)
        : [...prev.onset.symptoms, symptomId];
      return { ...prev, onset: { ...prev.onset, symptoms: nextSymptoms } };
    });
  };

  const updateSituations = (key: keyof SurveyState['situations'], value: any) => {
    setSurveyData((prev) => ({
      ...prev,
      situations: { ...prev.situations, [key]: value },
    }));
  };

  const toggleWorseningSituation = (id: string) => {
    setSurveyData((prev) => {
      const exists = prev.situations.worseningSituations.includes(id);
      const nextList = exists
        ? prev.situations.worseningSituations.filter((item) => item !== id)
        : [...prev.situations.worseningSituations, id];
      return { ...prev, situations: { ...prev.situations, worseningSituations: nextList } };
    });
  };

  const toggleChildReaction = (id: string) => {
    setSurveyData((prev) => {
      const exists = prev.situations.childReaction.includes(id);
      const nextList = exists
        ? prev.situations.childReaction.filter((item) => item !== id)
        : [...prev.situations.childReaction, id];
      return { ...prev, situations: { ...prev.situations, childReaction: nextList } };
    });
  };

  const updateFamily = (key: keyof SurveyState['family'], value: any) => {
    setSurveyData((prev) => ({
      ...prev,
      family: { ...prev.family, [key]: value },
    }));
  };

  const sectionKeys: SurveySection[] = ['info', 'onset', 'situations', 'family'];
  const currentIndex = sectionKeys.indexOf(activeSection);

  const handleNextSection = () => {
    if (currentIndex < sectionKeys.length - 1) {
      setActiveSection(sectionKeys[currentIndex + 1]);
    } else {
      setShowSummaryModal(true);
    }
  };

  const handlePrevSection = () => {
    if (currentIndex > 0) {
      setActiveSection(sectionKeys[currentIndex - 1]);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Mode Selector Segment Control */}
        <View style={[styles.modeBar, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <TouchableOpacity
            style={[
              styles.modeSegment,
              {
                backgroundColor: surveyMode === 'palin' ? theme.primary : 'transparent',
              },
            ]}
            onPress={() => setSurveyMode('palin')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="document-attach"
              size={16}
              color={surveyMode === 'palin' ? '#FFFFFF' : theme.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.modeSegmentText,
                {
                  color: surveyMode === 'palin' ? '#FFFFFF' : theme.textSecondary,
                  fontWeight: surveyMode === 'palin' ? '700' : '600',
                },
              ]}
            >
              Palin 부모평가지 & 기질검사 (연구용)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeSegment,
              {
                backgroundColor: surveyMode === 'standard' ? theme.primary : 'transparent',
              },
            ]}
            onPress={() => setSurveyMode('standard')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="clipboard-outline"
              size={16}
              color={surveyMode === 'standard' ? '#FFFFFF' : theme.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.modeSegmentText,
                {
                  color: surveyMode === 'standard' ? '#FFFFFF' : theme.textSecondary,
                  fontWeight: surveyMode === 'standard' ? '700' : '600',
                },
              ]}
            >
              임상 선별 설문지
            </Text>
          </TouchableOpacity>
        </View>

        {/* MODE 1: PALIN FORM DECODED SURVEY */}
        {surveyMode === 'palin' ? (
          <PalinSurveyView
            theme={theme}
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
          />
        ) : (
          /* MODE 2: STANDARD CLINICAL QUESTIONNAIRE */
          <View style={{ flex: 1 }}>
            <Header
              theme={theme}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
              progressPercent={progressPercent}
              onReset={handleResetSurvey}
            />

            <SectionNav
              theme={theme}
              activeSection={activeSection}
              onSelectSection={setActiveSection}
              sectionStatus={sectionStatus}
            />

            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {activeSection === 'info' && (
                <View style={styles.sectionContainer}>
                  <CardWrapper
                    theme={theme}
                    title="아동 기본 정보"
                    subtitle="언어치료 평가 및 기록을 위한 기초 정보입니다."
                    required
                  >
                    <TextInputField
                      theme={theme}
                      label="아동 이름"
                      placeholder="예: 홍길동"
                      value={surveyData.childInfo.childName}
                      onChangeText={(val) => updateChildInfo('childName', val)}
                    />

                    <View style={styles.rowTwoCols}>
                      <View style={{ flex: 1 }}>
                        <TextInputField
                          theme={theme}
                          label="생년월일 (YYYY-MM-DD)"
                          placeholder="2021-05-15"
                          value={surveyData.childInfo.birthDate}
                          onChangeText={(val) => updateChildInfo('birthDate', val)}
                        />
                      </View>
                      <View style={{ width: 100 }}>
                        <TextInputField
                          theme={theme}
                          label="연령 (개월)"
                          placeholder="42"
                          value={surveyData.childInfo.ageMonths}
                          onChangeText={(val) => updateChildInfo('ageMonths', val)}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    <View style={styles.fieldSpacer}>
                      <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>성별 *</Text>
                      <RadioChips
                        theme={theme}
                        options={[
                          { label: '남아 (Male)', value: 'male' },
                          { label: '여아 (Female)', value: 'female' },
                        ]}
                        selectedValue={surveyData.childInfo.gender}
                        onSelect={(val) => updateChildInfo('gender', val)}
                      />
                    </View>

                    <View style={styles.fieldSpacer}>
                      <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>작성자 (아동과의 관계) *</Text>
                      <RadioChips
                        theme={theme}
                        options={[
                          { label: '어머니', value: 'mother' },
                          { label: '아버지', value: 'father' },
                          { label: '조부모', value: 'grandparent' },
                          { label: '기타', value: 'other' },
                        ]}
                        selectedValue={surveyData.childInfo.respondentRole}
                        onSelect={(val) => updateChildInfo('respondentRole', val)}
                      />
                    </View>

                    <TextInputField
                      theme={theme}
                      label="작성일자"
                      placeholder="2026-07-30"
                      value={surveyData.childInfo.surveyDate}
                      onChangeText={(val) => updateChildInfo('surveyDate', val)}
                    />
                  </CardWrapper>
                </View>
              )}

              {activeSection === 'onset' && (
                <View style={styles.sectionContainer}>
                  <CardWrapper
                    theme={theme}
                    title="말더듬 시작 시기 및 특징"
                    subtitle="말더듬이 처음 관찰된 시기와 양상을 선택해주세요."
                    required
                  >
                    <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>1) 말더듬 시작 시기 *</Text>
                    <RadioChips
                      theme={theme}
                      options={ONSET_AGE_OPTIONS}
                      selectedValue={surveyData.onset.onsetAge}
                      onSelect={(val) => updateOnset('onsetAge', val)}
                    />
                  </CardWrapper>

                  <CardWrapper
                    theme={theme}
                    title="말더듬 시작 양상"
                    subtitle="증상이 처음에 어떻게 시작되었나요?"
                    required
                  >
                    <RadioChips
                      theme={theme}
                      options={ONSET_SPEED_OPTIONS}
                      selectedValue={surveyData.onset.onsetSpeed}
                      onSelect={(val) => updateOnset('onsetSpeed', val)}
                    />
                  </CardWrapper>

                  <CardWrapper
                    theme={theme}
                    title="관찰되는 주요 증상 (중복 선택 가능)"
                    subtitle="아동에게 주로 나타나는 말더듬 특성을 모두 선택하세요."
                    required
                  >
                    <CheckboxChips
                      theme={theme}
                      options={SYMPTOM_OPTIONS}
                      selectedValues={surveyData.onset.symptoms}
                      onToggle={toggleSymptom}
                    />
                  </CardWrapper>

                  <CardWrapper
                    theme={theme}
                    title="부모님이 느끼시는 말더듬 심도 평가"
                    subtitle="현재 아동의 말더듬 정도를 1점(경미)~5점(매우 심함)으로 평가해주세요."
                  >
                    <RatingPicker
                      theme={theme}
                      rating={surveyData.onset.severityRating}
                      onRatingChange={(val) => updateOnset('severityRating', val)}
                    />
                  </CardWrapper>
                </View>
              )}

              {activeSection === 'situations' && (
                <View style={styles.sectionContainer}>
                  <CardWrapper
                    theme={theme}
                    title="말더듬이 심해지는 상황 (다중 선택)"
                    subtitle="어떤 상황에서 아동의 말 더듬는 현상이 더 자주 나타나나요?"
                    required
                  >
                    <CheckboxChips
                      theme={theme}
                      options={SITUATION_OPTIONS}
                      selectedValues={surveyData.situations.worseningSituations}
                      onToggle={toggleWorseningSituation}
                    />
                  </CardWrapper>

                  <CardWrapper
                    theme={theme}
                    title="말더듬 발생 시 아동의 정서/행동 반응 (다중 선택)"
                    subtitle="말이 막히거나 더듬을 때 아동이 보이는 주된 반응입니다."
                    required
                  >
                    <CheckboxChips
                      theme={theme}
                      options={REACTION_OPTIONS}
                      selectedValues={surveyData.situations.childReaction}
                      onToggle={toggleChildReaction}
                    />
                  </CardWrapper>

                  <CardWrapper
                    theme={theme}
                    title="말하기 회피 행동 여부"
                    subtitle="말을 더듬을까 봐 말을 하지 않거나 피하는 경향이 있나요?"
                  >
                    <RadioChips
                      theme={theme}
                      options={AVOIDANCE_OPTIONS}
                      selectedValue={surveyData.situations.avoidanceBehavior}
                      onSelect={(val) => updateSituations('avoidanceBehavior', val)}
                    />
                  </CardWrapper>
                </View>
              )}

              {activeSection === 'family' && (
                <View style={styles.sectionContainer}>
                  <CardWrapper
                    theme={theme}
                    title="말더듬 가족력 여부"
                    subtitle="친가나 외가에 말더듬이나 언어 발달 관련 이력이 있는 분이 계신가요?"
                    required
                  >
                    <RadioChips
                      theme={theme}
                      options={FAMILY_HISTORY_OPTIONS}
                      selectedValue={surveyData.family.familyHistory}
                      onSelect={(val) => updateFamily('familyHistory', val)}
                    />
                  </CardWrapper>

                  <CardWrapper
                    theme={theme}
                    title="부모(보호자)의 걱정 정도"
                    subtitle="아동의 말더듬에 대해 현재 부모님이 느끼는 염려와 스트레스 수준입니다."
                  >
                    <RatingPicker
                      theme={theme}
                      rating={surveyData.family.parentConcernLevel}
                      onRatingChange={(val) => updateFamily('parentConcernLevel', val)}
                      labels={['걱정 적음', '약간 걱정됨', '보통', '많이 걱정됨', '매우 염려됨']}
                    />
                  </CardWrapper>

                  <CardWrapper
                    theme={theme}
                    title="언어치료사 전달사항 및 궁금한 점"
                    subtitle="상담 시 꼭 전달하고 싶거나 문의하고자 하는 내용을 작성해주세요."
                  >
                    <TextInputField
                      theme={theme}
                      label="상담 메모"
                      placeholder="예: 가정에서 어떻게 대처하면 좋은지, 평가 시 주의사항 등"
                      value={surveyData.family.therapistNotes}
                      onChangeText={(val) => updateFamily('therapistNotes', val)}
                      multiline
                      numberOfLines={4}
                    />
                  </CardWrapper>
                </View>
              )}
            </ScrollView>

            <View style={[styles.bottomBar, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
              {currentIndex > 0 && (
                <TouchableOpacity
                  style={[styles.navButton, styles.prevButton, { borderColor: theme.cardBorder }]}
                  onPress={handlePrevSection}
                  activeOpacity={0.8}
                >
                  <Ionicons name="chevron-back" size={18} color={theme.textPrimary} />
                  <Text style={[styles.navButtonText, { color: theme.textPrimary }]}>이전</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.navButton,
                  styles.nextButton,
                  { backgroundColor: theme.primary, flex: 1 },
                ]}
                onPress={handleNextSection}
                activeOpacity={0.8}
              >
                <Text style={[styles.navButtonText, { color: '#FFFFFF', fontWeight: '700' }]}>
                  {currentIndex === sectionKeys.length - 1 ? '결과 보고서 보기' : '다음 단계'}
                </Text>
                <Ionicons
                  name={currentIndex === sectionKeys.length - 1 ? 'document-text' : 'chevron-forward'}
                  size={18}
                  color="#FFFFFF"
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            </View>

            <SummaryModal
              visible={showSummaryModal}
              theme={theme}
              surveyData={surveyData}
              onClose={() => setShowSummaryModal(false)}
              onReset={handleResetSurvey}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  modeBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 8,
  },
  modeSegment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  modeSegmentText: {
    fontSize: 12,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  sectionContainer: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldSpacer: {
    marginVertical: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  prevButton: {
    borderWidth: 1,
  },
  nextButton: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
