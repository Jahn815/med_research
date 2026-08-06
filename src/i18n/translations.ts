export type Language = 'ko' | 'en';

export const i18n = {
  ko: {
    // Mode Switcher
    palinMode: 'Palin 부모평가지 & 기질검사 (연구용)',
    standardMode: '임상 선별 설문지',
    
    // Header & Badges
    clinicalBadge: '언어치료 / 임상 평가',
    researchBadge: '한국 말더듬 연구 (SBIS & Palin PPRS)',
    appTitle: '말더듬아동 부모 설문지',
    appSubtitle: 'Stuttering Parent Questionnaire for Clinical & Research Evaluation',
    progressLabel: '설문 작성 진행률',
    
    // Buttons & Actions
    nextStep: '다음 단계',
    prevStep: '이전',
    prevSection: '이전 영역',
    nextSection: '다음 영역',
    viewReport: '결과 보고서 보기',
    copySummary: '결과 요약 복사',
    copied: '복사 완료!',
    resetSurvey: '설문 초기화',
    newSurvey: '새 설문 작성',
    close: '닫기',

    // Modal Titles
    palinReportTitle: 'Palin 평가지 결과 보고서',
    standardReportTitle: '설문 결과 보고서',
    surveyStatus: '설문 완료 현황',
    consentStatus: '연구 동의 여부',
    agreed: '동의함 (Agreed)',
    notAgreed: '미동의 (Not Agreed)',

    // Scale Scores
    sbisTitle: '1. 간편 행동억제기질검사 (SBIS)',
    sbisDesc: 'Short Behavioral Inhibition Scale (5문항 총점)',
    pprsTitle: '2. Palin 부모 평가지 (PPRS) 3대 하위 척도',
    pprsSub1: '하위척도 1: 아이에게 미치는 영향',
    pprsSub1Desc: '(말하기 감소, 좌절감, 짜증, 불안 등)',
    pprsSub2: '하위척도 2: 말더듬 심도 및 부모의 걱정',
    pprsSub2Desc: '(빈도, 심도, 미래 불안, 가족 영향)',
    pprsSub3: '하위척도 3: 부모의 지식 및 대처 자신감',
    pprsSub3Desc: '(영향 요인 인지, 대응 및 격려 자신감)',
    avgScore: '평균',

    // Standard Survey Labels
    sec1Title: '1. 기본 정보',
    sec2Title: '2. 말더듬 시작 및 증상',
    sec3Title: '3. 상황별 양상 및 반응',
    sec4Title: '4. 가족력 및 부모 소견',

    childName: '아동 이름',
    birthDate: '생년월일',
    ageMonths: '연령 (개월)',
    gender: '성별',
    respondentRole: '작성자',
    surveyDate: '작성일자',
    male: '남아',
    female: '여아',
    mother: '어머니',
    father: '아버지',
    grandparent: '조부모',
    other: '기타',
  },

  en: {
    // Mode Switcher
    palinMode: 'Palin Rating Scale & SBIS (Research)',
    standardMode: 'Standard Clinical Screening',
    
    // Header & Badges
    clinicalBadge: 'Speech Therapy / Clinical Assessment',
    researchBadge: 'Stuttering Research (SBIS & Palin PPRS)',
    appTitle: 'Stuttering Parent Questionnaire',
    appSubtitle: 'Parent Questionnaire for Clinical & Research Evaluation',
    progressLabel: 'Survey Completion Progress',
    
    // Buttons & Actions
    nextStep: 'Next Step',
    prevStep: 'Previous',
    prevSection: 'Previous Section',
    nextSection: 'Next Section',
    viewReport: 'View Score Report',
    copySummary: 'Copy Result Summary',
    copied: 'Copied!',
    resetSurvey: 'Reset Survey',
    newSurvey: 'Start New Survey',
    close: 'Close',

    // Modal Titles
    palinReportTitle: 'Palin Scale Score Report',
    standardReportTitle: 'Clinical Survey Report',
    surveyStatus: 'Completion Status',
    consentStatus: 'Research Consent',
    agreed: 'Agreed',
    notAgreed: 'Not Agreed',

    // Scale Scores
    sbisTitle: '1. Short Behavioral Inhibition Scale (SBIS)',
    sbisDesc: 'Behavioral Inhibition Scale (Sum of 5 items)',
    pprsTitle: '2. Palin Parent Rating Scale (PPRS) 3 Subscales',
    pprsSub1: 'Subscale 1: Impact on Child',
    pprsSub1Desc: '(Reduced speaking, frustration, annoyance, anxiety)',
    pprsSub2: 'Subscale 2: Severity & Parent Concern',
    pprsSub2Desc: '(Frequency, severity, future anxiety, family impact)',
    pprsSub3: 'Subscale 3: Parent Knowledge & Confidence',
    pprsSub3Desc: '(Knowledge of impact factors, confidence in managing)',
    avgScore: 'Avg',

    // Standard Survey Labels
    sec1Title: '1. Basic Info',
    sec2Title: '2. Onset & Symptoms',
    sec3Title: '3. Situational Impact',
    sec4Title: '4. Family & Notes',

    childName: "Child's Name",
    birthDate: 'Date of Birth',
    ageMonths: 'Age (Months)',
    gender: 'Gender',
    respondentRole: 'Respondent',
    surveyDate: 'Date of Survey',
    male: 'Male',
    female: 'Female',
    mother: 'Mother',
    father: 'Father',
    grandparent: 'Grandparent',
    other: 'Other',
  },
};
